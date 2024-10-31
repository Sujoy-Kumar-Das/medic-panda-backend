import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { adminService } from './admin.service';

const getAllAdminController = catchAsync(async (req, res) => {
  const result = await adminService.getAllAdmins();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Admin fetched successfully.',
    data: result,
  });
});

const getSingleAdminController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await adminService.getSingleAdmin(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Admin fetched successfully.',
    data: result,
  });
});

const getBlockedAdminController = catchAsync(async (req, res) => {
  const result = await adminService.getBlockedAdmins();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Blocked admin fetched successfully.',
    data: result,
  });
});

const getDeletedAdminController = catchAsync(async (req, res) => {
  const result = await adminService.getDeletedAdmins();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Deleted admin fetched successfully.',
    data: result,
  });
});

const blockAdminController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await adminService.blockAdmin(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Admin blocked successfully.',
    data: result,
  });
});

const deleteAdminController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await adminService.deleteAdmin(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Admin deleted successfully.',
    data: result,
  });
});

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
  getAllAdminController,
  getSingleAdminController,
  getBlockedAdminController,
  getDeletedAdminController,
  blockAdminController,
  deleteAdminController,
  updateAdminInfo,
};
