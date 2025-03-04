import mongoose, { Types } from 'mongoose';
import QueryBuilder from '../../builder/queryBuilder';
import AppError from '../../errors/AppError';
import { sslInitPaymentService } from '../../ssl/ssl.service';
import generateTransactionId from '../../utils/generateTransactionId';
import { cartModel } from '../cart/cart.model';
import { customerModel } from '../customer/customer.model';
import { PaymentModel } from '../payment/payment.model';
import { productDetailModel } from '../porductDetail/productDetail.model';
import { productModel } from '../product/porduct.model';
import { userModel } from '../user/user.model';
import { allowedOrderStatusTransitions } from './allowedOrderStatusTransitions';
import { IOrder, IShippingAddress, OrderStatus } from './order.interface';
import { orderModel } from './order.model';

const createOrderService = async (id: string, payload: Partial<IOrder>) => {
  const session = await mongoose.startSession();

  const { product, quantity } = payload;

  try {
    session.startTransaction(); //start session

    // check is the user exists
    const user = await userModel.findUserWithID(id, session);

    const validUser = !user || user.isBlocked || user.isDeleted;

    if (validUser) {
      throw new AppError(404, 'User not found.');
    }

    //   check is the product is available

    const isProductExists = await productModel.isProductExistsById(
      String(product),
      session,
    );

    const isValidProduct = !isProductExists || isProductExists.isDeleted;

    if (isValidProduct) {
      throw new AppError(403, `This product is not found.`);
    }

    //   is product status available
    const productStockStatus = isProductExists.stockStatus;

    if (!productStockStatus) {
      throw new AppError(403, `This product is stock out.`);
    }

    //   check product details
    const productDetails = await productDetailModel
      .findOne({
        product,
      })
      .session(session);

    if (!productDetails) {
      throw new AppError(404, 'This product is not found.');
    }

    //   is product active
    const isActive = productDetails?.status;

    if (isActive === 'inactive') {
      throw new AppError(403, 'This product has been closed.');
    }

    //   is stock available
    const stockProduct = productDetails?.stock;

    if (!stockProduct) {
      throw new AppError(403, 'This product has been stock out.');
    }

    // is enough stock available for order.
    if (Number(stockProduct) < Number(quantity)) {
      throw new AppError(
        403,
        `Not enough stock. We have only ${stockProduct} products yet.`,
      );
    }

    payload.user = user?._id;

    payload.total =
      Number(quantity) *
      (isProductExists.discount?.discountStatus
        ? Number(isProductExists.discount.discountPrice)
        : Number(isProductExists.price));

    payload.paymentId = generateTransactionId();

    // destructuring payload.shippingAddress

    const { city, country, contact, street, postalCode } =
      payload.shippingAddress as IShippingAddress;

    const paymentData = {
      total: payload.total,
      productId: product as Types.ObjectId,
      productName: isProductExists.name,
      country: country,
      phone: contact,
      city: city,
      userEmail: user.email,
      userAddress: `${street}-${postalCode}-${street}-${city}-${country}`,
      transactionId: payload.paymentId,
    };

    const paymentUrl = await sslInitPaymentService(paymentData);

    if (!paymentUrl) {
      throw new AppError(403, 'Something went wrong while payment.');
    }

    // save to db
    const result = await orderModel.create([payload], { session });

    if (!result[0]._id) {
      throw new AppError(403, 'Failed to place order.Try again later.');
    }

    const cartRes = await cartModel
      .findOneAndDelete({
        product,
        user: user._id,
      })
      .session(session);

    if (!cartRes?._id) {
      throw new AppError(403, 'Failed to place order.Try again later.');
    }

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    const order = await orderModel.findById(result[0]._id).populate('product');

    return {
      paymentUrl,
      order,
      cartId: cartRes._id,
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    await session.abortTransaction(); // Rollback transaction on error
    session.endSession();
    throw new AppError(403, 'Failed To place order');
  }
};

// get all order service by admin and supper admin
const getAllOrderServiceByAdmin = async (query: Record<string, unknown>) => {
  // Build the query with filters
  const ordersQuery = new QueryBuilder(orderModel.find(), query)
    .filter()
    .sort()
    .paginate();

  // Execute the query
  const orders = await ordersQuery.modelQuery;

  return orders;
};

// get all order by user
const getAllOrderService = async (
  id: string,
  query: Record<string, unknown>,
) => {
  // Build the query with filters
  const ordersQuery = new QueryBuilder(
    orderModel.find({ user: id }).populate('product'),
    query,
  )
    .filter()
    .sort()
    .paginate();

  // Execute the query
  const orders = await ordersQuery.modelQuery;

  return orders;
};

// get all order by user
const getSingleOrderService = async (id: string, userId: string) => {
  const order = await orderModel
    .findOne({ _id: id, user: userId })
    .populate('product');

  const paymentInfo = await PaymentModel.findOne({
    transactionId: order?.paymentId,
  });

  const userInfo = await customerModel
    .findOne({ user: userId })
    .populate('user');

  const result = { order, userInfo, paymentInfo };

  return result;
};

// cancel order by user, admin and supper admin
const cancelOrderService = async (userId: string, orderId: string) => {
  const order = await orderModel.findById(orderId);

  if (!order) {
    throw new AppError(404, 'This order is not found.');
  }

  if (order.status === OrderStatus.CANCELED) {
    throw new AppError(403, 'This order already canceled. ');
  }

  if (order.status === OrderStatus.SHIPPED) {
    throw new AppError(404, "This order already shifted, you can't cancel it.");
  }

  if (order.status === OrderStatus.DELIVERED) {
    throw new AppError(
      404,
      "This order already delivered, you can't cancel it.",
    );
  }

  if (order.status === OrderStatus.RETURNED) {
    throw new AppError(404, "This order already , you can't cancel it.");
  }

  const result = await orderModel.findByIdAndUpdate(
    orderId,
    { status: OrderStatus.CANCELED },
    { new: true },
  );
  return result;
};

const changeOrderStatusService = async (
  orderId: string,
  payload: { status: OrderStatus },
) => {
  const { status } = payload;

  const order = await orderModel.findById(orderId);

  if (!order) {
    throw new AppError(404, 'This order is not found.');
  }

  const currentStatus = order.status;

  if (!allowedOrderStatusTransitions[currentStatus].includes(status)) {
    throw new AppError(400, `You can not change ${currentStatus} to ${status}`);
  }

  const result = await orderModel.findByIdAndUpdate(
    orderId,
    { status },
    { new: true },
  );

  if (result?.status !== status) {
    throw new AppError(400, 'Failed to update the status.');
  }

  return result;
};

// delete order by user, admin and supper admin
const deleteOrderService = async (userId: string, orderId: string) => {
  const order = await orderModel.findById(orderId);

  if (!order) {
    throw new AppError(404, 'This order is not found.');
  }

  const result = await orderModel.findByIdAndDelete(orderId);
  return result;
};

export const orderService = {
  createOrderService,
  getAllOrderServiceByAdmin,
  cancelOrderService,
  getAllOrderService,
  getSingleOrderService,
  deleteOrderService,
  changeOrderStatusService,
};
