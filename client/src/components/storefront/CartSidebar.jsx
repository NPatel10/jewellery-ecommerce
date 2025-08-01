import React from 'react';
import { XMarkIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useCart } from '../../hooks/useCart';

const CartSidebar = () => {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    getCartTotal,
    getCartItemsCount
  } = useCart();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    // Handle checkout logic
    console.log('Proceeding to checkout with items:', cartItems);
    alert('Checkout functionality will be implemented next!');
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Cart Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Shopping Cart ({getCartItemsCount()})
            </h2>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <div className="text-6xl mb-4">🛍️</div>
                <p className="text-lg font-medium mb-2">Your cart is empty</p>
                <p className="text-sm text-center">
                  Discover our beautiful jewelry collection and add some sparkle to your cart!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="flex items-center space-x-4 bg-gray-50 p-3 rounded-lg">
                    {/* Product Image */}
                    <img
                      src={item.product.images?.[0] || '/api/placeholder/80/80'}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {item.product.name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {item.product.material} • {item.product.category}
                      </p>
                      <p className="text-sm font-semibold text-gray-900 mt-1">
                        ${item.product.price.toLocaleString()}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex flex-col items-end space-y-2">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 rounded-md border border-gray-300 hover:bg-gray-100"
                        >
                          <MinusIcon className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 rounded-md border border-gray-300 hover:bg-gray-100"
                        >
                          <PlusIcon className="h-4 w-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-xs text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="border-t border-gray-200 p-4 space-y-4">
              {/* Subtotal */}
              <div className="flex justify-between items-center">
                <span className="text-base font-medium text-gray-900">Subtotal</span>
                <span className="text-lg font-semibold text-gray-900">
                  ${getCartTotal().toLocaleString()}
                </span>
              </div>

              {/* Shipping Note */}
              <p className="text-xs text-gray-500 text-center">
                Shipping and taxes calculated at checkout
              </p>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full bg-purple-600 text-white py-3 px-4 rounded-md font-medium hover:bg-purple-700 transition-colors"
              >
                Checkout
              </button>

              {/* Continue Shopping */}
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-full text-purple-600 py-2 px-4 rounded-md font-medium hover:bg-purple-50 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;