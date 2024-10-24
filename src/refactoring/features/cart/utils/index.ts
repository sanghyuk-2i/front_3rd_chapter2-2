import { CartItem, Coupon } from '../../../../types';

export const calculateItemTotal = (item: CartItem) => {
  const totalAmount = item.product.price * item.quantity;

  return totalAmount * (1 - getMaxApplicableDiscount(item));
};

export const getMaxApplicableDiscount = ({ product, quantity }: CartItem) => {
  return product.discounts.reduce(
    (maxDiscount, discount) =>
      Math.max(maxDiscount, discount.quantity <= quantity ? discount.rate : 0),
    0
  );
};

export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null
) => {
  let totalBeforeDiscount = 0;

  let totalAfterDiscount = cart.reduce((total, item) => {
    let totalAmount = calculateItemTotal(item);

    totalBeforeDiscount += item.product.price * item.quantity;
    total += totalAmount;
    return total;
  }, 0);

  if (selectedCoupon) {
    if (selectedCoupon.discountType === 'amount') {
      totalAfterDiscount = Math.max(
        0,
        totalAfterDiscount - selectedCoupon.discountValue
      );
    } else {
      totalAfterDiscount *= 1 - selectedCoupon.discountValue / 100;
    }
  }

  return {
    totalBeforeDiscount,
    totalAfterDiscount,
    totalDiscount: totalBeforeDiscount - totalAfterDiscount,
  };
};

export const updateCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  newQuantity: number
): CartItem[] => {
  return cart
    .map(({ product, quantity }) => {
      const isProductMatched = product.id === productId;
      const isInStock = newQuantity <= product.stock;

      return {
        product,
        quantity: isProductMatched
          ? isInStock
            ? newQuantity
            : product.stock
          : quantity,
      };
    })
    .filter(({ quantity }) => !!quantity);
};
