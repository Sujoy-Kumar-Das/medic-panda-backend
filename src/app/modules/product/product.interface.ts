import mongoose, { Model, Types } from 'mongoose';

export interface IDiscount {
  discountStatus: boolean;
  percentage: number;
  discountPrice?: number;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
}

export interface IRating {
  average: number;
  count: number;
  lastUpdated: Date;
}

export interface IProduct {
  name: string;
  price: number;
  discount?: IDiscount | null;
  stockStatus?: boolean;
  thumbnail: string;
  category: Types.ObjectId;
  manufacturer: Types.ObjectId;
  rating?: IRating;
  isWishList: boolean;
  isDeleted?: boolean;
}

export interface IProductModel extends Model<IProduct> {
  isProductExistsByName(name: string): Promise<IProduct | null>;
  isProductExistsById(
    id: string,
    session?: mongoose.ClientSession,
  ): Promise<IProduct | null>;
}
