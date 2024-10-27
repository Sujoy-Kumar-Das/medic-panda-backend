import { Types } from 'mongoose';

export interface IProductDetail {
  product: Types.ObjectId;
  variant: Types.ObjectId;
  images?: string[];
  description: string;
  stock: number;
  status?: 'active' | 'inactive';
}
