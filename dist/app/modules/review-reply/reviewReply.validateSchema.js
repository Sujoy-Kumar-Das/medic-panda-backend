"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replyValidationSchema = void 0;
const zod_1 = require("zod");
const addReply = zod_1.z.object({
    body: zod_1.z.object({
        reply: zod_1.z
            .string({
            required_error: 'Reply is required',
            invalid_type_error: 'Reply must be a string',
        })
            .min(3, 'Reply must be at least 3 characters'),
    }),
});
exports.replyValidationSchema = {
    addReply,
};
