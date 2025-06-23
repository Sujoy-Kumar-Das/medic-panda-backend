"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Comment Schema
const CommentSchema = new mongoose_1.Schema({
    commenter: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Commenter is required.'],
    },
    comment: {
        type: String,
        required: [true, 'Comment text is required.'],
    },
});
// Blog Schema
const BlogSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Blog name is required.'],
    },
    description: {
        type: String,
        required: [true, 'Blog description is required.'],
    },
    thumbnail: {
        type: String,
        required: [true, 'Thumbnail image URL is required.'],
    },
    author: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Author is required.'],
    },
    comments: {
        type: [CommentSchema],
        default: [],
    },
});
// Blog Model
const blogModel = (0, mongoose_1.model)('Blog', BlogSchema);
exports.default = blogModel;
