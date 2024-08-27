import { Types } from 'mongoose';

export interface IProductDetail {
  product: Types.ObjectId;
  category: Types.ObjectId;
  manufacture: Types.ObjectId;
  images?: string[];
  description: string;
  stock: number;
  status?: 'active' | 'inactive';
}
