/* eslint-disable @typescript-eslint/no-explicit-any */
import { startSession, Types } from 'mongoose';
import AppError from '../../errors/AppError';
import { sslInitPaymentService } from '../../ssl/ssl.service';
import { cartModel } from '../cart/cart.model';
import { orderModel } from '../orders/order.model';
import { productDetailModel } from '../porductDetail/productDetail.model';
import { productModel } from '../product/porduct.model';
import { userModel } from '../user/user.model';
import { PaymentModel } from './payment.model';

const successPaymentService = async (payload: any) => {
  if (payload.status !== 'VALID') {
    throw new AppError(403, 'Failed to process payment.');
  }

  const session = await startSession();
  session.startTransaction();

  try {
    const order = await orderModel.findOne(
      { paymentId: payload.tran_id },
      null,
      { session },
    );

    if (!order) {
      throw new AppError(404, 'Order not found.');
    }

    const productDetail = await productDetailModel.findOne(
      { product: order.product },
      null,
      { session },
    );

    if (!productDetail) {
      throw new AppError(404, 'Product details not found.');
    }

    const newStock = Number(productDetail.stock) - Number(order.quantity);

    await productDetailModel.findOneAndUpdate(
      { product: order.product },
      { stock: newStock },
      { session, new: true },
    );

    await orderModel.updateOne(
      { paymentId: payload.tran_id },
      { isPaid: true },
      { session },
    );

    await cartModel.findOneAndDelete({
      product: order.product,
      user: order.user,
    });

    const paymentInfo = {
      user: order.user,
      transactionId: payload.tran_id,
    };

    const storePaymentInfo = await PaymentModel.create([paymentInfo], {
      session,
    });

    if (!storePaymentInfo) {
      throw new AppError(403, 'Failed to store payment information.');
    }

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    console.error('Transaction aborted due to error:', error);
    throw error;
  } finally {
    await session.endSession();
  }
};

const payNowService = async (userId: string, orderId: string) => {
  // find and check the order payment status

  const orderItem = await orderModel.findById(orderId);

  if (orderItem?.isPaid) {
    throw new AppError(208, 'You already paid for this product.');
  }

  // check is the user exists
  const user = await userModel.findById(userId);

  if (!user) {
    throw new AppError(403, `This user is not found.`);
  }

  //   check is the product is available

  const isProductExists = await productModel.findById(orderItem?.product);

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
    product: orderItem?.product,
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
  if (Number(stockProduct) < Number(orderItem?.quantity)) {
    throw new AppError(
      403,
      `Not enough stock. We have only ${stockProduct} products yet.`,
    );
  }

  const paymentId = orderItem?.paymentId;

  const paymentData = {
    total: orderItem?.total as number,
    productId: orderItem?.product as Types.ObjectId,
    productName: isProductExists.name,
    country: 'ffffffffff',
    phone: 'fffffffffffff',
    city: 'fffffffffff',
    userEmail: user.email,
    userAddress: '',
    transactionId: paymentId as string,
  };

  const paymentUrl = await sslInitPaymentService(paymentData);

  if (!paymentUrl) {
    throw new AppError(403, 'Something went wrong while payment.');
  }

  return {
    paymentUrl,
  };
};

export const paymentService = {
  successPaymentService,
  payNowService,
};
