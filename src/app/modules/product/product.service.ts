import mongoose from 'mongoose';
import QueryBuilder from '../../builder/queryBuilder';
import AppError from '../../errors/AppError';
import calculateDiscount from '../../utils/calcutlateDiscount';

import { categoryModel } from '../category/category.model';
import { manufacturerModel } from '../manufacturer/manufacturer.model';
import { IProductDetail } from '../porductDetail/productDetail.interface';
import { productDetailModel } from '../porductDetail/productDetail.model';
import getProductsWithWishlistStatus from './getProductsWithWishlistStatus';
import { productModel } from './porduct.model';
import { IProduct } from './product.interface';

interface IProductPayload {
  product: IProduct;
  productDetail: IProductDetail;
}

const createProductService = async (payload: IProductPayload) => {
  const { product, productDetail } = payload;

  const { name, price, discount, category, manufacturer } = product;

  // check is the the product already exists
  const isProductExists = await productModel.isProductExistsByName(name);

  if (isProductExists && !isProductExists.isDeleted) {
    throw new AppError(
      403,
      `${name} product already exists you can increase the stock.`,
    );
  }

  const isCategoryExists = await categoryModel.findById(category);

  if (!isCategoryExists) {
    throw new AppError(403, `This category is not found.`);
  }

  // check is the manufacture is available
  const isManufactureAvailable = await manufacturerModel.findById(manufacturer);

  if (!isManufactureAvailable) {
    throw new AppError(404, 'Manufacture is not found.');
  }

  // create a session
  const session = await mongoose.startSession();

  try {
    // start transaction
    session.startTransaction();

    if (discount) {
      discount.discountPrice = calculateDiscount(price, discount.percentage);
      discount.discountStatus = true;
    }

    // create the product
    const createProduct = await productModel.create([product], { session });

    if (!createProduct?.length) {
      throw new AppError(400, 'Flailed to create product.');
    }

    productDetail.product = createProduct[0]._id;

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

const getAllProductService = async (
  userId: string,
  query: Record<string, unknown>,
) => {
  // Check if 'category' is in the query
  if (query.category) {
    const categoryFilter = query.category as string;

    // Check if it's an ObjectId (24-character hex string)
    if (categoryFilter.match(/^[0-9a-fA-F]{24}$/)) {
      query.category = categoryFilter;
    } else {
      // If it's a name, look up the category by name and get its ID
      const categoryDoc = await categoryModel.findOne({
        name: { $regex: categoryFilter, $options: 'i' },
      });
      query.category = categoryDoc ? categoryDoc._id : null;
    }
  }

  const baseQuery = productModel
    .find({ isDeleted: false })
    .populate('category')
    .populate('manufacturer')
    .lean();

  const productQuery = new QueryBuilder(baseQuery, query);
  const products = productQuery.search(['name']).filter().paginate();

  const meta = await productQuery.countTotal({ isDeleted: false });

  const productResult = await products.modelQuery;

  const result = await getProductsWithWishlistStatus(productResult, userId);

  return { result, meta };
};

const getSingleProductService = async (id: string) => {
  const result = await productDetailModel.findOne({ product: id }).populate({
    path: 'product',
    populate: [{ path: 'category' }, { path: 'manufacturer' }],
  });

  return result;
};

const updateProductService = async (
  id: string,
  payload: Partial<IProductPayload>,
) => {
  const { product, productDetail } = payload;

  const { price, discount, category, manufacturer } = product as IProduct;

  const isProductExists = await productModel.isProductExistsById(id);

  if (!isProductExists) {
    throw new AppError(404, 'This product is not found');
  }

  if (isProductExists.isDeleted) {
    throw new AppError(404, `${isProductExists.name} is deleted.`);
  }

  const isCategoryExists = await categoryModel.findById(category);

  if (!isCategoryExists) {
    throw new AppError(403, `This category is not found.`);
  }

  const isManufactureAvailable = await manufacturerModel.findById(manufacturer);

  if (!isManufactureAvailable) {
    throw new AppError(404, 'Manufacture is not found.');
  }

  // create a session
  const session = await mongoose.startSession();

  try {
    // start transaction
    session.startTransaction();

    if (!discount) {
      payload.product!.discount = undefined;
    }

    if (discount) {
      discount.discountPrice = calculateDiscount(price, discount.percentage);
      discount.discountStatus = true;
    }

    // update the product
    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      { ...product },
      { session, new: true },
    );

    if (!updatedProduct) {
      throw new AppError(400, 'Failed to update product.');
    }

    if (productDetail) {
      const updatedProductDetails = await productDetailModel.findOneAndUpdate(
        { product: id },
        { ...productDetail },
        { session, new: true },
      );

      if (!updatedProductDetails) {
        throw new AppError(400, 'Failed to update product details.');
      }
    }

    await session.commitTransaction();
    session.endSession();

    console.log({ updatedProduct });
    return updatedProduct;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log(error);
    throw new AppError(
      400,
      'Something went wrong while updating the product. Please try again.',
    );
  }
};

const deleteProductService = async (id: string) => {
  setTimeout(async () => {
    const product = await productModel.findById(id);

    if (!product) {
      throw new AppError(404, 'This product is not found.');
    }

    const isDeleted = product.isDeleted;

    if (isDeleted) {
      throw new AppError(409, 'This product already deleted.');
    }

    const result = await productModel
      .findByIdAndUpdate(
        id,
        {
          isDeleted: true,
        },
        { new: true },
      )
      .select('+isDeleted');

    if (!result?.isDeleted) {
      throw new AppError(400, `Failed to delete ${product.name} `);
    }
    return null;
  }, 5000);
};

export const productService = {
  createProductService,
  getAllProductService,
  getSingleProductService,
  updateProductService,
  deleteProductService,
};
