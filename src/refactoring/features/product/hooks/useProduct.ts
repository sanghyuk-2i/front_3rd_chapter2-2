import { useEffect, useState } from 'react';
import { Product } from '../../../../types';
import { fetchProducts } from '../apis';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);

  const addProduct = (newProduct: Product) => {
    setProducts((prevProducts) => [...prevProducts, newProduct]);
  };

  const updateProduct = (targetProduct: Product) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === targetProduct.id ? targetProduct : product
      )
    );
  };

  useEffect(() => {
    fetchProducts().then((data) => setProducts(data));
  }, []);

  return { products, addProduct, updateProduct };
};
