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
exports.productService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const queryBuilder_1 = __importDefault(require("../../builder/queryBuilder"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const calcutlateDiscount_1 = __importDefault(require("../../utils/calcutlateDiscount"));
const category_model_1 = require("../category/category.model");
const manufacturer_model_1 = require("../manufacturer/manufacturer.model");
const productDetail_model_1 = require("../porductDetail/productDetail.model");
const getProductsWithWishlistStatus_1 = __importDefault(require("./getProductsWithWishlistStatus"));
const porduct_model_1 = require("./porduct.model");
const createProductService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { product, productDetail } = payload;
    const { name, price, discount, category, manufacturer } = product;
    // check is the the product already exists
    const isProductExists = yield porduct_model_1.productModel.isProductExistsByName(name);
    if (isProductExists && !isProductExists.isDeleted) {
        throw new AppError_1.default(403, `${name} product already exists you can increase the stock.`);
    }
    const isCategoryExists = yield category_model_1.categoryModel.findById(category);
    if (!isCategoryExists) {
        throw new AppError_1.default(403, `This category is not found.`);
    }
    // check is the manufacture is available
    const isManufactureAvailable = yield manufacturer_model_1.manufacturerModel.findById(manufacturer);
    if (!isManufactureAvailable) {
        throw new AppError_1.default(404, 'Manufacture is not found.');
    }
    // create a session
    const session = yield mongoose_1.default.startSession();
    try {
        // start transaction
        session.startTransaction();
        if (discount) {
            discount.discountPrice = (0, calcutlateDiscount_1.default)(price, discount.percentage);
            discount.discountStatus = true;
        }
        // create the product
        const createProduct = yield porduct_model_1.productModel.create([product], { session });
        if (!(createProduct === null || createProduct === void 0 ? void 0 : createProduct.length)) {
            throw new AppError_1.default(400, 'Flailed to create product.');
        }
        productDetail.product = createProduct[0]._id;
        const createCustomer = yield productDetail_model_1.productDetailModel.create([productDetail], {
            session,
        });
        if (!createCustomer.length) {
            throw new AppError_1.default(400, 'Failed to create product.');
        }
        yield session.commitTransaction();
        yield session.endSession();
        return createCustomer[0];
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new AppError_1.default(400, 'Something went wrong for create user. Please try again.');
    }
});
const getAllProductService = (userId, query) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if 'category' is in the query
    if (query.category) {
        const categoryFilter = query.category;
        // Check if it's an ObjectId (24-character hex string)
        if (categoryFilter.match(/^[0-9a-fA-F]{24}$/)) {
            query.category = categoryFilter;
        }
        else {
            // If it's a name, look up the category by name and get its ID
            const categoryDoc = yield category_model_1.categoryModel.findOne({
                name: { $regex: categoryFilter, $options: 'i' },
            });
            query.category = categoryDoc ? categoryDoc._id : null;
        }
    }
    const baseQuery = porduct_model_1.productModel
        .find({ isDeleted: false })
        .populate('category')
        .populate('manufacturer')
        .lean();
    const productQuery = new queryBuilder_1.default(baseQuery, query);
    const products = productQuery.search(['name']).filter().paginate();
    const meta = yield productQuery.countTotal({ isDeleted: false });
    const productResult = yield products.modelQuery;
    const result = yield (0, getProductsWithWishlistStatus_1.default)(productResult, userId);
    return { result, meta };
});
const getSingleProductService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield productDetail_model_1.productDetailModel.findOne({ product: id }).populate({
        path: 'product',
        populate: [{ path: 'category' }, { path: 'manufacturer' }],
    });
    return result;
});
const updateProductService = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { product, productDetail } = payload;
    const { price, discount, category, manufacturer } = product;
    const isProductExists = yield porduct_model_1.productModel.isProductExistsById(id);
    if (!isProductExists) {
        throw new AppError_1.default(404, 'This product is not found');
    }
    if (isProductExists.isDeleted) {
        throw new AppError_1.default(404, `${isProductExists.name} is deleted.`);
    }
    const isCategoryExists = yield category_model_1.categoryModel.findById(category);
    if (!isCategoryExists) {
        throw new AppError_1.default(403, `This category is not found.`);
    }
    const isManufactureAvailable = yield manufacturer_model_1.manufacturerModel.findById(manufacturer);
    if (!isManufactureAvailable) {
        throw new AppError_1.default(404, 'Manufacture is not found.');
    }
    // create a session
    const session = yield mongoose_1.default.startSession();
    try {
        // start transaction
        session.startTransaction();
        if (!discount) {
            payload.product.discount = undefined;
        }
        if (discount) {
            discount.discountPrice = (0, calcutlateDiscount_1.default)(price, discount.percentage);
            discount.discountStatus = true;
        }
        // update the product
        const updatedProduct = yield porduct_model_1.productModel.findByIdAndUpdate(id, Object.assign({}, product), { session, new: true });
        if (!updatedProduct) {
            throw new AppError_1.default(400, 'Failed to update product.');
        }
        if (productDetail) {
            const updatedProductDetails = yield productDetail_model_1.productDetailModel.findOneAndUpdate({ product: id }, Object.assign({}, productDetail), { session, new: true });
            if (!updatedProductDetails) {
                throw new AppError_1.default(400, 'Failed to update product details.');
            }
        }
        yield session.commitTransaction();
        session.endSession();
        return updatedProduct;
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw new AppError_1.default(400, 'Something went wrong while updating the product. Please try again.');
    }
});
const deleteProductService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
        const product = yield porduct_model_1.productModel.findById(id);
        if (!product) {
            throw new AppError_1.default(404, 'This product is not found.');
        }
        const isDeleted = product.isDeleted;
        if (isDeleted) {
            throw new AppError_1.default(409, 'This product already deleted.');
        }
        const result = yield porduct_model_1.productModel
            .findByIdAndUpdate(id, {
            isDeleted: true,
        }, { new: true })
            .select('+isDeleted');
        if (!(result === null || result === void 0 ? void 0 : result.isDeleted)) {
            throw new AppError_1.default(400, `Failed to delete ${product.name} `);
        }
        return null;
    }), 5000);
});
exports.productService = {
    createProductService,
    getAllProductService,
    getSingleProductService,
    updateProductService,
    deleteProductService,
};
