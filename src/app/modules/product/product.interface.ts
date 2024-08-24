import { Model } from 'mongoose';

export interface IProduct {
  name: string;
  price: number;
  discountPercentage?: number;
  discountPrice?: number;
  stockStatus?: boolean;
  thumbnail: string;
  isDeleted?: boolean;
  ratting?: number;
}

export interface IProductModel extends Model<IProduct> {
  isProductExistsByName(name: string): Promise<IProduct | null>;
  isProductExistsById(id: string): Promise<IProduct | null>;
}
