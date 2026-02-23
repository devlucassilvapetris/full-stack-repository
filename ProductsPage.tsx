import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { Search, Grid, List, ShoppingCart, Star, Heart, SlidersHorizontal } from 'lucide-react'
import { RootState, AppDispatch } from '../store/store'
import { fetchProductsAsync, setFilters } from '../store/slices/productsSlice'
import { addToCart } from '../store/slices/cartSlice'

export const ProductsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { products, isLoading, categories } = useSelector((state: RootState) => state.products)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortBy, setSortBy] = useState('name')

  useEffect(() => {
    dispatch(fetchProductsAsync({ 
      category: selectedCategory, 
      search: searchTerm, 
      sortBy 
    }))
  }, [dispatch, selectedCategory, searchTerm, sortBy])

  const handleFilterChange = () => {
    dispatch(setFilters({
      category: selectedCategory,
      priceRange,
      search: searchTerm,
      sortBy
    }))
    dispatch(fetchProductsAsync({ 
      category: selectedCategory, 
      search: searchTerm, 
      sortBy 
    }))
  }

  type SimpleProduct = { id: string; name: string; price: number; image: string }
  const handleAddToCart = (product: SimpleProduct) => {
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image
    }))
  }

  const filteredProducts = products.filter(product => 
    product.price >= priceRange[0] && product.price <= priceRange[1]
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest First</option>
              </select>

              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden p-2 border border-gray-300 rounded-lg"
              >
                <SlidersHorizontal className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <aside className={`${showFilters ? 'block' : 'hidden'} lg:block w-64 flex-shrink-0`}>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h3 className="font-semibold text-lg mb-4">Filters</h3>
              
              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Categories</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label key={category} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value={category}
                        checked={selectedCategory === category}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm">{category}</span>
                    </label>
                  ))}
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value=""
                      checked={selectedCategory === ''}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-sm">All Categories</span>
                  </label>
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Price Range</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">$</span>
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                      min="0"
                    />
                    <span className="text-sm text-gray-600">to</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                      min="0"
                    />
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                </div>
              </div>

              <button
                onClick={handleFilterChange}
                className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </aside>

          {/* Products */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
                    <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="mb-4 text-sm text-gray-600">
                  Showing {filteredProducts.length} products
                </div>

                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                      <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow group">
                        <div className="relative">
                          <Link to={`/products/${product.id}`}>
                            <div className="aspect-square bg-gray-200 rounded-t-lg overflow-hidden">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          </Link>
                          <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
                            <Heart className="h-4 w-4 text-gray-600" />
                          </button>
                          {product.stock < 10 && (
                            <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded text-xs">
                              Low Stock
                            </div>
                          )}
                        </div>
                        
                        <div className="p-4">
                          <Link to={`/products/${product.id}`}>
                            <h3 className="font-semibold text-lg mb-2 group-hover:text-indigo-600 transition-colors">
                              {product.name}
                            </h3>
                          </Link>
                          
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
                          
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <p className="text-2xl font-bold text-indigo-600">
                                ${product.price}
                              </p>
                              {product.stock > 0 ? (
                                <p className="text-sm text-green-600">In Stock</p>
                              ) : (
                                <p className="text-sm text-red-600">Out of Stock</p>
                              )}
                            </div>
                          </div>
                          
                          <button
                            onClick={() => handleAddToCart(product)}
                            disabled={product.stock === 0}
                            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          >
                            <ShoppingCart className="h-4 w-4" />
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredProducts.map((product) => (
                      <div key={product.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-lg transition-shadow">
                        <div className="flex gap-6">
                          <Link to={`/products/${product.id}`} className="flex-shrink-0">
                            <div className="w-32 h-32 bg-gray-200 rounded-lg overflow-hidden">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          </Link>
                          
                          <div className="flex-1">
                            <Link to={`/products/${product.id}`}>
                              <h3 className="font-semibold text-xl mb-2 hover:text-indigo-600 transition-colors">
                                {product.name}
                              </h3>
                            </Link>
                            
                            <p className="text-gray-600 mb-3 line-clamp-2">
                              {product.description}
                            </p>
                            
                            <div className="flex items-center mb-3">
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
                                ({product.reviews} reviews)
                              </span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-2xl font-bold text-indigo-600">
                                  ${product.price}
                                </p>
                                <p className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
                                </p>
                              </div>
                              
                              <div className="flex gap-2">
                                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                                  <Heart className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleAddToCart(product)}
                                  disabled={product.stock === 0}
                                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                  <ShoppingCart className="h-4 w-4" />
                                  Add to Cart
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
