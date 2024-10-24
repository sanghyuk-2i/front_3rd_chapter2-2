import { setupWorker } from 'msw/browser';
import { productMockHandlers } from '../../features/product/apis';
import { couponMockHandlers } from '../../features/coupon/apis';

const handlers = [...productMockHandlers, ...couponMockHandlers];

export const worker = setupWorker(...handlers);
