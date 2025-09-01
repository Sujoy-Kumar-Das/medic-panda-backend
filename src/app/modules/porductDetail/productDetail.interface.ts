import { Types } from 'mongoose';

export interface IProductDetail {
  product: Types.ObjectId;
  images?: string[];
  shortDescription: string;
  detailedDescription: string;
  stock: number;
}
