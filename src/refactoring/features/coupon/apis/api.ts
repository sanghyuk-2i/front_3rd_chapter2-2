export const fetchCoupons = async () => {
  const response = await fetch('/api/coupons');
  return await response.json();
};
