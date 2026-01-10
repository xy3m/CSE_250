import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from '../../api/axios'
import { toast } from 'react-hot-toast'
import GlassCard from '../../components/ui/GlassCard'
import GlowButton from '../../components/ui/GlowButton'
import { FaEdit, FaBox, FaTag, FaImage, FaUndo, FaList } from 'react-icons/fa'

export default function EditProduct() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  // Initialize with empty strings to avoid uncontrolled input warnings
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    imageUrl: ''
  })

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/products/${id}`)
        setForm({
          name: data.product.name || '',
          description: data.product.description || '',
          price: data.product.price || '',
          stock: data.product.stock || '',
          category: data.product.category || 'Others',
          imageUrl: data.product.images?.[0]?.url || ''
        })
      } catch {
        toast.error('Failed to load product')
        navigate('/admin/dashboard')
      }
    }
    fetchProduct()
  }, [id, navigate])

  const handleChange = e => {
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
      navigate('/admin/dashboard')
    } catch {
      toast.error('Update failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-32 px-6 bg-black pb-20">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate('/admin/dashboard')} className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white border border-white/10">
            <FaUndo className="text-lg" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Update Product</h1>
            <p className="text-gray-400 text-sm">Modify product details and stock.</p>
          </div>
        </div>

        <GlassCard className="p-8 bg-[#1C1C1E] border-white/10 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Product Name</label>
              <div className="relative">
                <FaTag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  name="name"
                  type="text"
                  className="w-full pl-10 pr-4 py-3 bg-black border border-white/10 rounded-xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-white placeholder:text-gray-600"
                  placeholder="e.g. Wireless Headset"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Description</label>
              <textarea
                name="description"
                className="w-full p-4 bg-black border border-white/10 rounded-xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-white placeholder:text-gray-600 resize-none"
                placeholder="Detailed product description..."
                value={form.description}
                onChange={handleChange}
                rows="4"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Price */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Price (৳)</label>
                <input
                  name="price"
                  type="number"
                  className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-white font-bold placeholder:text-gray-600"
                  placeholder="0.00"
                  value={form.price}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Stock */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Stock Quantity</label>
                <div className="relative">
                  <FaBox className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    name="stock"
                    type="number"
                    className="w-full pl-10 pr-4 py-3 bg-black border border-white/10 rounded-xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-white font-bold placeholder:text-gray-600"
                    placeholder="0"
                    value={form.stock}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Category</label>
              <div className="relative">
                <FaList className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <select
                  name="category"
                  className="w-full pl-10 pr-4 py-3 bg-black border border-white/10 rounded-xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-white appearance-none cursor-pointer"
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
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Image URL</label>
              <div className="relative">
                <FaImage className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  name="imageUrl"
                  type="url"
                  className="w-full pl-10 pr-4 py-3 bg-black border border-white/10 rounded-xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-white placeholder:text-gray-600 text-sm"
                  placeholder="https://..."
                  value={form.imageUrl}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="pt-6 flex gap-4">
              <button
                type="button"
                onClick={() => navigate('/admin/dashboard')}
                className="px-6 py-3 rounded-xl font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <GlowButton
                type="submit"
                className="flex-1 !py-3 !text-base"
                disabled={loading}
                variant="primary"
              >
                {loading ? 'Updating...' : 'Update Product'}
              </GlowButton>
            </div>

          </form>
        </GlassCard>
      </div>
    </div>
  )
}