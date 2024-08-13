import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { variantService } from './variants.service';

const createVariantController = catchAsync(async (req, res) => {
  const result = await variantService.createVariantService(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    data: result,
    message: 'Variant created successfully.',
  });
});

const getAllVariantController = catchAsync(async (req, res) => {
  const result = await variantService.getAllVariantService();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    data: result,
    message: 'Variant fetched successfully.',
  });
});

const getSingleVariantController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await variantService.getSingleVariantService(id);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    data: result,
    message: 'Variant fetched successfully.',
  });
});

const updateVariantController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await variantService.updateVariantService(id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    data: result,
    message: 'Variant updated successfully.',
  });
});

const deleteVariantController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await variantService.deleteVariantService(id);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    data: result,
    message: 'Variant deleted successfully.',
  });
});

export const variantController = {
  createVariantController,
  getAllVariantController,
  getSingleVariantController,
  updateVariantController,
  deleteVariantController,
};
