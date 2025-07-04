import { FilterQuery, Query } from 'mongoose';

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  search(searchableFields: string[]) {
    const searchTerm = this?.query?.searchTerm;
    if (searchTerm) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map(
          (field) =>
            ({
              [field]: { $regex: searchTerm, $options: 'i' },
            }) as FilterQuery<T>,
        ),
      });
    }

    return this;
  }

  filter() {
    const queryObj = { ...this.query };

    const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields'];
    excludeFields.forEach((el) => delete queryObj[el]);

    // Convert Boolean-like strings to actual Boolean values if needed
    Object.keys(queryObj).forEach((key) => {
      if (queryObj[key] === 'true') queryObj[key] = true;
      if (queryObj[key] === 'false') queryObj[key] = false;
    });

    // Apply filters to the query
    Object.keys(queryObj).forEach((key) => {
      this.modelQuery = this.modelQuery.where(key).equals(queryObj[key]);
    });

    return this;
  }

  sort() {
    const sort =
      (this?.query?.sort as string)?.split(',')?.join(' ') || '-createdAt';
    this.modelQuery = this.modelQuery.sort(sort as string);

    return this;
  }

  limit() {
    const isLimit = this.query.limit;

    console.log({ isLimit });
    if (isLimit) {
      this.modelQuery = this.modelQuery.limit(Number(isLimit));
    }
    return this;
  }

  paginate() {
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 10;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);

    return this;
  }

  populate(fields: string[]) {
    fields.forEach((field) => {
      this.modelQuery = this.modelQuery.populate(field);
    });
    return this;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async countTotal(fields?: Record<string, any> | undefined) {
    const total = await this.modelQuery.model.countDocuments(fields);
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || total;
    const totalPage = Math.ceil(total / limit);

    return {
      page,
      limit,
      total,
      totalPage,
    };
  }
}

export default QueryBuilder;
