import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { adminService } from './admin.service';

const updateAdminInfo = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result = await adminService.updateAdminInfo(userId, req.body);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Admin information updated successfully.',
    data: result,
  });
});

export const adminController = {
  updateAdminInfo,
};
