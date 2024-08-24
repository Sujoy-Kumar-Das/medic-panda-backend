import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { manufacturerService } from './manufacturer.service';

const createManufacturerController = catchAsync(async (req, res) => {
  const result = await manufacturerService.createManufacturer(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Manufacturer created successfully',
    data: result,
  });
});

const getAllManufacturerController = catchAsync(async (req, res) => {
  const result = await manufacturerService.getAllManufacturer();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Manufacturer fetched successfully',
    data: result,
  });
});

const getSingleManufacturerController = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await manufacturerService.getSingleManufacturer(id);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Manufacturer fetched successfully',
    data: result,
  });
});

const updateManufacturerController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await manufacturerService.updateManufacturer(id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Manufacturer updated successfully',
    data: result,
  });
});

const deleteManufacturerController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await manufacturerService.deleteManufacturer(id);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Manufacturer deleted successfully',
    data: result,
  });
});

export const manufacturerController = {
  createManufacturerController,
  getAllManufacturerController,
  getSingleManufacturerController,
  updateManufacturerController,
  deleteManufacturerController,
};
