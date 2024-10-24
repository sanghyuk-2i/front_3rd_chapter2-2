import { http, HttpResponse } from 'msw';

export const couponMockHandlers = [
  http.get('/api/coupons', () => {
    return HttpResponse.json([
      {
        name: '5000원 할인 쿠폰',
        code: 'AMOUNT5000',
        discountType: 'amount',
        discountValue: 5000,
      },
      {
        name: '10% 할인 쿠폰',
        code: 'PERCENT10',
        discountType: 'percentage',
        discountValue: 10,
      },
    ]);
  }),
];
