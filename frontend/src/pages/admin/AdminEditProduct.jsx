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
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-blue-500 p-3 rounded-2xl shadow-lg shadow-blue-500/20">
          <FaEdit className="text-white text-xl" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Edit Product</h1>
          <p className="text-slate-300 text-sm">Update product details</p>
        </div>
      </div>

      <GlassCard className="p-8 bg-white/80 border-white/40 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Name */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Product Name</label>
            <div className="relative">
              <FaTag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                name="name"
                type="text"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900 placeholder-slate-400 transition-all font-medium"
                placeholder="e.g. Wireless Headset"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Description - Ensure it is a textarea */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description</label>
            <textarea
              name="description"
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900 placeholder-slate-400 transition-all font-medium resize-none"
              placeholder="Detailed product description..."
              value={form.description}
              onChange={handleChange}
              rows="4"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            {/* Price */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Price (৳)</label>
              <input
                name="price"
                type="number"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 font-bold"
                placeholder="0.00"
                value={form.price}
                onChange={handleChange}
                required
              />
            </div>

            {/* Stock */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Stock Quantity</label>
              <div className="relative">
                <FaBox className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  name="stock"
                  type="number"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 font-bold"
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
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Category</label>
            <div className="relative">
              <FaList className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <select
                name="category"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 appearance-none cursor-pointer font-medium"
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
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Image URL</label>
            <div className="relative">
              <FaImage className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                name="imageUrl"
                type="url"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-600 placeholder-slate-400 text-sm"
                placeholder="https://..."
                value={form.imageUrl}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="pt-4 flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/admin/dashboard')}
              className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <GlowButton
              type="submit"
              className="flex-1 justify-center bg-blue-600 hover:bg-blue-500 text-lg shadow-lg shadow-blue-500/30"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Product'}
            </GlowButton>
          </div>

        </form>
      </GlassCard>
    </div>
  )
}