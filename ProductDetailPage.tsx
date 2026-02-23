import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { ShoppingCart, Heart, Star, Truck, Shield, RefreshCw, Minus, Plus } from 'lucide-react'
import { RootState, AppDispatch } from '../store/store'
import { fetchProductByIdAsync } from '../store/slices/productsSlice'
import { addToCart } from '../store/slices/cartSlice'

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const dispatch = useDispatch<AppDispatch>()
  const { currentProduct, isLoading } = useSelector((state: RootState) => state.products)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'shipping'>('description')

  useEffect(() => {
    if (id) {
      dispatch(fetchProductByIdAsync(id))
    }
  }, [dispatch, id])

  const handleAddToCart = () => {
    if (currentProduct) {
      dispatch(addToCart({
        id: currentProduct.id,
        name: currentProduct.name,
        price: currentProduct.price,
        quantity,
        image: currentProduct.image
      }))
    }
  }

  const handleQuantityChange = (change: number) => {
    setQuantity(prev => Math.max(1, Math.min(currentProduct?.stock || 1, prev + change)))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="aspect-square bg-gray-200 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!currentProduct) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
            <Link to="/products" className="text-indigo-600 hover:text-indigo-700">
              Back to products
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const productImages = [
    currentProduct.image,
    '/api/placeholder/400/400',
    '/api/placeholder/400/400',
    '/api/placeholder/400/400'
  ]

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  const colors = ['Black', 'White', 'Red', 'Blue', 'Green']

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <ol className="flex items-center space-x-2">
            <li><Link to="/" className="text-gray-500 hover:text-gray-700">Home</Link></li>
            <li className="text-gray-400">/</li>
            <li><Link to="/products" className="text-gray-500 hover:text-gray-700">Products</Link></li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-900">{currentProduct.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={productImages[selectedImage]}
                alt={currentProduct.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-indigo-600' : 'border-transparent'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${currentProduct.name} ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {currentProduct.name}
              </h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(currentProduct.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">
                  {currentProduct.rating} ({currentProduct.reviews} reviews)
                </span>
                <span className="text-green-600">
                  {currentProduct.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              <div className="text-3xl font-bold text-indigo-600 mb-6">
                ${currentProduct.price}
              </div>

              {/* Size Selection */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Size</h3>
                <div className="grid grid-cols-6 gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 px-4 border rounded-lg font-medium transition-colors ${
                        selectedSize === size
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Color</h3>
                <div className="flex space-x-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border rounded-lg transition-colors ${
                        selectedColor === color
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Quantity</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      className="p-2 hover:bg-gray-100 transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-4 py-2 font-medium">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="p-2 hover:bg-gray-100 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="text-sm text-gray-600">
                    {currentProduct.stock} items available
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-4 mb-8">
                <button
                  onClick={handleAddToCart}
                  disabled={currentProduct.stock === 0}
                  className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Add to Cart
                </button>
                <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Heart className="h-5 w-5" />
                </button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Truck className="h-5 w-5 text-green-600" />
                  <span>Free Shipping</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Shield className="h-5 w-5 text-green-600" />
                  <span>2 Year Warranty</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <RefreshCw className="h-5 w-5 text-green-600" />
                  <span>Easy Returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('description')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'description'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'reviews'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Reviews ({currentProduct.reviews})
              </button>
              <button
                onClick={() => setActiveTab('shipping')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'shipping'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Shipping & Returns
              </button>
            </nav>
          </div>

          <div className="mt-8">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold mb-4">Product Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {currentProduct.description}
                </p>
                <div className="mt-6">
                  <h4 className="font-semibold mb-3">Key Features</h4>
                  <ul className="list-disc list-inside space-y-2 text-gray-600">
                    <li>Premium quality materials</li>
                    <li>Modern and stylish design</li>
                    <li>Durable and long-lasting</li>
                    <li>Easy to maintain and clean</li>
                    <li>Perfect for everyday use</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <h3 className="text-lg font-semibold mb-6">Customer Reviews</h3>
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-lg border">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                        <div>
                          <p className="font-medium">John Doe</p>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className="h-4 w-4 text-yellow-400 fill-current"
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">2 days ago</span>
                    </div>
                    <p className="text-gray-600">
                      Great product! Exactly what I was looking for. High quality and fast shipping.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold mb-4">Shipping & Returns</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-2">Shipping</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      <li>Free shipping on orders over $50</li>
                      <li>Standard shipping: 5-7 business days</li>
                      <li>Express shipping: 2-3 business days</li>
                      <li>International shipping available</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Returns</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      <li>30-day return policy</li>
                      <li>Items must be unused and in original packaging</li>
                      <li>Free return shipping on defective items</li>
                      <li>Refund processed within 5-7 business days</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">Related Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow group">
                <Link to={`/products/${i + 1}`}>
                  <div className="aspect-square bg-gray-200 rounded-t-lg overflow-hidden">
                    <img
                      src="/api/placeholder/300/300"
                      alt="Related product"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Link>
                <div className="p-4">
                  <h3 className="font-semibold mb-2 group-hover:text-indigo-600 transition-colors">
                    Related Product {i + 1}
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
