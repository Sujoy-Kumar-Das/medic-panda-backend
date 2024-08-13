import { IVariant } from './variants.interface';
import { variantModel } from './variants.model';

const createVariantService = async (payload: IVariant) => {
  const result = await variantModel.create(payload);
  return result;
};

const getAllVariantService = async () => {
  const result = await variantModel.find();
  return result;
};

const getSingleVariantService = async (id: string) => {
  const result = await variantModel.findById(id);
  return result;
};

const updateVariantService = async (id: string, payload: Partial<IVariant>) => {
  const result = await variantModel.findByIdAndUpdate(id, payload);
  return result;
};

const deleteVariantService = async (id: string) => {
  const result = await variantModel.findByIdAndUpdate(id, { isDeleted: true });
  return result;
};

export const variantService = {
  createVariantService,
  getAllVariantService,
  getSingleVariantService,
  updateVariantService,
  deleteVariantService,
};
