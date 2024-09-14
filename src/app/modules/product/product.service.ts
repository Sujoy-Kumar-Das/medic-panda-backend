import mongoose from 'mongoose';
import QueryBuilder from '../../builder/queryBuilder';
import AppError from '../../errors/AppError';
import calculateDiscount from '../../utils/calcutlateDiscount';
import { categoryModel } from '../category/category.model';
import { manufacturerModel } from '../manufacturer/manufacturer.model';
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

  const { name, price, discount } = product;

  // check is the the product already exists
  const isProductExists = await productModel.isProductExistsByName(name);

  if (isProductExists && !isProductExists.isDeleted) {
    throw new AppError(
      403,
      `${name} product already exists you can increase the stock.`,
    );
  }

  // check is the the category is exists
  const categoryId = productDetail.category;

  const isCategoryExists = await categoryModel.findById(categoryId);

  if (!isCategoryExists) {
    throw new AppError(403, `This category is not found.`);
  }

  // check is the the category is deleted
  const isCategoryDeleted = isCategoryExists.isDeleted;

  if (isCategoryDeleted) {
    throw new AppError(403, `This category is not found.`);
  }

  // check is the manufacture is available

  const isManufactureAvailable = await manufacturerModel.findById(
    productDetail.manufacture,
  );

  if (!isManufactureAvailable) {
    throw new AppError(404, 'Manufacture is not found.');
  }

  if (isManufactureAvailable.isDeleted) {
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

const getAllProductService = async (query: Record<string, unknown>) => {
  const productQuery = new QueryBuilder(productModel.find(), query);
  const products = productQuery.search(['name']).filter().paginate();
  const meta = await productQuery.countTotal();
  const result = await products.modelQuery;
  return { result, meta };
};

const getSingleProductService = async (id: string) => {
  const isProductExists = await productModel.findById(id);

  if (!isProductExists) {
    throw new AppError(404, 'This product is not found.');
  }

  const isDeleted = isProductExists.isDeleted;

  if (isDeleted) {
    throw new AppError(404, 'This product has been deleted.');
  }

  const result = await productDetailModel
    .findOne({ product: id })
    .populate('product')
    .populate('category')
    .populate('manufacture')
    .populate('variant');

  return result;
};

const updateProductService = async (
  id: string,
  payload: Partial<IProductPayload>,
) => {
  const result = await productModel.findByIdAndUpdate(id, payload);
  return result;
};

const deleteProductService = async (id: string) => {
  const isProductExists = await productModel.findById(id);

  if (!isProductExists) {
    throw new AppError(404, 'This product is not found.');
  }

  const isDeleted = isProductExists.isDeleted;

  if (isDeleted) {
    throw new AppError(404, 'This product already deleted.');
  }

  const result = await productModel.findByIdAndUpdate(id, {
    isDeleted: true,
  });
  return result;
};

export const productService = {
  createProductService,
  getAllProductService,
  getSingleProductService,
  updateProductService,
  deleteProductService,
};
