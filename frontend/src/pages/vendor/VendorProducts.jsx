import { Link } from 'react-router-dom'

export default function VendorProducts() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">📦 My Products</h1>
      <Link
        to="/vendor/products/new"
        className="bg-teal-700 hover:bg-teal-800 text-white px-4 py-2 rounded mb-4 inline-block"
      >
        ➕ Add Product
      </Link>
      <div className="bg-white p-6 rounded shadow mt-4">
        <p className="text-gray-600">No products yet. Start by adding one!</p>
      </div>
    </div>
  )
}
