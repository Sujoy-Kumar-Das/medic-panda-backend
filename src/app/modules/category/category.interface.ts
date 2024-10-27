import { Model } from 'mongoose';

export interface ICategory {
  name: string;
  thumbnail: string;
}

export interface ICategoryModel extends Model<ICategory> {
  isCategoryExistsByName(name: string): Promise<ICategory | null>;
  isCategoryExistsById(id: string): Promise<ICategory | null>;
}
