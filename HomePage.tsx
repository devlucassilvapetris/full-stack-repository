import React from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, Star, Truck, Shield, ArrowRight } from 'lucide-react'

export const HomePage: React.FC = () => {
  const featuredProducts = [
    {
      id: '1',
      name: 'Premium Wireless Headphones',
      price: 299.99,
      image: '/api/placeholder/300/300',
      rating: 4.5,
      reviews: 128
    },
    {
      id: '2',
      name: 'Smart Watch Pro',
      price: 399.99,
      image: '/api/placeholder/300/300',
      rating: 4.8,
      reviews: 89
    },
    {
      id: '3',
      name: 'Laptop Stand Adjustable',
      price: 79.99,
      image: '/api/placeholder/300/300',
      rating: 4.3,
      reviews: 256
    },
    {
      id: '4',
      name: 'Mechanical Keyboard RGB',
      price: 159.99,
      image: '/api/placeholder/300/300',
      rating: 4.7,
      reviews: 167
    }
  ]

  const categories = [
    { name: 'Electronics', image: '/api/placeholder/200/200', count: 1234 },
    { name: 'Clothing', image: '/api/placeholder/200/200', count: 856 },
    { name: 'Home & Garden', image: '/api/placeholder/200/200', count: 642 },
    { name: 'Sports', image: '/api/placeholder/200/200', count: 423 }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Amazing Products, Great Prices
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Discover thousands of products at unbeatable prices
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center"
              >
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/deals"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors"
              >
                View Deals
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <Truck className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Free Shipping</h3>
              <p className="text-gray-600">On orders over $50</p>
            </div>
            <div className="text-center">
              <Shield className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Secure Payment</h3>
              <p className="text-gray-600">100% secure transactions</p>
            </div>
            <div className="text-center">
              <Star className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Quality Products</h3>
              <p className="text-gray-600">Premium quality guaranteed</p>
            </div>
            <div className="text-center">
              <ShoppingCart className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Easy Returns</h3>
              <p className="text-gray-600">30-day return policy</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={`/products?category=${category.name.toLowerCase()}`}
                className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow"
              >
                <div className="aspect-square bg-gray-200">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <div className="text-center text-white">
                    <h3 className="font-semibold text-lg">{category.name}</h3>
                    <p className="text-sm">{category.count} products</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link
              to="/products"
              className="text-indigo-600 hover:text-indigo-700 font-semibold flex items-center"
            >
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden"
              >
                <div className="aspect-square bg-gray-200">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-indigo-600">
                    {product.name}
                  </h3>
                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-2">
                      ({product.reviews})
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-indigo-600">
                    ${product.price}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-indigo-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Stay Updated with Our Latest Deals
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Subscribe to our newsletter and never miss an offer
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
