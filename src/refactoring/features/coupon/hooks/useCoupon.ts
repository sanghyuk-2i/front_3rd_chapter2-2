import { Coupon } from '../../../../types';
import { useEffect, useState } from 'react';
import { fetchCoupons } from '../apis';

export const useCoupons = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  const addCoupon = (newCoupon: Coupon) => {
    setCoupons((prevCoupons) => [...prevCoupons, newCoupon]);
  };

  useEffect(() => {
    fetchCoupons().then((data) => setCoupons(data));
  }, []);

  return { coupons, addCoupon };
};
