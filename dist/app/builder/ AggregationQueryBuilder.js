"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AggregationQueryBuilder = void 0;
class AggregationQueryBuilder {
    constructor(model, query) {
        this.pipeline = [];
        this.model = model;
        this.query = query;
    }
    match(match) {
        this.pipeline.push({ $match: match });
        return this;
    }
    lookup(from, localField, foreignField, as) {
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
    unwind(path) {
        this.pipeline.push({ $unwind: `$${path}` });
        return this;
    }
    search(fieldPath) {
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
    filter(allowedFields = []) {
        const filters = {};
        Object.keys(this.query).forEach((key) => {
            if (!['searchTerm', 'sort', 'page', 'limit'].includes(key) &&
                (allowedFields.length === 0 || allowedFields.includes(key))) {
                let value = this.query[key];
                if (value === 'true')
                    value = true;
                if (value === 'false')
                    value = false;
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
            .reduce((acc, field) => {
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
    countTotal() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const total = yield this.model.countDocuments();
            const page = Number((_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.page) || 1;
            const limit = Number((_b = this === null || this === void 0 ? void 0 : this.query) === null || _b === void 0 ? void 0 : _b.limit) || 10;
            const totalPage = Math.ceil(total / limit);
            return {
                page,
                limit,
                total,
                totalPage,
            };
        });
    }
    exec() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.aggregate(this.pipeline);
        });
    }
}
exports.AggregationQueryBuilder = AggregationQueryBuilder;
