import { useState, useEffect } from 'react'
import axios from '../api/axios'

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('/products')
      setProducts(data.products || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Browse Products</h1>
          
          {/* Search Bar */}
          <input
            type="text"
            placeholder="🔍 Search products..."
            className="w-full max-w-xl p-4 border rounded-lg shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center text-gray-600 py-20">Loading products...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center text-gray-600 py-20">
            <p className="text-2xl mb-4">No products found</p>
            <p>Try a different search or check back later!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
                <img
                  src={product.images?.[0]?.url || 'https://via.placeholder.com/300'}
                  alt={product.name}
                  className="w-full h-56 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2 line-clamp-1">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-teal-600 font-bold text-2xl">৳{product.price}</span>
                    <button className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition">
                      Buy Now
                    </button>
                  </div>
                  {product.stock === 0 && (
                    <span className="text-red-500 text-sm mt-2 block">Out of Stock</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
