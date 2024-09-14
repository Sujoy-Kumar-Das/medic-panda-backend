import AppError from '../../errors/AppError';
import { productModel } from '../product/porduct.model';
import { USER_ROLE } from '../user/user.constant';
import { userModel } from '../user/user.model';
import { ICart } from './cart.interface';
import { cartModel } from './cart.model';

const createCartService = async (payload: ICart) => {
  const { user: userId, product: productId } = payload;

  // check is the user exists
  const user = await userModel.findById(userId);

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

  const product = await productModel.findById(productId);

  if (!product) {
    throw new AppError(403, `This product is not found.`);
  }

  //   is product deleted
  const isProductDeleted = product.isDeleted;

  if (isProductDeleted) {
    throw new AppError(403, `This product is deleted.`);
  }

  const result = await cartModel.create(payload);
  return result;
};

const getAllCartProductService = async (id: string) => {
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

  let result = null;

  if (user?.role === USER_ROLE.user) {
    result = await cartModel.find({ user: id });
  }

  if (user?.role === USER_ROLE.admin || user?.role === USER_ROLE.superAdmin) {
    result = await cartModel.find();
  }

  return result;
};

const getSingleCartProductService = async (
  userId: string,
  productId: string,
) => {
  // check is the user exists
  const user = await userModel.findById(userId);

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

  let result = null;

  if (user?.role === USER_ROLE.user) {
    result = await cartModel.findOne({ user: userId, product: productId });
  }

  if (user?.role === USER_ROLE.admin || user?.role === USER_ROLE.superAdmin) {
    result = await cartModel.findOne({ product: productId });
  }

  return result;
};

const removeFromCartService = async (userId: string, productId: string) => {
  // check is the user exists
  const user = await userModel.findById(userId);

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

  let result = null;

  if (user?.role === USER_ROLE.user) {
    result = await cartModel.findOneAndUpdate(
      { user: userId, product: productId },
      { isDeleted: true },
    );
  }

  if (user?.role === USER_ROLE.admin || user?.role === USER_ROLE.superAdmin) {
    result = await cartModel.find({ product: productId }, { isDeleted: true });
  }

  return result;
};
export const cartService = {
  createCartService,
  getAllCartProductService,
  getSingleCartProductService,
  removeFromCartService,
};
