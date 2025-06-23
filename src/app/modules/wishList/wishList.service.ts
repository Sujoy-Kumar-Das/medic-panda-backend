import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import { productModel } from '../product/porduct.model';
import { USER_ROLE } from '../user/user.constant';
import { IWishList } from './wishList.interface';
import { wishListModel } from './wishList.model';

const createWishListService = async (payload: IWishList) => {
  const { user: userId, product: productId } = payload;

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

const getAllWishListProductService = async (id: string, role: string) => {
  let result = null;

  if (role === USER_ROLE.user) {
    result = await wishListModel.find({ user: id }).populate('product');
  }

  if (role === USER_ROLE.admin || role === USER_ROLE.superAdmin) {
    result = await wishListModel.find();
  }

  return result;
};

const getSingleWishListProductService = async (
  userId: string,
  productId: string,
  role: string,
) => {
  let result = null;

  if (role === USER_ROLE.user) {
    result = await wishListModel.findOne({ user: userId, product: productId });
  }

  if (role === USER_ROLE.admin || role === USER_ROLE.superAdmin) {
    result = await wishListModel.findOne({ product: productId });
  }

  return result;
};

const removeFromWishListService = async (userId: string, productId: string) => {
  const product = await wishListModel.findOne({
    user: userId,
    product: productId,
  });

  if (!product) {
    throw new AppError(404, 'This product is already deleted.');
  }

  const covetedUserId = new mongoose.Types.ObjectId(userId);

  if (!product.user.equals(covetedUserId)) {
    throw new AppError(403, 'You not authorized for this operation!.');
  }

  return await wishListModel.findByIdAndDelete(product._id);
};

export const wishListService = {
  createWishListService,
  getAllWishListProductService,
  getSingleWishListProductService,
  removeFromWishListService,
};
