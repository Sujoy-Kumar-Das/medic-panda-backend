import { Model, Types } from 'mongoose';

export interface ICategory {
  variantId: Types.ObjectId;
  name: string;
  slug: string;
  categoryType: 'primary' | 'secondary' | 'tertiary';
  thumbnail: string;
  isDeleted: boolean;
}

export interface ICategoryModel extends Model<ICategory> {
  isCategoryExistsByName(name: string): Promise<ICategory | null>;
  isCategoryExistsById(id: string): Promise<ICategory | null>;
}