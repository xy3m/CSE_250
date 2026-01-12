import { useState, useEffect } from 'react'
import axios from '../api/axios'
import { useDispatch } from 'react-redux'
import { addItemToCart } from '../redux/slices/cartSlice'
import { toast } from 'react-hot-toast'
import { useSearchParams, Link } from 'react-router-dom'
import { FaSearch, FaArrowLeft, FaStar } from 'react-icons/fa'
import { motion } from 'framer-motion'
import ReviewModal from '../components/ReviewModal'
import GlassCard from '../components/ui/GlassCard'
import GlowButton from '../components/ui/GlowButton'
import PageTransition from '../components/ui/PageTransition'

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [reviewModalOpen, setReviewModalOpen] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState(null)
  const dispatch = useDispatch()

  const [searchParams] = useSearchParams()
  const categoryQuery = searchParams.get('category')

  useEffect(() => {
    fetchProducts()
  }, [categoryQuery])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = {}
      if (categoryQuery) {
        params.category = categoryQuery
      }
      const { data } = await axios.get('/products', { params: params })
      setProducts(data.products || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = (product) => {
    if (product.stock === 0) {
      toast.error('Sorry, this product is out of stock');
      return;
    }
    dispatch(addItemToCart(product));
    toast.success(`${product.name} added to cart!`);
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <PageTransition>
      <div className="min-h-screen pt-24">
        {/* 1. Header Section with Gradient */}
        <div className="glass sticky top-20 z-40 transition-all duration-300 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">

              {/* Title & Filter Info */}
              <div className="animate-fade-in-down">
                <h1 className="text-3xl font-bold text-white transition-colors duration-300 hover:text-teal-400 cursor-default">
                  {categoryQuery ? (
                    <span className="flex items-center gap-2">
                      Category: <span className="text-teal-400">{categoryQuery}</span>
                    </span>
                  ) : 'All Products'}
                </h1>

                {/* === UPDATED: Back to Home Button === */}
                {categoryQuery && (
                  <Link
                    to="/dashboard"
                    className="text-sm text-slate-400 hover:text-teal-400 flex items-center gap-2 mt-2 font-medium transition-all duration-300 group hover:-translate-x-1"
                  >
                    <FaArrowLeft className="group-hover:-translate-x-1 transition-transform duration-300" />
                    Back to Homepage
                  </Link>
                )}
                {/* =================================== */}
              </div>

              {/* Modern Search Bar */}
              <div className="relative w-full md:w-96 group">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-hover:text-teal-500 transition-colors duration-300" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:bg-slate-800 transition-all duration-300 text-slate-200 font-medium placeholder-slate-500 group-hover:bg-slate-800 group-hover:shadow-md"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* 2. Loading State */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 animate-fade-in">
              <div className="bg-white/5 p-8 rounded-2xl shadow-sm inline-block border border-white/10 hover:shadow-md transition-shadow duration-300 backdrop-blur-md">
                <p className="text-2xl font-bold text-slate-200 mb-2">No products found</p>
                <p className="text-slate-400">Try a different search or clear the category filter.</p>
                {categoryQuery && (
                  <Link to="/products" className="mt-4 inline-block text-teal-400 font-medium hover:underline hover:text-teal-300 transition-colors duration-200">
                    View All Products
                  </Link>
                )}
              </div>
            </div>
          ) : (
            /* 3. The New Modern Grid */
            /* 3. The New Modern Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <GlassCard
                  key={product._id}
                  className="group flex flex-col justify-between h-[460px] !p-0 overflow-hidden"
                >
                  {/* Image Area */}
                  <div className="h-[280px] w-full bg-gray-800 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#151516] to-transparent z-10 opacity-60" />
                    <img
                      src={product.images?.[0]?.url || 'https://via.placeholder.com/300'}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                    />

                    {/* Stock Badge */}
                    {product.stock === 0 && (
                      <div className="absolute top-4 right-4 bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md z-20">
                        Sold Out
                      </div>
                    )}
                  </div>

                  {/* Content Area */}
                  <div className="p-6 flex flex-col flex-grow bg-[#151516] relative z-20 border-t border-[#2C2C2E]">
                    <div className="mb-auto">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg text-white leading-tight line-clamp-1">{product.name}</h3>
                        <span className="text-gray-400 font-medium">৳{product.price}</span>
                      </div>

                      {/* Rating Stars */}
                      <div className="flex items-center gap-1 mb-2">
                        <div className="flex text-yellow-500 drop-shadow-sm">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                              key={star}
                              size={12}
                              className={star <= (product.ratings || 0) ? "fill-current" : "text-gray-600"}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500 font-medium ml-1">({product.numOfReviews})</span>
                      </div>

                      <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
                    </div>

                    <div className="flex items-center gap-3 mt-4">
                      <button
                        onClick={() => { setSelectedProductId(product._id); setReviewModalOpen(true); }}
                        className="p-2 rounded-full border border-[#38383A] text-gray-400 hover:text-white hover:bg-[#2C2C2E] transition-colors"
                      >
                        <FaStar size={14} />
                      </button>
                      <GlowButton
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock === 0}
                        className={`flex-1 !py-2 !text-sm ${product.stock === 0 ? 'opacity-50' : ''}`}
                        variant="primary"
                      >
                        {product.stock === 0 ? 'Unavailable' : 'Buy'}
                      </GlowButton>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>
        <ReviewModal
          isOpen={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          productId={selectedProductId}
        />
      </div>
    </PageTransition >
  )
}