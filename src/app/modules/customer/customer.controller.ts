import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { customerService } from './customer.service';

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
};
