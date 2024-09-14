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

export const metaController = { userMetaController };
