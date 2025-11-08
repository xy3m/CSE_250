import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from '../../api/axios' // Import axios
import { toast } from 'react-hot-toast' // Import toast

export default function VendorDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // This endpoint comes from vendorController.js [cite: 31]
        const { data } = await axios.get('/vendor/dashboard')
        if (data.success) {
          setStats(data.stats)
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Could not load dashboard')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return <div className="max-w-6xl mx-auto p-6 text-center">Loading Dashboard...</div>
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">🏪 Vendor Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-600 text-sm font-medium">Total Products</h3>
          <p className="text-3xl font-bold text-teal-600 mt-2">
            {stats?.productCount ?? 0}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-600 text-sm font-medium">Total Sales</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">
            ৳{stats?.totalSales ?? 0}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-600 text-sm font-medium">Total Orders</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {stats?.totalOrders ?? 0}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/vendor/products/new"
            className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition text-center font-medium"
          >
            ➕ Add New Product
          </Link>
          
          <Link
            to="/vendor/products"
            className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition text-center font-medium"
          >
            📦 Manage Products
          </Link>
        </div>
      </div>
    </div>
  )
}