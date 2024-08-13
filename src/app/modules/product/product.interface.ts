import { Model } from 'mongoose';

export interface IProduct {
  name: string;
  slug: string;
  thumbnail: string;
  price: number;
  discountPrice?: number;
  discountPercentage: number;
  stockStatus: boolean;
  isDeleted?: boolean;
}

export interface IProductModel extends Model<IProduct> {
  isProductExistsByName(name: string): Promise<IProduct | null>;
  isProductExistsById(id: string): Promise<IProduct | null>;
}
