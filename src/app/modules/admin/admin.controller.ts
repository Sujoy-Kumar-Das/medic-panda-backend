import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { adminService } from './admin.service';

const getAllAdminController = catchAsync(async (req, res) => {
  const result = await adminService.getAllAdminService();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'All admin fetched successfully.',
    data: result,
  });
});

export const adminController = {
  getAllAdminController,
};
