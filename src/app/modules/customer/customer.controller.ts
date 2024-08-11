import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { customerService } from './customer.service';

const createCustomerController = catchAsync(async (req, res) => {
  const result = await customerService.createCustomerService(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Customer created successfully.',
    data: result,
  });
});

export const customerServiceController = {
  createCustomerController,
};
