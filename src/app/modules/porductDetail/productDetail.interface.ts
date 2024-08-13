import { Types } from 'mongoose';

export interface IProductDetail {
  productId: Types.ObjectId;
  categoryId: Types.ObjectId;
  photos: string[];
  description: string;
  metaKey: string;
  stock: number;
  status: 'active' | 'inactive';
}
