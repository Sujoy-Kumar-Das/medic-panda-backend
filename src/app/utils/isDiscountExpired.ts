import { IDiscount } from '../modules/product/product.interface';

const isDiscountExpired = (discount: IDiscount): boolean => {
  if (!discount) return false;

  const now = new Date();
  const endDate = new Date(discount.endDate);
  const [endHours, endMinutes] = discount.endTime.split(':').map(Number);

  endDate.setHours(endHours, endMinutes, 0, 0);

  return now > endDate;
};

export default isDiscountExpired;
