"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replyModel = void 0;
const mongoose_1 = require("mongoose");
const replySchema = new mongoose_1.Schema({
    review: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'review',
        required: [true, 'Review ID is required.'],
    },
    reply: {
        type: String,
        required: [true, 'Reply Required.'],
        min: 3,
        trim: true,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'User Id is required.'],
    },
}, {
    timestamps: true,
});
exports.replyModel = (0, mongoose_1.model)('reply', replySchema);
