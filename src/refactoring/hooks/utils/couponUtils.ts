import { Coupon } from '../../../types';

export const formatDiscountValue = (
  value: Coupon['discountValue'],
  type: Coupon['discountType']
) => {
  return type === 'amount' ? `${value}원` : `${value}%`;
};
