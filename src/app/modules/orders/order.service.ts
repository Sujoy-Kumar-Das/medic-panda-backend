import mongoose, { Types } from 'mongoose';
import { AggregationQueryBuilder } from '../../builder/ AggregationQueryBuilder';
import QueryBuilder from '../../builder/queryBuilder';
import AppError from '../../errors/AppError';
import { sslInitPaymentService } from '../../ssl/ssl.service';
import generateTransactionId from '../../utils/generateTransactionId';
import { cartModel } from '../cart/cart.model';
import { customerModel } from '../customer/customer.model';
import { PaymentModel } from '../payment/payment.model';
import { productDetailModel } from '../porductDetail/productDetail.model';
import { productModel } from '../product/porduct.model';
import { allowedOrderStatusTransitions } from './allowedOrderStatusTransitions';
import { IOrder, IShippingInfo, OrderStatus } from './order.interface';
import { orderModel } from './order.model';

const createOrderService = async (userId: string, payload: Partial<IOrder>) => {
  const session = await mongoose.startSession();

  const { product, quantity, shippingInfo } = payload;

  try {
    session.startTransaction(); //start session

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

    payload.user = new Types.ObjectId(userId);

    payload.total =
      Number(quantity) *
      (isProductExists.discount?.discountStatus
        ? Number(isProductExists.discount.discountPrice)
        : Number(isProductExists.price));

    payload.paymentId = generateTransactionId();

    // destructuring payload.shippingAddress

    const {
      address: { city, country, street, postalCode },
      contact,
      email,
    } = shippingInfo as IShippingInfo;

    const paymentData = {
      total: payload.total,
      productId: product as Types.ObjectId,
      productName: isProductExists.name,
      country: country,
      phone: contact,
      city: city,
      userEmail: email,
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
        user: new Types.ObjectId(userId),
      })
      .session(session);

    if (!cartRes?._id) {
      throw new AppError(403, 'Failed to place order.Try again later.');
    }

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    return {
      paymentUrl,
    };
  } catch {
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
  const builder = new AggregationQueryBuilder(orderModel, query)
    .match({ user: new Types.ObjectId(id) })
    .lookup('products', 'product', '_id', 'product')
    .unwind('product')
    .search('product.name')
    .filter()
    .sort()
    .paginate();

  const result = await builder.exec();

  const meta = await builder.countTotal();

  return {
    result,
    meta,
  };
};

// get all order by user
const getSingleOrderService = async (id: string, userId: string) => {
  const [order, userInfo] = await Promise.all([
    orderModel.findOne({ _id: id, user: userId }).populate('product'),
    customerModel.findOne({ user: userId }).populate('user'),
  ]);

  if (!order) throw new AppError(404, 'Order not found');

  const paymentInfo = await PaymentModel.findOne({
    transactionId: order.paymentId,
  });

  return { order, userInfo, paymentInfo };
};

// get all order by user
const getSingleOrderServiceByAdmin = async (id: string) => {
  const order = await orderModel.findOne({ _id: id }).populate('product');

  const paymentInfo = await PaymentModel.findOne({
    transactionId: order?.paymentId,
  });

  const userInfo = await customerModel
    .findOne({ user: order?.user })
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

  const allowedOrderStatus = allowedOrderStatusTransitions[currentStatus];

  if (!allowedOrderStatus.includes(status)) {
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
  getSingleOrderServiceByAdmin,
};
