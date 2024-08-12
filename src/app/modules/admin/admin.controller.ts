import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { adminService } from './admin.service';

const createAdminController = catchAsync(async (req, res) => {
  const result = await adminService.createAdminService(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Admin created successfully.',
    data: result,
  });
});

export const adminController = {
  createAdminController,
};
