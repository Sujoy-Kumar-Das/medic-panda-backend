import AppError from '../../errors/AppError';
import { productModel } from '../product/porduct.model';
import { USER_ROLE } from '../user/user.constant';
import { userModel } from '../user/user.model';
import { IWishList } from './wishList.interface';
import { wishListModel } from './wishList.model';

const createWishListService = async (payload: IWishList) => {
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

  const isAlreadyExistInWishList = await wishListModel.findOne({
    user: userId,
    product,
  });

  if (isAlreadyExistInWishList) {
    throw new AppError(403, 'This Product you already added in wishlist.');
  }

  const result = await wishListModel.create(payload);
  return result;
};

const getAllWishListProductService = async (id: string) => {
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
    result = await wishListModel.find({ user: id });
  }

  if (user?.role === USER_ROLE.admin || user?.role === USER_ROLE.superAdmin) {
    result = await wishListModel.find();
  }

  return result;
};

const getSingleWishListProductService = async (
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
    result = await wishListModel.findOne({ user: userId, product: productId });
  }

  if (user?.role === USER_ROLE.admin || user?.role === USER_ROLE.superAdmin) {
    result = await wishListModel.findOne({ product: productId });
  }

  return result;
};

const removeFromWishListService = async (userId: string, productId: string) => {
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
    result = await wishListModel.findOneAndUpdate(
      { user: userId, product: productId },
      { isDeleted: true },
    );
  }

  if (user?.role === USER_ROLE.admin || user?.role === USER_ROLE.superAdmin) {
    result = await wishListModel.find(
      { product: productId },
      { isDeleted: true },
    );
  }

  return result;
};
export const wishListService = {
  createWishListService,
  getAllWishListProductService,
  getSingleWishListProductService,
  removeFromWishListService,
};
