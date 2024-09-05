import AppError from '../../errors/AppError';
import { IUserRoles } from '../../interface/user.roles.interface';
import { sslInitPaymentService } from '../../ssl/ssl.service';
import generateTransactionId from '../../utils/generateTransactionId';
import { productDetailModel } from '../porductDetail/productDetail.model';
import { productModel } from '../product/porduct.model';
import { USER_ROLE } from '../user/user.constant';
import { userModel } from '../user/user.model';
import { IOrder } from './order.interface';
import { orderModel } from './order.model';

const createOrderService = async (id: string, payload: IOrder) => {
  const { product, quantity } = payload;

  // check is the user exists
  const user = await userModel.findById(id);

  if (!user) {
    throw new AppError(403, `This user is not found.`);
  }

  //   is user deleted
  const isDeleted = user.isDeleted;

  if (isDeleted) {
    throw new AppError(403, `This user is not found.`);
  }

  //   is user blocked
  const isBlocked = user.isBlocked;

  if (isBlocked) {
    throw new AppError(403, `This user has been blocked.`);
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

// get all order by user, admin and supper admin
const getAllOrderService = async (
  user: string,
  email: string,
  role: IUserRoles,
) => {
  if (role === USER_ROLE.user) {
    const isOrderExists = await orderModel.find({ user: user });

    if (!isOrderExists.length) {
      throw new AppError(404, 'You do not have any order.');
    }

    const user = await userModel.findById(isOrderExists[0].user);

    if (!user) {
      throw new AppError(404, 'This user not found.');
    }

    const isEmailMatched = user.email === email;

    if (!isEmailMatched) {
      throw new AppError(403, 'Unauthorized access.');
    }

    return isOrderExists;
  }

  if (role === USER_ROLE.admin || role === USER_ROLE.superAdmin) {
    return await orderModel.find({ user: userId });
  }
};

// cancel order by user, admin and supper admin
const cancelOrderService = async (
  id: string,
  email: string,
  role: IUserRoles,
) => {
  if (role === USER_ROLE.user) {
    const isOrderExists = await orderModel.findById(id);

    if (!isOrderExists) {
      throw new AppError(404, 'This order not found.');
    }

    const user = await userModel.findById(isOrderExists.user);

    if (!user) {
      throw new AppError(404, 'This user not found.');
    }
    const isEmailMatched = user.email === email;
    console.log({ isEmailMatched });

    if (!isEmailMatched) {
      throw new AppError(403, 'Unauthorized access.');
    }

    return await orderModel.findByIdAndUpdate(
      id,
      { isCanceled: true },
      { new: true },
    );
  }

  if (role === USER_ROLE.admin || role === USER_ROLE.superAdmin) {
    return await orderModel.findByIdAndUpdate(
      id,
      { isCanceled: true },
      { new: true },
    );
  }
};

// delete order by user, admin and supper admin
const deleteOrderService = async (
  id: string,
  email: string,
  role: IUserRoles,
) => {
  if (role === USER_ROLE.user) {
    const isOrderExists = await orderModel.findById(id);

    if (!isOrderExists) {
      throw new AppError(404, 'This order not found.');
    }

    const user = await userModel.findById(isOrderExists.user);

    if (!user) {
      throw new AppError(404, 'This user not found.');
    }
    const isEmailMatched = user.email === email;
    console.log({ isEmailMatched });

    if (!isEmailMatched) {
      throw new AppError(403, 'Unauthorized access.');
    }

    return await orderModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true },
    );
  }

  if (role === USER_ROLE.admin || role === USER_ROLE.superAdmin) {
    return await orderModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true },
    );
  }
};

export const orderService = {
  createOrderService,
  getAllOrderServiceByAdmin,
  cancelOrderService,
  getAllOrderService,
  deleteOrderService,
};
