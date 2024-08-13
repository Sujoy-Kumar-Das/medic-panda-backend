import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import { categoryModel } from '../category/category.model';
import { IProductDetail } from '../porductDetail/productDetail.interface';
import { productDetailModel } from '../porductDetail/productDetail.model';
import { productModel } from './porduct.model';
import { IProduct } from './product.interface';

interface IProductPayload {
  product: IProduct;
  productDetail: IProductDetail;
}

const createProductService = async (payload: IProductPayload) => {
  const { product, productDetail } = payload;

  const { name, price, discountPercentage } = product;

  // check is the the product already exists
  const isProductExists = await productModel.isProductExistsByName(name);

  if (isProductExists) {
    throw new AppError(
      403,
      `${name} product already exists you can increase the stock.`,
    );
  }

  // check is the the category is exists
  const categoryId = productDetail.categoryId;

  const isCategoryExists = await categoryModel.findById(categoryId);

  if (!isCategoryExists) {
    throw new AppError(403, `This category is not found.`);
  }

  // check is the the category is deleted
  const isDeleted = isCategoryExists.isDeleted;

  if (isDeleted) {
    throw new AppError(403, `This category is not found.`);
  }

  // create a session
  const session = await mongoose.startSession();

  try {
    // start transaction
    session.startTransaction();

    if (discountPercentage) {
      const discountPrice = (
        price -
        price * (discountPercentage / 100)
      ).toFixed(2);

      product.discountPrice = Number(discountPrice);
    }

    // create the product
    const createProduct = await productModel.create([product], { session });

    if (!createProduct.length) {
      throw new AppError(400, 'Flailed to create product.');
    }

    productDetail.productId = createProduct[0]._id;

    const createCustomer = await productDetailModel.create([productDetail], {
      session,
    });

    if (!createCustomer.length) {
      throw new AppError(400, 'Failed to create product.');
    }

    await session.commitTransaction();
    await session.endSession();

    return createCustomer[0];
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    console.log(error);
    throw new AppError(
      400,
      'Something went wrong for create user. Please try again.',
    );
  }
};

export const productService = {
  createProductService,
};
