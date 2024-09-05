import { Model } from 'mongoose';

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
  discount?: IDiscount;
  stockStatus?: boolean;
  thumbnail: string;
  isDeleted?: boolean;
}

export interface IProductModel extends Model<IProduct> {
  isProductExistsByName(name: string): Promise<IProduct | null>;
  isProductExistsById(id: string): Promise<IProduct | null>;
}
