"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordModel = exports.MPasswordSchema = void 0;
const mongoose_1 = require("mongoose");
exports.MPasswordSchema = new mongoose_1.Schema({
    value: {
        type: String,
        required: true,
        default: ""
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
    },
}, {
    timestamps: true,
});
exports.passwordModel = (0, mongoose_1.model)("password", exports.MPasswordSchema);
