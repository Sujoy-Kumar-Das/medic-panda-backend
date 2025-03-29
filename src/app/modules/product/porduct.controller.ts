import { emitSocketEvents } from '../../socket/emitSocket';
import { socketEvent } from '../../socket/socket.event';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { productService } from './product.service';

const createProductController = catchAsync(async (req, res) => {
  const result = await productService.createProductService(req.body);

  emitSocketEvents([{ event: socketEvent.product, data: result }]);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    data: result,
    message: 'Product created successfully.',
  });
});

const getAllProductController = catchAsync(async (req, res) => {
  const result = await productService.getAllProductService(req.query);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    data: result,
    message: 'Product fetched successfully.',
  });
});

const getSingleProductController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await productService.getSingleProductService(id);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    data: result,
    message: 'Product fetched successfully.',
  });
});

const updateProductController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await productService.updateProductService(id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    data: result,
    message: 'Product updated successfully.',
  });
});

const deleteProductController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await productService.deleteProductService(id);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    data: result,
    message: 'Product deleted successfully.',
  });
});

export const ProductController = {
  createProductController,
  getAllProductController,
  getSingleProductController,
  updateProductController,
  deleteProductController,
};
