"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentSchema = exports.BlogSchema = void 0;
const zod_1 = require("zod");
const CommentSchema = zod_1.z.object({
    commenter: zod_1.z.string().min(5, { message: 'Commenter ID is required.' }),
    comment: zod_1.z.string().min(5, { message: 'Comment text is required.' }),
});
exports.CommentSchema = CommentSchema;
// Blog Schema
const BlogSchema = zod_1.z.object({
    name: zod_1.z.string().min(5, { message: 'Blog name is required.' }),
    description: zod_1.z.string().min(5, { message: 'Blog description is required.' }),
    thumbnail: zod_1.z.string().url({ message: 'Thumbnail must be a valid URL.' }),
    author: zod_1.z.string().min(5, { message: 'Author ID is required.' }),
    comments: zod_1.z.array(CommentSchema).optional().default([]),
});
exports.BlogSchema = BlogSchema;
