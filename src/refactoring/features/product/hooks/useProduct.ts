import { useState } from 'react';
import { Product } from '../../../../types';

export const useProducts = (initialProducts: Product[]) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);

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

  return { products, addProduct, updateProduct };
};
