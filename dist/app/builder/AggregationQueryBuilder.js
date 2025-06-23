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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
class AggregationQueryBuilder {
    constructor(query) {
        this.pipeline = [];
        this.buildPipeline(query);
    }
    buildPipeline(query) {
        const { searchTerm, sort = '', limit, page, fields } = query, filters = __rest(query, ["searchTerm", "sort", "limit", "page", "fields"]);
        this.search(searchTerm);
        this.filter(filters);
        this.sort(sort);
        this.paginate(page, limit);
        this.project(fields);
    }
    search(searchTerm) {
        if (searchTerm) {
            this.pipeline.push({
                $match: {
                    $or: Object.keys(this.filters).reduce((acc, field) => {
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
                    }, []),
                },
            });
        }
        return this;
    }
    filter(filters) {
        if (Object.keys(filters).length > 0) {
            const validFilters = Object.keys(filters).reduce((acc, key) => {
                const trimmedKey = key.trim();
                if (trimmedKey) {
                    acc[trimmedKey] = filters[key];
                }
                return acc;
            }, {});
            this.pipeline.push({ $match: validFilters });
        }
        return this;
    }
    sort(sort) {
        const sortStage = this.parseSort(sort);
        this.pipeline.push({ $sort: sortStage });
        return this;
    }
    paginate(page, limit) {
        const pageNumber = Number(page) || 1;
        const limitNumber = Number(limit) || 10;
        const skip = (pageNumber - 1) * limitNumber;
        this.pipeline.push({ $skip: skip }, { $limit: limitNumber });
        return this;
    }
    project(fields) {
        if (fields) {
            const projectFields = fields
                .split(',')
                .reduce((acc, field) => {
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
    parseSort(sort) {
        const sortFields = sort
            .split(',')
            .reduce((acc, field) => {
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
    countTotal(model) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const totalPipeline = [...this.pipeline];
            totalPipeline.push({ $count: 'total' });
            const [{ total }] = yield model.aggregate(totalPipeline);
            const limit = Number((_a = this.pipeline.find((stage) => '$limit' in stage)) === null || _a === void 0 ? void 0 : _a.$limit) || 10;
            const page = Number((_b = this.pipeline.find((stage) => '$skip' in stage)) === null || _b === void 0 ? void 0 : _b.$skip) / limit +
                1 || 1;
            const totalPage = Math.ceil((total || 0) / limit);
            return {
                page,
                limit,
                total: total || 0,
                totalPage,
            };
        });
    }
    execute(model) {
        return __awaiter(this, void 0, void 0, function* () {
            return model.aggregate(this.pipeline);
        });
    }
}
exports.default = AggregationQueryBuilder;
