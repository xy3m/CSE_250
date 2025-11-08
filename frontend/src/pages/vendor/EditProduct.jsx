import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from '../../api/axios'
import { toast } from 'react-hot-toast'

export default function EditProduct() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ 
    name:'', 
    description:'', 
    price:'', 
    stock:'', 
    category:'', 
    imageUrl:'' 
  })

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/products/${id}`)
        setForm({
          name: data.product.name,
          description: data.product.description,
          price: data.product.price,
          stock: data.product.stock,
          category: data.product.category,
          imageUrl: data.product.images?.[0]?.url || ''
        })
      } catch {
        toast.error('Failed to load product')
        navigate('/vendor/products') // Go back if product fails to load
      }
    }
    fetchProduct()
  }, [id, navigate])

  const handleChange = e => {
    setForm({...form, [e.target.name]: e.target.value})
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
      // This route comes from productRoutes.js (PUT /:id)
      await axios.put(`/products/${id}`, productData)
      toast.success('Product updated')
      navigate('/vendor/products')
    } catch {
      toast.error('Update failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">✏️ Edit Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
        <input
          name="name"
          type="text"
          className="w-full p-2 border rounded"
          placeholder="Product name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          className="w-full p-2 border rounded"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
        />
        <input
          name="price"
          type="number"
          className="w-full p-2 border rounded"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
        />
        <input
          name="stock"
          type="number"
          className="w-full p-2 border rounded"
          placeholder="Stock"
          value={form.stock}
          onChange={handleChange}
          required
        />
        <select
          name="category"
          className="w-full p-2 border rounded"
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
        <input
          name="imageUrl"
          type="url"
          className="w-full p-2 border rounded"
          placeholder="Image URL"
          value={form.imageUrl}
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update Product'}
        </button>
      </form>
    </div>
  )
}