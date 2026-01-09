import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from '../../api/axios'
import { toast } from 'react-hot-toast'
import { motion } from 'framer-motion'
import { FaBoxOpen, FaImage, FaTag, FaLayerGroup, FaDollarSign, FaWarehouse, FaSave } from 'react-icons/fa'
import GlassCard from '../../components/ui/GlassCard'
import PageTransition from '../../components/ui/PageTransition'
import GlowButton from '../../components/ui/GlowButton'

export default function EditProduct() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: 'Electronics',
    imageUrl: ''
  })

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  }

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/products/${id}`)
        setForm({
          name: data.product.name,
          description: data.product.description || '',
          price: data.product.price,
          stock: data.product.stock,
          category: data.product.category,
          imageUrl: data.product.images?.[0]?.url || ''
        })
      } catch {
        toast.error('Failed to load product')
        navigate('/vendor/dashboard')
      } finally {
        setPageLoading(false)
      }
    }
    fetchProduct()
  }, [id, navigate])

  const handleChange = e => {
    if (e.target.name === 'description') {
      // Calculate word count including the new chaaracter
      const words = e.target.value.trim().split(/\s+/).filter(Boolean);
      // Only block if we are exceeding limit AND the user is adding content (not deleting)
      // A simple check relies on the previous length vs new length
      if (words.length > 50) {
        // If strict limit is required, we can just return here to block input
        // However, smooth typing suggests we might want to check against the previous state
        // For now, let's just use the current value to check
        // If it exceeds, we check if the new value is longer than old value (roughly)
        if (e.target.value.length > form.description.length) {
          return;
        }
      }
    }
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)

    const productData = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      stock: Number(form.stock),
      category: form.category,
      images: [{ public_id: "temp_id", url: form.imageUrl }]
    }

    try {
      await axios.put(`/products/${id}`, productData)
      toast.success('Product updated successfully!')
      navigate('/vendor/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed')
    } finally {
      setLoading(false)
    }
  }

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    )
  }

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-2xl shadow-lg">
            <FaBoxOpen className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Edit Product</h1>
            <p className="text-slate-500 text-sm">Update your product details</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Form */}
          <GlassCard className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-5"
              >
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Product Name</label>
                  <div className="relative">
                    <FaTag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      name="name"
                      type="text"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none text-slate-800 placeholder-slate-400"
                      placeholder="e.g. Premium Wireless Headphones"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Price (৳)</label>
                    <div className="relative">
                      <FaDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        name="price"
                        type="number"
                        className="w-full pl-10 pr-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none text-slate-800 placeholder-slate-400"
                        placeholder="0.00"
                        value={form.price}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Stock</label>
                    <div className="relative">
                      <FaWarehouse className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        name="stock"
                        type="number"
                        className="w-full pl-10 pr-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none text-slate-800 placeholder-slate-400"
                        placeholder="Available Qty"
                        value={form.stock}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                  <div className="relative">
                    <FaLayerGroup className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <select
                      name="category"
                      className="w-full pl-10 pr-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none text-slate-800 appearance-none cursor-pointer"
                      value={form.category}
                      onChange={handleChange}
                    >
                      <option>Electronics</option>
                      <option>Clothing</option>
                      <option>Footwear</option>
                      <option>Food & Beverages</option>
                      <option>Books</option>
                      <option>Beauty & Personal Care</option>
                      <option>Home & Kitchen</option>
                      <option>Others</option>
                    </select>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                  <div className="relative">
                    <textarea
                      name="description"
                      rows="4"
                      className="w-full p-4 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none text-slate-800 placeholder-slate-400 resize-none"
                      placeholder="Describe your product in detail (Max 50 words)..."
                      value={form.description}
                      onChange={handleChange}
                      required
                    />
                    <div className={`absolute bottom-3 right-3 text-xs font-bold ${form.description.trim().split(/\s+/).filter(Boolean).length >= 50 ? 'text-rose-500' : 'text-slate-400'
                      }`}>
                      {form.description.trim() ? form.description.trim().split(/\s+/).filter(Boolean).length : 0}/50 words
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Image URL</label>
                  <div className="relative">
                    <FaImage className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      name="imageUrl"
                      type="url"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none text-slate-800 placeholder-slate-400"
                      placeholder="https://example.com/image.jpg"
                      value={form.imageUrl}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="pt-4">
                  <GlowButton
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 text-lg bg-blue-600 hover:bg-blue-500"
                  >
                    <FaSave className="mr-2" /> {loading ? 'Saving Changes...' : 'Save Changes'}
                  </GlowButton>
                </motion.div>
              </motion.div>
            </form>
          </GlassCard>

          {/* Right Column: Live Preview */}
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="text-lg font-bold text-slate-700 mb-4">Live Preview</h3>
              <GlassCard className="p-6 overflow-hidden group">
                <div className="aspect-square w-full bg-slate-100 rounded-xl overflow-hidden border border-slate-200 relative flex items-center justify-center mb-4">
                  {form.imageUrl ? (
                    <img
                      src={form.imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/400x400?text=Invalid+Image+URL'
                      }}
                    />
                  ) : (
                    <div className="text-center text-slate-400">
                      <FaImage size={48} className="mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Image preview will appear here</p>
                    </div>
                  )}

                  {/* Stock Badge Preview */}
                  {form.stock && (
                    <div className="absolute top-4 right-4 bg-teal-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      In Stock: {form.stock}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-slate-800 line-clamp-1">{form.name || 'Product Name'}</h2>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 text-sm bg-slate-100 px-2 py-1 rounded">{form.category}</span>
                    <span className="text-xl font-bold text-teal-600">৳{form.price || '0.00'}</span>
                  </div>
                  <p className="text-slate-500 text-sm line-clamp-3 mt-2">
                    {form.description || 'Product description will appear here...'}
                  </p>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}