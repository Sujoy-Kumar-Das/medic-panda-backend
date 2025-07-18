/* eslint-disable @typescript-eslint/no-explicit-any */
import QueryBuilder from '../../builder/queryBuilder';
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

  if (isManufactureExistsByName) {
    throw new AppError(400, 'This item already exists.');
  }

  const result = await manufacturerModel.create(payload);
  return result;
};

const getAllManufacturer = async (query: Record<string, any>) => {
  const manufacturerQueryBuilder = new QueryBuilder(
    manufacturerModel.find(),
    query,
  ).search(['name']);

  const result = await manufacturerQueryBuilder.modelQuery;
  const meta = await manufacturerQueryBuilder.countTotal(undefined);
  return { result, meta };
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

  const result = await manufacturerModel.findByIdAndDelete(id);

  return result;
};

export const manufacturerService = {
  createManufacturer,
  getAllManufacturer,
  getSingleManufacturer,
  updateManufacturer,
  deleteManufacturer,
};
