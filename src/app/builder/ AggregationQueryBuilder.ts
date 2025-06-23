/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, PipelineStage } from 'mongoose';

export class AggregationQueryBuilder<T> {
  private pipeline: PipelineStage[] = [];
  private model: Model<T>;
  private query: Record<string, any>;

  constructor(model: Model<T>, query: Record<string, any>) {
    this.model = model;
    this.query = query;
  }

  match(match: object) {
    this.pipeline.push({ $match: match });
    return this;
  }

  lookup(from: string, localField: string, foreignField: string, as: string) {
    this.pipeline.push({
      $lookup: {
        from,
        localField,
        foreignField,
        as,
      },
    });
    return this;
  }

  unwind(path: string) {
    this.pipeline.push({ $unwind: `$${path}` });
    return this;
  }

  search(fieldPath: string) {
    const searchTerm = this.query.searchTerm;
    if (searchTerm) {
      this.pipeline.push({
        $match: {
          [fieldPath]: { $regex: searchTerm, $options: 'i' },
        },
      });
    }
    return this;
  }

  filter(allowedFields: string[] = []) {
    const filters: Record<string, any> = {};
    Object.keys(this.query).forEach((key) => {
      if (
        !['searchTerm', 'sort', 'page', 'limit'].includes(key) &&
        (allowedFields.length === 0 || allowedFields.includes(key))
      ) {
        let value = this.query[key];
        if (value === 'true') value = true;
        if (value === 'false') value = false;
        filters[key] = value;
      }
    });

    if (Object.keys(filters).length > 0) {
      this.pipeline.push({ $match: filters });
    }

    return this;
  }

  sort() {
    const sortBy = this.query.sort || '-createdAt';

    const sortFields = sortBy
      .split(' ')
      .reduce((acc: Record<string, any>, field: string) => {
        const direction = field.startsWith('-') ? -1 : 1;
        const cleanField = field.replace(/^-/, '');
        acc[cleanField] = direction;
        return acc;
      }, {});

    this.pipeline.push({ $sort: sortFields });
    return this;
  }

  paginate() {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    const skip = (page - 1) * limit;

    this.pipeline.push({ $skip: skip }, { $limit: limit });
    return this;
  }

  build() {
    return this.pipeline;
  }

  async countTotal() {
    const total = await this.model.countDocuments();
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 10;
    const totalPage = Math.ceil(total / limit);

    return {
      page,
      limit,
      total,
      totalPage,
    };
  }

  async exec() {
    return this.model.aggregate(this.pipeline);
  }
}
