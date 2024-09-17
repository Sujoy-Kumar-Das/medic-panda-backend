import { Document, Model, PipelineStage } from 'mongoose';

class AggregationQueryBuilder<T extends Document> {
  public pipeline: PipelineStage[];

  constructor(query: Record<string, unknown>) {
    this.pipeline = [];
    this.buildPipeline(query);
  }

  private buildPipeline(query: Record<string, unknown>) {
    const { searchTerm, sort = '', limit, page, fields, ...filters } = query;

    this.search(searchTerm as string);
    this.filter(filters);
    this.sort(sort as string);
    this.paginate(page as string, limit as string);
    this.project(fields as string);
  }

  search(searchTerm?: string) {
    if (searchTerm) {
      this.pipeline.push({
        $match: {
          $or: Object.keys(this.filters).reduce(
            (acc: Record<string, any>[], field: string) => {
              const trimmedField = field.trim();
              if (trimmedField) {
                acc.push({
                  [trimmedField]: {
                    $regex: searchTerm,
                    $options: 'i',
                  },
                });
              }
              return acc;
            },
            [],
          ),
        },
      });
    }

    return this;
  }

  filter(filters: Record<string, unknown>) {
    if (Object.keys(filters).length > 0) {
      const validFilters = Object.keys(filters).reduce(
        (acc: Record<string, any>, key: string) => {
          const trimmedKey = key.trim();
          if (trimmedKey) {
            acc[trimmedKey] = filters[key];
          }
          return acc;
        },
        {},
      );
      this.pipeline.push({ $match: validFilters });
    }

    return this;
  }

  sort(sort: string) {
    const sortStage = this.parseSort(sort);
    this.pipeline.push({ $sort: sortStage });

    return this;
  }

  paginate(page?: string | number, limit?: string | number) {
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    this.pipeline.push({ $skip: skip }, { $limit: limitNumber });

    return this;
  }

  project(fields?: string) {
    if (fields) {
      const projectFields = (fields as string)
        .split(',')
        .reduce((acc: Record<string, 1>, field: string) => {
          const trimmedField = field.trim();
          if (trimmedField) {
            acc[trimmedField] = 1;
          }
          return acc;
        }, {});
      this.pipeline.push({ $project: projectFields });
    }

    return this;
  }

  private parseSort(sort: string): Record<string, 1 | -1> {
    const sortFields = sort
      .split(',')
      .reduce((acc: Record<string, 1 | -1>, field: string) => {
        const trimmedField = field.trim();
        if (trimmedField) {
          const direction = trimmedField.startsWith('-') ? -1 : 1;
          const key = trimmedField.replace(/^-/, '');
          acc[key] = direction;
        }
        return acc;
      }, {});

    // Default sort if no valid fields are provided
    if (Object.keys(sortFields).length === 0) {
      sortFields['createdAt'] = -1; // Default sort by creation date, descending
    }

    return sortFields;
  }

  async countTotal(model: Model<T>) {
    const totalPipeline = [...this.pipeline];
    totalPipeline.push({ $count: 'total' });
    const [{ total }] = await model.aggregate(totalPipeline);
    const limit =
      Number(this.pipeline.find((stage) => '$limit' in stage)?.$limit) || 10;
    const page =
      Number(this.pipeline.find((stage) => '$skip' in stage)?.$skip) / limit +
        1 || 1;
    const totalPage = Math.ceil((total || 0) / limit);

    return {
      page,
      limit,
      total: total || 0,
      totalPage,
    };
  }

  async execute(model: Model<T>) {
    return model.aggregate(this.pipeline);
  }
}

export default AggregationQueryBuilder;
