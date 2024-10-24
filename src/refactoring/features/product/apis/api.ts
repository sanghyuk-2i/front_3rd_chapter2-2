export const fetchProducts = async () => {
  const response = await fetch('/api/products');
  return await response.json();
};
