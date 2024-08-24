import AppError from '../../errors/AppError';
import { IManufacturer } from './manufacturer.interface';
import { manufacturerModel } from './manufacturer.model';

const createManufacturer = async (payload: IManufacturer) => {
  const isManufactureExistsByName = await manufacturerModel.findOne({
    name: {
      $regex: payload.name,
      $options: 'i',
    },
  });

  const isDeleted = (isManufactureExistsByName as IManufacturer | null)
    ?.isDeleted;

  if (isManufactureExistsByName && !isDeleted) {
    throw new AppError(400, 'This item already exists.');
  }

  const result = await manufacturerModel.create(payload);
  return result;
};

const getAllManufacturer = async () => {
  const result = await manufacturerModel.find();
  return result;
};

const getSingleManufacturer = async (id: string) => {
  const result = await manufacturerModel.findById(id);
  return result;
};

const updateManufacturer = async (
  id: string,
  payload: Partial<IManufacturer>,
) => {
  const result = await manufacturerModel.findByIdAndUpdate(id, payload);
  return result;
};

const deleteManufacturer = async (id: string) => {
  const isManufactureExistsByName = await manufacturerModel.findById(id);

  if (!isManufactureExistsByName) {
    throw new AppError(400, 'This item is not exists.');
  }

  const isDeleted = isManufactureExistsByName.isDeleted;

  if (isDeleted) {
    throw new AppError(400, 'This item is deleted..');
  }

  const result = await manufacturerModel.findByIdAndUpdate(id, {
    isDeleted: true,
  });

  return result;
};

export const manufacturerService = {
  createManufacturer,
  getAllManufacturer,
  getSingleManufacturer,
  updateManufacturer,
  deleteManufacturer,
};
