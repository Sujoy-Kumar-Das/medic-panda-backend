import QueryBuilder from '../../builder/queryBuilder';
import AppError from '../../errors/AppError';
import { ICategory } from './category.interface';
import { categoryModel } from './category.model';

const createCategoryService = async (payload: ICategory) => {
  // check is the category exists
  const isCategoryExists = await categoryModel.isCategoryExistsByName(
    payload.name,
  );

  if (isCategoryExists) {
    throw new AppError(401, 'This category is already exists.');
  }

  const result = await categoryModel.create(payload);

  return result;
};

const getAllCategoryService = async (query: Record<string, unknown>) => {
  const categoryQuery = new QueryBuilder(categoryModel.find(), query);
  const category = categoryQuery.search(['name']).filter().limit();

  const meta = await categoryQuery.countTotal(undefined);
  const result = await category.modelQuery;

  return { meta, result };
};

const getSingleCategoryService = async (id: string) => {
  const result = categoryModel.findById(id);
  return result;
};

const updateCategoryService = async (
  id: string,
  payload: Partial<ICategory>,
) => {
  const { name } = payload;
  // check is the category already exists by id
  const isCategoryExistsById = await categoryModel.isCategoryExistsById(id);

  if (!isCategoryExistsById) {
    throw new AppError(401, 'This category is not found.');
  }

  // check is the category is already exists by name
  const isCategoryExistsByName = await categoryModel.isCategoryExistsByName(
    name as string,
  );

  if (isCategoryExistsByName) {
    throw new AppError(401, 'This category is already exists.');
  }

  const result = await categoryModel.findByIdAndUpdate(id, payload);
  return result;
};

const deleteCategoryService = async (id: string) => {
  const isCategoryExists = await categoryModel.findById(id);

  if (!isCategoryExists) {
    throw new AppError(404, 'This category is not found.');
  }

  await categoryModel.findByIdAndDelete(id);
  return null;
};

export const categoryService = {
  createCategoryService,
  getAllCategoryService,
  getSingleCategoryService,
  updateCategoryService,
  deleteCategoryService,
};
