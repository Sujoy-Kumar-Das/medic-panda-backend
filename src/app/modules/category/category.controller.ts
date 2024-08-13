import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { categoryService } from './category.service';

const createCategoryController = catchAsync(async (req, res) => {
  const result = await categoryService.createCategoryService(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Category created successfully',
    data: result,
  });
});

const getAllCategoryController = catchAsync(async (req, res) => {
  const result = await categoryService.getAllCategoryService();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Category fetched successfully',
    data: result,
  });
});

const getSingleCategoryController = catchAsync(async (req, res) => {
  const result = await categoryService.getSingleCategoryService(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Category fetched successfully',
    data: result,
  });
});

const updateCategoryController = catchAsync(async (req, res) => {
  const result = await categoryService.updateCategoryService();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Category updated successfully',
    data: result,
  });
});

const deleteCategoryController = catchAsync(async (req, res) => {
  const result = await categoryService.deleteCategoryService(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Category deleted successfully',
    data: result,
  });
});

export const categoryController = {
  createCategoryController,
  getAllCategoryController,
  getSingleCategoryController,
  updateCategoryController,
  deleteCategoryController,
};
