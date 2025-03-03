import { Model, Types } from 'mongoose';

export interface IDiscount {
  discountStatus: boolean;
  percentage: number;
  discountPrice?: number;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
}

export interface IProduct {
  name: string;
  price: number;
  discount?: IDiscount | undefined;
  stockStatus?: boolean;
  thumbnail: string;
  category: Types.ObjectId;
  manufacturer: Types.ObjectId;
  rating: number;
  isWishList: boolean;
  isDeleted?: boolean;
}

export interface IProductModel extends Model<IProduct> {
  isProductExistsByName(name: string): Promise<IProduct | null>;
  isProductExistsById(id: string): Promise<IProduct | null>;
}
