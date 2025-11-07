import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AddProduct() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: 'Electronics',
    imageUrl: ''
  })

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = e => {
    e.preventDefault()
    alert('Product added! (Backend integration pending)')
    navigate('/vendor/products')
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">➕ Add New Product</h1>
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
          <option>Food</option>
          <option>Books</option>
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
          className="bg-teal-700 hover:bg-teal-800 text-white px-4 py-2 rounded w-full"
        >
          Add Product
        </button>
      </form>
    </div>
  )
}
