import AppError from '../../errors/AppError';
import { productModel } from '../product/porduct.model';
import { USER_ROLE } from '../user/user.constant';
import { wishListModel } from '../wishList/wishList.model';
import { ICart } from './cart.interface';
import { cartModel } from './cart.model';

interface ICartPayload {
  user: string;
  id: string;
  quantity: number;
}

const createCartService = async (payload: ICart) => {
  const { user: userId, product: productId, quantity = 1 } = payload;

  const product = await productModel.findById(productId);
  if (!product || product.isDeleted) {
    throw new AppError(403, 'Product not found or deleted.');
  }

  const existingCartItem = await cartModel.findOne({
    user: userId,
    product: productId,
  });

  if (existingCartItem) {
    const updatedCart = await cartModel.findByIdAndUpdate(
      existingCartItem._id,
      {
        $inc: {
          quantity: quantity,
          totalPrice: (product.price * quantity).toFixed(2),
        },
      },
      { new: true },
    );

    return updatedCart;
  } else {
    const totalPrice = (product.price * quantity).toFixed(2);

    const newCartItem = await cartModel.create({
      user: userId,
      product: productId,
      quantity,
      totalPrice,
    });

    const isExistWishList = await wishListModel.findOne({
      product,
      user: userId,
    });

    if (isExistWishList) {
      await wishListModel.findOneAndDelete({ product, user: userId });
    }

    const result = await newCartItem?.populate('product');

    return result;
  }
};

const getAllCartProductService = async (id: string) => {
  const result = await cartModel
    .find({ user: id })
    .populate({ path: 'product' });

  return result;
};

const getCartLengthService = async (id: string) => {
  const result = await cartModel.countDocuments({ user: id });

  return result;
};

const getSingleCartProductService = async (payload: {
  id: string;
  userId: string;
  role: string;
}) => {
  const { id, userId, role } = payload;

  let result = null;

  if (role === USER_ROLE.user) {
    result = await cartModel
      .findOne({ user: userId, _id: id })
      .populate('product');
  }

  if (role === USER_ROLE.admin || role === USER_ROLE.superAdmin) {
    result = await cartModel.findById(id);
  }

  return result;
};

const incrementCartItemService = async (
  id: string,
  payload: { quantity: number },
) => {
  const { quantity = 1 } = payload;

  // Find the existing cart item
  const existingCartItem = await cartModel.findById(id);

  // Calculate the price per item
  const price =
    Number(existingCartItem?.totalPrice) / Number(existingCartItem?.quantity);

  if (!existingCartItem) {
    throw new AppError(404, 'Cart item not found.');
  }

  if (quantity) {
    // Calculate the new quantity by adding the current quantity
    const newQuantity = Number(existingCartItem?.quantity) + quantity;

    // Update the cart item with the new quantity and updated total price
    const updatedCart = await cartModel.findByIdAndUpdate(
      existingCartItem._id,
      {
        $set: {
          quantity: newQuantity,
          totalPrice: (price * newQuantity).toFixed(2),
        },
      },
      { new: true },
    );

    return updatedCart;
  } else {
    throw new AppError(400, 'Quantity is required for cart update.');
  }
};

const decrementCartService = async (id: string, userId: string) => {
  const existingCartItem = await cartModel.findOne({ _id: id, user: userId });

  if (!existingCartItem) {
    throw new AppError(404, 'Cart item not found.');
  }

  const price =
    Number(existingCartItem?.totalPrice) / Number(existingCartItem?.quantity);

  const quantity = existingCartItem.quantity;

  if (quantity) {
    const newQuantity = Number(existingCartItem?.quantity) - 1;

    if (newQuantity <= 0) {
      return await cartModel.findByIdAndDelete(existingCartItem._id);
    } else {
      const updatedCart = await cartModel.findByIdAndUpdate(
        existingCartItem._id,
        {
          quantity: newQuantity,
          totalPrice: (price * newQuantity).toFixed(2),
        },
        { new: true },
      );

      return updatedCart;
    }
  } else {
    throw new AppError(400, 'Quantity is required for cart update.');
  }
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
  getSingleCartProductService,
  decrementCartService,
  incrementCartItemService,
  getCartLengthService,
  deleteCartService,
};
