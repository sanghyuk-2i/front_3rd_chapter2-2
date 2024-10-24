import { CartItem, Discount } from '../../../../types';

// 제품 할인 관련 함수(Discount)

export const getMaxDiscount = (discounts: Discount[]) => {
  return discounts.reduce((max, discount) => Math.max(max, discount.rate), 0);
};

export const getAppliedDiscount = (item: CartItem) => {
  const { discounts } = item.product;

  return discounts.reduce(
    (result, { rate, quantity }) =>
      item.quantity >= quantity ? Math.max(result, rate) : result,
    0
  );
};
