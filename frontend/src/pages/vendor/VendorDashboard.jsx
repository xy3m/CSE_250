import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function VendorDashboard() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">🏪 Vendor Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-600 text-sm font-medium">Total Products</h3>
          <p className="text-3xl font-bold text-teal-600 mt-2">0</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-600 text-sm font-medium">Active Products</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">0</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-600 text-sm font-medium">Out of Stock</h3>
          <p className="text-3xl font-bold text-red-600 mt-2">0</p>
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
