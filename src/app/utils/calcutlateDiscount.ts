const calculateDiscount = (price: number, discountPercentage: number) => {
  if (!discountPercentage) {
    return 0;
  }

  const numberPrice = Number(price);
  const numberDiscountPercentage = Number(discountPercentage);

  return Number(
    (numberPrice - numberPrice * (numberDiscountPercentage / 100)).toFixed(2),
  );
};

export default calculateDiscount;
