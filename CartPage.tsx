import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft, CreditCard } from 'lucide-react'
import { RootState, AppDispatch } from '../store/store'
import { updateQuantity, removeFromCart, clearCart } from '../store/slices/cartSlice'

export const CartPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { items } = useSelector((state: RootState) => state.cart)

  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity <= 0) {
      dispatch(removeFromCart(id))
    } else {
      dispatch(updateQuantity({ id, quantity }))
    }
  }

  const handleRemoveItem = (id: string) => {
    dispatch(removeFromCart(id))
  }

  const handleClearCart = () => {
    dispatch(clearCart())
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 50 ? 0 : 9.99
  const tax = subtotal * 0.08
  const finalTotal = subtotal + shipping + tax

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <ShoppingCart className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-2">
            {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex gap-6">
                  {/* Product Image */}
                  <Link to={`/products/${item.id}`} className="flex-shrink-0">
                    <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </Link>

                  {/* Product Details */}
                  <div className="flex-1">
                    <div className="flex justify-between mb-2">
                      <Link
                        to={`/products/${item.id}`}
                        className="text-lg font-semibold text-gray-900 hover:text-indigo-600 transition-colors"
                      >
                        {item.name}
                      </Link>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>

                    <p className="text-gray-600 mb-4">Premium quality product</p>

                    <div className="flex items-center justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-700">Qty:</span>
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="p-2 hover:bg-gray-100 transition-colors"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="p-2 hover:bg-gray-100 transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500">
                          ${item.price.toFixed(2)} each
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Cart Actions */}
            <div className="flex justify-between items-center mt-6">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700"
              >
                <ArrowLeft className="h-5 w-5" />
                Continue Shopping
              </Link>
              <button
                onClick={handleClearCart}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>

                {shipping > 0 && (
                  <p className="text-sm text-green-600">
                    Add ${(50 - subtotal).toFixed(2)} more for free shipping
                  </p>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-lg font-bold text-indigo-600">
                      ${finalTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Promo Code */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Promo Code
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Enter code"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
                    Apply
                  </button>
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                to="/checkout"
                className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
              >
                <CreditCard className="h-5 w-5" />
                Proceed to Checkout
              </Link>

              {/* Security Badge */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Secure Checkout</span>
                </p>
                <div className="flex justify-center space-x-2">
                  <div className="w-12 h-8 bg-gray-200 rounded"></div>
                  <div className="w-12 h-8 bg-gray-200 rounded"></div>
                  <div className="w-12 h-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">You might also like</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow group">
                <Link to={`/products/${i + 1}`}>
                  <div className="aspect-square bg-gray-200 rounded-t-lg overflow-hidden">
                    <img
                      src="/api/placeholder/300/300"
                      alt="Recommended product"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Link>
                <div className="p-4">
                  <h3 className="font-semibold mb-2 group-hover:text-indigo-600 transition-colors">
                    Recommended Product {i + 1}
                  </h3>
                  <p className="text-xl font-bold text-indigo-600">
                    ${(Math.random() * 200 + 50).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
