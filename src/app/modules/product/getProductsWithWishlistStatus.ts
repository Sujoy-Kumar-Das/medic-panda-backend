/* eslint-disable @typescript-eslint/no-explicit-any */
import { wishListModel } from '../wishList/wishList.model';
import { IProduct } from './product.interface';

const getProductsWithWishlistStatus = async (
  products: IProduct[],
  userId: string | undefined = undefined,
) => {
  if (!userId) {
    return products;
  }

  const wishlistItems = await wishListModel
    .find({ user: userId })
    .select('product');

  const wishlistProductIds = wishlistItems.map((item) =>
    item.product.toString(),
  );

  const result = products.map((product) => ({
    ...product,
    isWishList: wishlistProductIds.includes((product as any)._id.toString()),
  }));

  return result;
};

export default getProductsWithWishlistStatus;
