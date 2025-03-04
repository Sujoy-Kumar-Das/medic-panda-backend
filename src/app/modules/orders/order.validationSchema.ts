import { z } from 'zod';
import { OrderStatus } from './order.interface';

const shippingAddressSchema = z.object({
  city: z.string({ required_error: 'City is required.' }),
  street: z.string({ required_error: 'State is required.' }),
  postalCode: z.string({ required_error: 'Postal Code is required.' }),
  country: z.string({ required_error: 'Country is required.' }),
});

const createOrderValidationSchema = z.object({
  body: z.object({
    product: z.string({ required_error: 'Product id is required.' }),
    quantity: z
      .number({ required_error: 'Quantity is required.' })
      .nonnegative({ message: 'Quantity should be a positive number.' }),
    shippingAddress: shippingAddressSchema,
  }),
});

const changeOrderStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum(Object.values(OrderStatus) as [string, ...string[]], {
      message: 'Please Select a status value.',
    }),
  }),
});

export const orderValidationSchema = {
  createOrderValidationSchema,
  changeOrderStatusValidationSchema,
};
