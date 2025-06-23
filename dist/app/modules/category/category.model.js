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
exports.categoryModel = void 0;
const mongoose_1 = require("mongoose");
const categorySchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Category name is required.'],
    },
    thumbnail: {
        type: String,
        required: [true, 'Thumbnail is required.'],
    },
    popularity: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
    versionKey: false,
});
// category statics methods
categorySchema.statics.isCategoryExistsByName = function (name) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield exports.categoryModel.findOne({
            name: {
                $regex: name,
                $options: 'i',
            },
        });
    });
};
categorySchema.statics.isCategoryExistsById = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield exports.categoryModel.findById(id);
    });
};
exports.categoryModel = (0, mongoose_1.model)('category', categorySchema);
