import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { customerService } from './customer.service';

const getAllCustomerController = catchAsync(async (req, res) => {
  const result = await customerService.getAllCustomers();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Customer fetched successfully.',
    data: result,
  });
});

const getSingleCustomerController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await customerService.getSingleCustomers(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Customer fetched successfully.',
    data: result,
  });
});

const getBlockCustomerController = catchAsync(async (req, res) => {
  const result = await customerService.getBlockedCustomers();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Blocked customer fetched successfully.',
    data: result,
  });
});

const getDeletedCustomerController = catchAsync(async (req, res) => {
  const result = await customerService.getDeletedCustomers();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Deleted customer fetched successfully.',
    data: result,
  });
});

const blockCustomerController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await customerService.blockCustomer(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Customer blocked successfully.',
    data: result,
  });
});

const deleteCustomerController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await customerService.deleteCustomer(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Customer deleted successfully.',
    data: result,
  });
});

const updateCustomerController = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result = await customerService.updateUserInfo(userId, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Customer updated successfully.',
    data: result,
  });
});

export const customerController = {
  updateCustomerController,
  getAllCustomerController,
  getSingleCustomerController,
  getDeletedCustomerController,
  getBlockCustomerController,
  blockCustomerController,
  deleteCustomerController,
};
