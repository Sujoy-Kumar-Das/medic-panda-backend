import { model, Schema } from 'mongoose';
import { ICategory, ICategoryModel } from './category.interface';

const categorySchema = new Schema<ICategory, ICategoryModel>(
  {
    name: {
      type: String,
      required: [true, 'Category name is required.'],
    },
    icon: {
      type: String,
      required: [true, 'Icon is required'],
    },
    thumbnail: {
      type: String,
      required: [true, 'Thumbnail is required.'],
    },
    description: {
      type: String,
      required: [true, 'Description is required.'],
      minlength: [50, 'Description Should be minimum 50 characters'],
      maxlength: [100, 'The description should not exceed 100 characters.'],
    },
    popularity: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// category statics methods
categorySchema.statics.isCategoryExistsByName = async function (name: string) {
  return await categoryModel.findOne({
    name: {
      $regex: name,
      $options: 'i',
    },
  });
};

categorySchema.statics.isCategoryExistsById = async function (id: string) {
  return await categoryModel.findById(id);
};

export const categoryModel = model<ICategory, ICategoryModel>(
  'category',
  categorySchema,
);
