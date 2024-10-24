import '@testing-library/jest-dom';
import { afterAll, beforeAll } from 'vitest';
import { afterEach } from 'node:test';
import { setupServer } from 'msw/node';
import { productMockHandlers } from './refactoring/features/product/apis';
import { couponMockHandlers } from './refactoring/features/coupon/apis';

const handlers = [...productMockHandlers, ...couponMockHandlers];

export const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
