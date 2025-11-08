import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom' // <-- FIXED: was 'in'
import axios from '../../api/axios'
import { toast } from 'react-hot-toast'

export default function VendorProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const fetchProducts = async () => {
    try {
      // This route comes from productRoutes.js and gets *only* this vendor's products
      const { data } = await axios.get('/products/vendor')
      setProducts(data.products)
    } catch {
      toast.error('Could not fetch products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProducts() }, [])

  const deleteProduct = async (id) => {
    // Add a confirmation dialog
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return
    }

    try {
      // This route comes from productRoutes.js (DELETE /:id)
      await axios.delete(`/products/${id}`)
      toast.success('Product deleted')
      fetchProducts() // Re-fetch products to update the list
    } catch {
      toast.error('Delete failed')
    }
  }

  if (loading) {
    return <div className="max-w-4xl mx-auto p-6 text-center">Loading products...</div>
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">📦 My Products</h1>
        <Link
          to="/vendor/products/new"
          className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 font-medium"
        >
          + Add New Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center text-gray-600 bg-white p-10 rounded-lg shadow">
          <p className="text-xl">You haven't added any products yet.</p>
          <p>Click "Add New Product" to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {products.map(product => (
            <div key={product._id} className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img 
                  src={product.images?.[0]?.url || 'https://via.placeholder.com/100'} 
                  alt={product.name}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div>
                  <h2 className="text-xl font-semibold">{product.name}</h2>
                  <p className="text-gray-600">Stock: {product.stock} • Price: ৳{product.price}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Link
                  to={`/vendor/products/edit/${product._id}`}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 font-medium"
                >
                  Edit
                </Link>
                <button
                  onClick={() => deleteProduct(product._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}