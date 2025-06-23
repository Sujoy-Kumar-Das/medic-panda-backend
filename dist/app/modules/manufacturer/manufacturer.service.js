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
exports.manufacturerService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const queryBuilder_1 = __importDefault(require("../../builder/queryBuilder"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const manufacturer_model_1 = require("./manufacturer.model");
const createManufacturer = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isManufactureExistsByName = yield manufacturer_model_1.manufacturerModel.findOne({
        name: {
            $regex: payload.name,
            $options: 'i',
        },
    });
    if (isManufactureExistsByName) {
        throw new AppError_1.default(400, 'This item already exists.');
    }
    const result = yield manufacturer_model_1.manufacturerModel.create(payload);
    return result;
});
const getAllManufacturer = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const manufacturerQueryBuilder = new queryBuilder_1.default(manufacturer_model_1.manufacturerModel.find(), query).search(['name']);
    const result = yield manufacturerQueryBuilder.modelQuery;
    const meta = yield manufacturerQueryBuilder.countTotal(undefined);
    return { result, meta };
});
const getSingleManufacturer = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield manufacturer_model_1.manufacturerModel.findById(id);
    return result;
});
const updateManufacturer = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield manufacturer_model_1.manufacturerModel.findByIdAndUpdate(id, payload);
    return result;
});
const deleteManufacturer = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isManufactureExistsByName = yield manufacturer_model_1.manufacturerModel.findById(id);
    if (!isManufactureExistsByName) {
        throw new AppError_1.default(400, 'This item is not exists.');
    }
    const result = yield manufacturer_model_1.manufacturerModel.findByIdAndDelete(id);
    return result;
});
exports.manufacturerService = {
    createManufacturer,
    getAllManufacturer,
    getSingleManufacturer,
    updateManufacturer,
    deleteManufacturer,
};
