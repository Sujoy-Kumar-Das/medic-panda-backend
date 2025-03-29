import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { metaService } from './meta.service';

const userMetaController = catchAsync(async (req, res) => {
  const { userId } = req.user;

  const result = await metaService.userMetaService(userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User meta data fetched successfully',
    data: result,
  });
});

const adminMetaDataController = catchAsync(async (req, res) => {
  const result = await metaService.adminMetaDataService();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Admin meta data fetched successfully',
    data: result,
  });
});

export const metaController = { userMetaController, adminMetaDataController };
