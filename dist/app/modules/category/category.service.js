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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryService = void 0;
const queryBuilder_1 = __importDefault(require("../../builder/queryBuilder"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const category_model_1 = require("./category.model");
const createCategoryService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // check is the category exists
    const isCategoryExists = yield category_model_1.categoryModel.isCategoryExistsByName(payload.name);
    if (isCategoryExists) {
        throw new AppError_1.default(401, 'This category is already exists.');
    }
    const result = yield category_model_1.categoryModel.create(payload);
    return result;
});
const getAllCategoryService = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryQuery = new queryBuilder_1.default(category_model_1.categoryModel.find(), query);
    const category = categoryQuery.search(['name']).filter().limit();
    const meta = yield categoryQuery.countTotal(undefined);
    const result = yield category.modelQuery;
    return { meta, result };
});
const getSingleCategoryService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = category_model_1.categoryModel.findById(id);
    return result;
});
const updateCategoryService = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = payload;
    // check is the category already exists by id
    const isCategoryExistsById = yield category_model_1.categoryModel.isCategoryExistsById(id);
    if (!isCategoryExistsById) {
        throw new AppError_1.default(401, 'This category is not found.');
    }
    // check is the category is already exists by name
    const isCategoryExistsByName = yield category_model_1.categoryModel.isCategoryExistsByName(name);
    if (isCategoryExistsByName) {
        throw new AppError_1.default(401, 'This category is already exists.');
    }
    const result = yield category_model_1.categoryModel.findByIdAndUpdate(id, payload);
    return result;
});
const deleteCategoryService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isCategoryExists = yield category_model_1.categoryModel.findById(id);
    if (!isCategoryExists) {
        throw new AppError_1.default(404, 'This category is not found.');
    }
    yield category_model_1.categoryModel.findByIdAndDelete(id);
    return null;
});
exports.categoryService = {
    createCategoryService,
    getAllCategoryService,
    getSingleCategoryService,
    updateCategoryService,
    deleteCategoryService,
};
