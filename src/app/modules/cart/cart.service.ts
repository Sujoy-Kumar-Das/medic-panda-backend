import AppError from '../../errors/AppError';
import { productModel } from '../product/porduct.model';
import { USER_ROLE } from '../user/user.constant';
import { userModel } from '../user/user.model';
import { ICart } from './cart.interface';
import { cartModel } from './cart.model';

const createCartService = async (payload: ICart) => {
  const { user: userId, product: productId, quantity } = payload;

  const user = await userModel.findById(userId);

  if (!user || user.isDeleted || user.isBlocked) {
    throw new AppError(403, 'User not found or access denied.');
  }

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
          totalPrice: product.price * quantity,
        },
      },
      { new: true },
    );

    return updatedCart;
  } else {
    const totalPrice = product.price * quantity;

    const newCartItem = await cartModel.create({
      user: userId,
      product: productId,
      quantity,
      totalPrice,
    });

    return newCartItem;
  }
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
