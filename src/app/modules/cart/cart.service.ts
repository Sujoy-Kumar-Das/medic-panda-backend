import AppError from '../../errors/AppError';
import { productModel } from '../product/porduct.model';
import { ICart } from './cart.interface';
import { cartModel } from './cart.model';

const createCartService = async (payload: ICart) => {
  const { user: userId, product: productId } = payload;

  const product = await productModel.findById(productId);

  if (!product || product.isDeleted) {
    throw new AppError(403, 'Product not found or deleted.');
  }

  const cart = await cartModel.findOne({
    user: userId,
    product: productId,
  });

  if (cart) {
    throw new AppError(401, 'This product already in your cart.');
  }

  const result = await cartModel.create(payload);

  if (!result._id) {
    throw new AppError(401, 'Failed to add product in your cart.');
  }

  return result;
};

const getAllCartProductService = async (userId: string) => {
  const result = await cartModel
    .find({ user: userId })
    .populate({ path: 'product', populate: { path: 'category' } });

  return result;
};

const getSingleCartService = async (id: string, userId: string) => {
  const result = await cartModel
    .findOne({ user: userId, _id: id })
    .populate({ path: 'product', select: '_id name price discount' })
    .select('product');

  return result;
};

const getCartLengthService = async (userId: string) => {
  const result = await cartModel.countDocuments({ user: userId });

  return result;
};

const deleteCartService = async (id: string, userId: string) => {
  const cart = await cartModel.findOne({ _id: id, user: userId });

  if (!cart) {
    throw new AppError(404, 'This item is not found.');
  }

  await cartModel.findOneAndDelete({ _id: id, user: userId });

  return null;
};

export const cartService = {
  createCartService,
  getAllCartProductService,
  getCartLengthService,
  deleteCartService,
  getSingleCartService,
};
