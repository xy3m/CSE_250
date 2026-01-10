import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from '../../api/axios'
import { toast } from 'react-hot-toast'
import { motion } from 'framer-motion'
import { FaBoxOpen, FaImage, FaTag, FaLayerGroup, FaDollarSign, FaWarehouse, FaSave, FaCloudUploadAlt, FaTrash } from 'react-icons/fa'
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
      const words = e.target.value.trim().split(/\s+/).filter(Boolean);
      if (words.length > 50) {
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
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
      </div>
    )
  }

  return (
    <PageTransition>
      <div className="min-h-screen pt-32 pb-20 px-6 sm:px-8 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-white/10 p-4 rounded-full border border-white/10">
              <FaBoxOpen className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Edit Product</h1>
              <p className="text-gray-400 text-sm">Update your product details</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Form */}
            <GlassCard className="p-6 sm:p-8 bg-[#1C1C1E] border-white/10">
              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="space-y-5"
                >
                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Product Name</label>
                    <div className="relative">
                      <FaTag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input
                        name="name"
                        type="text"
                        className="w-full pl-10 pr-4 py-3 bg-black border border-white/10 rounded-xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-white placeholder-gray-600"
                        placeholder="e.g. Premium Wireless Headphones"
                        value={form.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">Price (৳)</label>
                      <div className="relative">
                        <FaDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                          name="price"
                          type="number"
                          className="w-full pl-10 pr-4 py-3 bg-black border border-white/10 rounded-xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-white placeholder-gray-600"
                          placeholder="0.00"
                          value={form.price}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">Stock</label>
                      <div className="relative">
                        <FaWarehouse className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                          name="stock"
                          type="number"
                          className="w-full pl-10 pr-4 py-3 bg-black border border-white/10 rounded-xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-white placeholder-gray-600"
                          placeholder="Available Qty"
                          value={form.stock}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Category</label>
                    <div className="relative">
                      <FaLayerGroup className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                      <select
                        name="category"
                        className="w-full pl-10 pr-4 py-3 bg-black border border-white/10 rounded-xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-white appearance-none cursor-pointer"
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
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Description</label>
                    <div className="relative">
                      <textarea
                        name="description"
                        rows="4"
                        className="w-full p-4 bg-black border border-white/10 rounded-xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-white placeholder-gray-600 resize-none"
                        placeholder="Describe your product in detail (Max 50 words)..."
                        value={form.description}
                        onChange={handleChange}
                        required
                      />
                      <div className={`absolute bottom-3 right-3 text-xs font-bold ${form.description.trim().split(/\s+/).filter(Boolean).length >= 50 ? 'text-red-500' : 'text-gray-500'
                        }`}>
                        {form.description.trim() ? form.description.trim().split(/\s+/).filter(Boolean).length : 0}/50 words
                      </div>
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Product Image</label>
                    <div className="relative group">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (!file) return;

                          setLoading(true);
                          const formData = new FormData();
                          formData.append('file', file);
                          formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

                          try {
                            const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, {
                              method: 'POST',
                              body: formData
                            });
                            const data = await res.json();

                            if (data.secure_url) {
                              setForm(prev => ({ ...prev, imageUrl: data.secure_url }));
                              toast.success("Image uploaded!");
                            } else {
                              throw new Error("Upload failed");
                            }
                          } catch (err) {
                            toast.error("Image upload failed. Check Cloudinary settings.");
                          } finally {
                            setLoading(false);
                          }
                        }}
                        className="hidden"
                        id="image-upload"
                        disabled={loading}
                      />

                      <label
                        htmlFor="image-upload"
                        className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-blue-500/50 hover:bg-blue-500/5 transition-all ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {form.imageUrl ? (
                          <div className="relative w-full h-full p-2 group-hover:opacity-100">
                            <img src={form.imageUrl} alt="Uploaded" className="w-full h-full object-contain rounded-lg" />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                setForm(prev => ({ ...prev, imageUrl: '' }));
                              }}
                              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                            >
                              <FaTrash size={12} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            {loading ? (
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-2"></div>
                            ) : (
                              <FaCloudUploadAlt className="w-8 h-8 text-gray-400 mb-3 group-hover:text-blue-400 transition-colors" />
                            )}
                            <p className="text-sm text-gray-400"><span className="font-semibold">Click to upload</span></p>
                            <p className="text-xs text-gray-500 mt-1">SVG, PNG, JPG or GIF</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="pt-4">
                    <GlowButton
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 text-lg"
                      variant="primary"
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
                <h3 className="text-lg font-bold text-white mb-4">Live Preview</h3>
                <GlassCard className="p-6 overflow-hidden group bg-[#1C1C1E] border-white/10">
                  <div className="aspect-square w-full bg-black rounded-xl overflow-hidden border border-white/10 relative flex items-center justify-center mb-4">
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
                      <div className="text-center text-gray-500">
                        <FaImage size={48} className="mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Image preview will appear here</p>
                      </div>
                    )}

                    {/* Stock Badge Preview */}
                    {form.stock && (
                      <div className="absolute top-4 right-4 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        In Stock: {form.stock}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-white line-clamp-1">{form.name || 'Product Name'}</h2>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm bg-white/5 px-2 py-1 rounded border border-white/5">{form.category}</span>
                      <span className="text-xl font-bold text-white">৳{form.price || '0.00'}</span>
                    </div>
                    <p className="text-gray-500 text-sm line-clamp-3 mt-2">
                      {form.description || 'Product description will appear here...'}
                    </p>
                  </div>
                </GlassCard>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}