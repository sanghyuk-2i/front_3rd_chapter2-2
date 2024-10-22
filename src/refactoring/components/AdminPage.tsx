import { useState } from 'react';
import { Coupon, Discount, Product } from '../../types';
import { useForm, useToggle, useProductEditor } from '../../refactoring/hooks';
import { formatDiscountValue } from '../hooks/utils/couponUtils';

interface Props {
  products: Product[];
  coupons: Coupon[];
  onProductUpdate: (updatedProduct: Product) => void;
  onProductAdd: (newProduct: Product) => void;
  onCouponAdd: (newCoupon: Coupon) => void;
}

export const AdminPage = ({
  products,
  coupons,
  onProductUpdate,
  onProductAdd,
  onCouponAdd,
}: Props) => {
  const [openProductIds, setOpenProductIds] = useState<Set<string>>(new Set());

  const {
    isToggle: isNewProductFormOpen,
    toggle: toggleNewProductForm,
    turnToggleOff: closeNewProductForm,
  } = useToggle();

  const {
    values: newCoupon,
    setValue: setNewCoupon,
    validateSubmit: validateNewCoupon,
    reset: resetNewCoupon,
  } = useForm<Coupon>({
    name: '',
    code: '',
    discountType: 'percentage',
    discountValue: 0,
  });

  const {
    values: newDiscount,
    setValue: setNewDiscount,
    reset: resetNewDiscount,
  } = useForm<Discount>({
    quantity: 0,
    rate: 0,
  });

  const {
    values: newProduct,
    setValue: setNewProduct,
    reset: resetNewProduct,
  } = useForm<Omit<Product, 'id'>>({
    name: '',
    price: 0,
    stock: 0,
    discounts: [],
  });

  const {
    product: editProduct,
    validateSubmit: validateEditProduct,
    openProductEditor,
    updateEditProductValue,
    closeProductEditor,
  } = useProductEditor();

  const toggleProductAccordion = (productId: string) => {
    setOpenProductIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const handleProductNameUpdate = (productId: string, newName: string) => {
    if (editProduct && editProduct.id !== productId) return;

    updateEditProductValue('name', newName);
  };

  const handlePriceUpdate = (productId: string, newPrice: number) => {
    if (editProduct && editProduct.id !== productId) return;

    updateEditProductValue('price', newPrice);
  };

  const handleEditComplete = () =>
    validateEditProduct((editProduct) => {
      onProductUpdate(editProduct);
      closeProductEditor();
    });

  const handleStockUpdate = (productId: string, newStock: number) => {
    const updatedProduct = products.find((p) => p.id === productId);

    if (!updatedProduct) return;
    const newProduct = { ...updatedProduct, stock: newStock };

    updateEditProductValue('stock', newStock);
    onProductUpdate(newProduct);
  };

  const handleAddDiscount = (productId: string) => {
    const updatedProduct = products.find((p) => p.id === productId);

    if (!updatedProduct || !editProduct) return;
    const discounts = [...updatedProduct.discounts, newDiscount];
    const newProduct = {
      ...updatedProduct,
      discounts,
    };

    onProductUpdate(newProduct);
    updateEditProductValue('discounts', discounts);

    resetNewDiscount();
  };

  const handleRemoveDiscount = (productId: string, index: number) => {
    const updatedProduct = products.find((p) => p.id === productId);

    if (!updatedProduct) return;

    const discounts = updatedProduct.discounts.filter((_, i) => i !== index);
    const newProduct = {
      ...updatedProduct,
      discounts,
    };

    onProductUpdate(newProduct);
    updateEditProductValue('discounts', discounts);
  };

  const handleAddCoupon = () =>
    validateNewCoupon((data) => {
      onCouponAdd(data);
      resetNewCoupon();
    });

  const handleAddNewProduct = () => {
    const productWithId = { ...newProduct, id: Date.now().toString() };
    onProductAdd(productWithId);

    resetNewProduct();
    closeNewProductForm();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">관리자 페이지</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">상품 관리</h2>
          <button
            onClick={toggleNewProductForm}
            className="bg-green-500 text-white px-4 py-2 rounded mb-4 hover:bg-green-600"
          >
            {isNewProductFormOpen ? '취소' : '새 상품 추가'}
          </button>

          {isNewProductFormOpen && (
            <div className="bg-white p-4 rounded shadow mb-4">
              <h3 className="text-xl font-semibold mb-2">새 상품 추가</h3>
              <div className="mb-2">
                <label
                  htmlFor="productName"
                  className="block text-sm font-medium text-gray-700"
                >
                  상품명
                </label>
                <input
                  id="productName"
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct('name', e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="mb-2">
                <label
                  htmlFor="productPrice"
                  className="block text-sm font-medium text-gray-700"
                >
                  가격
                </label>
                <input
                  id="productPrice"
                  type="number"
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct('price', parseInt(e.target.value))
                  }
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="mb-2">
                <label
                  htmlFor="productStock"
                  className="block text-sm font-medium text-gray-700"
                >
                  재고
                </label>
                <input
                  id="productStock"
                  type="number"
                  value={newProduct.stock}
                  onChange={(e) =>
                    setNewProduct('stock', parseInt(e.target.value))
                  }
                  className="w-full p-2 border rounded"
                />
              </div>

              <button
                onClick={handleAddNewProduct}
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                추가
              </button>
            </div>
          )}

          <div className="space-y-2">
            {products.map((product, index) => (
              <div
                key={product.id}
                data-testid={`product-${index + 1}`}
                className="bg-white p-4 rounded shadow"
              >
                <button
                  data-testid="toggle-button"
                  onClick={() => toggleProductAccordion(product.id)}
                  className="w-full text-left font-semibold"
                >
                  {product.name} - {product.price}원 (재고: {product.stock})
                </button>

                {openProductIds.has(product.id) && (
                  <div className="mt-2">
                    {editProduct && editProduct.id === product.id ? (
                      <div>
                        <div className="mb-4">
                          <label className="block mb-1">상품명: </label>
                          <input
                            type="text"
                            value={editProduct.name}
                            onChange={(e) =>
                              handleProductNameUpdate(
                                product.id,
                                e.target.value
                              )
                            }
                            className="w-full p-2 border rounded"
                          />
                        </div>

                        <div className="mb-4">
                          <label className="block mb-1">가격: </label>
                          <input
                            type="number"
                            value={editProduct.price}
                            onChange={(e) =>
                              handlePriceUpdate(
                                product.id,
                                parseInt(e.target.value)
                              )
                            }
                            className="w-full p-2 border rounded"
                          />
                        </div>

                        <div className="mb-4">
                          <label className="block mb-1">재고: </label>
                          <input
                            type="number"
                            value={editProduct.stock}
                            onChange={(e) =>
                              handleStockUpdate(
                                product.id,
                                parseInt(e.target.value)
                              )
                            }
                            className="w-full p-2 border rounded"
                          />
                        </div>
                        {/* 할인 정보 수정 부분 */}
                        <div>
                          <h4 className="text-lg font-semibold mb-2">
                            할인 정보
                          </h4>

                          {editProduct.discounts.map((discount, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center mb-2"
                            >
                              <span>
                                {discount.quantity}개 이상 구매 시{' '}
                                {discount.rate * 100}% 할인
                              </span>
                              <button
                                onClick={() =>
                                  handleRemoveDiscount(product.id, index)
                                }
                                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                              >
                                삭제
                              </button>
                            </div>
                          ))}

                          <div className="flex space-x-2">
                            <input
                              type="number"
                              placeholder="수량"
                              value={newDiscount.quantity}
                              onChange={(e) =>
                                setNewDiscount(
                                  'quantity',
                                  parseInt(e.target.value)
                                )
                              }
                              className="w-1/3 p-2 border rounded"
                            />

                            <input
                              type="number"
                              placeholder="할인율 (%)"
                              value={newDiscount.rate * 100}
                              onChange={(e) =>
                                setNewDiscount(
                                  'rate',
                                  parseInt(e.target.value) / 100
                                )
                              }
                              className="w-1/3 p-2 border rounded"
                            />

                            <button
                              onClick={() => handleAddDiscount(product.id)}
                              className="w-1/3 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                            >
                              할인 추가
                            </button>
                          </div>
                        </div>

                        <button
                          onClick={handleEditComplete}
                          className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 mt-2"
                        >
                          수정 완료
                        </button>
                      </div>
                    ) : (
                      <div>
                        {product.discounts.map((discount, index) => (
                          <div key={index} className="mb-2">
                            <span>
                              {discount.quantity}개 이상 구매 시{' '}
                              {discount.rate * 100}% 할인
                            </span>
                          </div>
                        ))}

                        <button
                          data-testid="modify-button"
                          onClick={() => openProductEditor(product)}
                          className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mt-2"
                        >
                          수정
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">쿠폰 관리</h2>
          <div className="bg-white p-4 rounded shadow">
            <div className="space-y-2 mb-4">
              <input
                type="text"
                placeholder="쿠폰 이름"
                value={newCoupon.name}
                onChange={(e) => setNewCoupon('name', e.target.value)}
                className="w-full p-2 border rounded"
              />

              <input
                type="text"
                placeholder="쿠폰 코드"
                value={newCoupon.code}
                onChange={(e) => setNewCoupon('code', e.target.value)}
                className="w-full p-2 border rounded"
              />

              <div className="flex gap-2">
                <select
                  value={newCoupon.discountType}
                  onChange={(e) =>
                    setNewCoupon(
                      'discountType',
                      e.target.value as Coupon['discountType']
                    )
                  }
                  className="w-full p-2 border rounded"
                >
                  <option value="amount">금액(원)</option>
                  <option value="percentage">할인율(%)</option>
                </select>

                <input
                  type="number"
                  placeholder="할인 값"
                  value={newCoupon.discountValue}
                  onChange={(e) =>
                    setNewCoupon('discountValue', parseInt(e.target.value))
                  }
                  className="w-full p-2 border rounded"
                />
              </div>

              <button
                onClick={handleAddCoupon}
                className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
              >
                쿠폰 추가
              </button>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">현재 쿠폰 목록</h3>
              <div className="space-y-2">
                {coupons.map((coupon, index) => (
                  <div
                    key={index}
                    data-testid={`coupon-${index + 1}`}
                    className="bg-gray-100 p-2 rounded"
                  >
                    {coupon.name} ({coupon.code}):
                    {formatDiscountValue(
                      coupon.discountValue,
                      coupon.discountType
                    )}{' '}
                    할인
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
