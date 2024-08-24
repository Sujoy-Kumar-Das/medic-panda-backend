import { model, Schema } from 'mongoose';
import { ICategory, ICategoryModel } from './category.interface';

const categorySchema = new Schema<ICategory, ICategoryModel>(
  {
    name: {
      type: String,
      required: [true, 'Category name is required.'],
    },
    slug: {
      type: String,
      required: [true, 'Slug is required.'],
    },
    categoryType: {
      type: String,
      required: [true, 'Category type is required.'],
      enum: ['primary', 'secondary', 'tertiary'],
    },
    thumbnail: {
      type: String,
      required: [true, 'Thumbnail is required.'],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Query Middleware
categorySchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

categorySchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

categorySchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

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
