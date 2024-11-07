import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { productService } from './product.service';

// const createProductController = catchAsync(async (req, res) => {
//   const { product, productDetail } = req.body;
//   const data = {
//     product,
//     productDetail,
//   };
//   const result = await productService.createProductService(data);

//   sendResponse(res, {
//     success: true,
//     statusCode: 200,
//     data: result,
//     message: 'Product created successfully.',
//   });
// });

const createProductController = catchAsync(async (req, res) => {
  const { product, productDetail } = req.body;
  const data = {
    product,
    productDetail,
  };
  const result = await productService.createProductService(data);

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
    data: result.result,
    meta: result.meta,
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

// const updateProductController = catchAsync(async (req, res) => {
//   const { id } = req.params;
//   const result = await ProductService.updateProductService(id, req.body);

//   sendResponse(res, {
//     success: true,
//     statusCode: 200,
//     data: result,
//     message: 'Product updated successfully.',
//   });
// });

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
  // updateProductController,
  deleteProductController,
};
