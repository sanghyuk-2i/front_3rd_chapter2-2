import { useState } from 'react';
import { Product } from '../../../../types';

export const useProductEditor = () => {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [product, setProduct] = useState<Product | null>(null);

  const openProductEditor = (product: Product) => {
    setIsEditMode(true);
    setProduct(product);
  };

  const updateEditProductValue = (
    key: keyof Product,
    value: Product[keyof Product]
  ) => {
    setProduct(
      (prevProduct) => prevProduct && { ...prevProduct, [key]: value }
    );
  };

  const validateSubmit = (callback: (editProduct: Product) => void) => {
    if (!product) return;

    callback(product);
  };

  const closeProductEditor = () => {
    setIsEditMode(false);
    setProduct(null);
  };

  return {
    product,
    isEditMode,
    validateSubmit,
    openProductEditor,
    updateEditProductValue,
    closeProductEditor,
  };
};
