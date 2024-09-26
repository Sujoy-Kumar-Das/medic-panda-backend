import QueryBuilder from '../../builder/queryBuilder';
import AppError from '../../errors/AppError';
import { sslInitPaymentService } from '../../ssl/ssl.service';
import generateTransactionId from '../../utils/generateTransactionId';
import { productDetailModel } from '../porductDetail/productDetail.model';
import { productModel } from '../product/porduct.model';
import { userModel } from '../user/user.model';
import { IOrder, OrderStatus } from './order.interface';
import { orderModel } from './order.model';

const createOrderService = async (id: string, payload: IOrder) => {
  const { product, quantity } = payload;

  // check is the user exists
  const user = await userModel.findById(id);

  if (!user) {
    throw new AppError(404, 'User not found.');
  }

  //   check is the product is available

  const isProductExists = await productModel.findById(product);

  if (!isProductExists) {
    throw new AppError(403, `This product is not found.`);
  }

  //   is product deleted
  const isProductDeleted = isProductExists.isDeleted;

  if (isProductDeleted) {
    throw new AppError(403, `This product is deleted.`);
  }

  //   is product status available
  const productStockStatus = isProductExists.stockStatus;

  if (!productStockStatus) {
    throw new AppError(403, `This product is stock out.`);
  }

  //   check product details
  const productDetails = await productDetailModel.findOne({
    product,
  });

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

  //   is enough stock available for order.
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

  const paymentData = {
    total: payload.total,
    productId: product,
    productName: isProductExists.name,
    country: 'ffffffffff',
    phone: 'fffffffffffff',
    city: 'fffffffffff',
    userEmail: user.email,
    userAddress: '',
    transactionId: payload.paymentId,
  };

  const paymentUrl = await sslInitPaymentService(paymentData);

  if (!paymentUrl) {
    throw new AppError(403, 'Something went wrong while payment.');
  }

  // save to db
  const result = await orderModel.create(payload);

  if (!result._id) {
    throw new AppError(403, 'Failed to place order.Try again later.');
  }

  return {
    paymentUrl,
  };
};

// get all order service by admin and supper admin
const getAllOrderServiceByAdmin = async () => {
  const result = await orderModel.find();
  return result;
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

// cancel order by user, admin and supper admin
const cancelOrderService = async (userId: string, orderId: string) => {
  const order = await orderModel.findById(orderId);

  if (!order) {
    throw new AppError(404, 'This order is not found.');
  }

  if (order.isCanceled) {
    throw new AppError(403, 'This order already canceled. ');
  }

  if (order.isDeleted) {
    throw new AppError(403, 'This order is not found. ');
  }

  if (order.status !== OrderStatus.PENDING) {
    throw new AppError(404, "This order already can't cancel this order.");
  }

  const result = await orderModel.findByIdAndUpdate(
    orderId,
    { isCanceled: true },
    { new: true },
  );
  return result;
};

// delete order by user, admin and supper admin
const deleteOrderService = async (userId: string, orderId: string) => {
  const order = await orderModel.findById(orderId);

  if (!order) {
    throw new AppError(404, 'This order is not found.');
  }

  if (order.isDeleted) {
    throw new AppError(403, 'This order already deleted. ');
  }

  const result = await orderModel.findByIdAndUpdate(
    orderId,
    {
      isDeleted: true,
    },
    { new: true },
  );
  return result;
};

export const orderService = {
  createOrderService,
  getAllOrderServiceByAdmin,
  cancelOrderService,
  getAllOrderService,
  deleteOrderService,
};
