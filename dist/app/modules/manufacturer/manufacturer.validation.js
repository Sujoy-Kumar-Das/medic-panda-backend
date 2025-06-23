"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.manufacturerValidationSchema = void 0;
const zod_1 = require("zod");
const addressSchema = zod_1.z.object({
    city: zod_1.z.string({ required_error: 'City is required.' }),
    zipCode: zod_1.z.number({ required_error: 'Zip code is required.' }),
    state: zod_1.z.string({ required_error: 'State is required.' }),
    country: zod_1.z.string({ required_error: 'Country is required.' }),
});
const createManufacturerValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string({ required_error: 'Manufacturer name is required.' })
            .min(3, {
            message: 'Manufacturer name must be at least 3 characters long.',
        }),
        description: zod_1.z
            .string({
            required_error: 'Manufacturer description is required.',
        })
            .min(50, {
            message: 'Manufacturer description must be at least 50 characters long.',
        }),
        contact: zod_1.z.string({ required_error: 'Manufacturer contact is required.' }),
        address: addressSchema,
    }),
});
exports.manufacturerValidationSchema = {
    createManufacturerValidationSchema,
};
