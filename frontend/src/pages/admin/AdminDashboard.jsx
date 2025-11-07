import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../../api/axios'
import { toast } from 'react-hot-toast'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('applications') // 'applications' or 'addProduct'
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Add Product Form State
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: 'Electronics',
    imageUrl: ''
  })

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (user?.role !== 'admin') {
      toast.error('Access denied. Admins only.')
      navigate('/')
      return
    }
    fetchApplications()
  }, [navigate])

  const fetchApplications = async () => {
    try {
      const { data } = await axios.get('/admin/vendor-applications')
      setApplications(data.applications || [])
    } catch (err) {
      console.error('Error fetching applications:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id) => {
    try {
      await axios.post(`/admin/vendor-applications/${id}/approve`)
      toast.success('Application approved!')
      fetchApplications()
    } catch (err) {
      toast.error('Failed to approve application')
    }
  }

  const handleReject = async (id) => {
    try {
      await axios.post(`/admin/vendor-applications/${id}/reject`)
      toast.success('Application rejected')
      fetchApplications()
    } catch (err) {
      toast.error('Failed to reject application')
    }
  }

  const handleProductChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleProductSubmit = async e => {
    e.preventDefault()
    try {
      await axios.post('/product/new', {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        images: [{ public_id: 'admin', url: form.imageUrl }]
      })
      toast.success('Product added successfully!')
      setForm({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: 'Electronics',
        imageUrl: ''
      })
    } catch (err) {
      toast.error('Failed to add product')
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">⚙️ Admin Dashboard</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b">
        <button
          onClick={() => setActiveTab('applications')}
          className={`pb-2 px-4 font-medium ${
            activeTab === 'applications'
              ? 'border-b-2 border-teal-600 text-teal-600'
              : 'text-gray-600'
          }`}
        >
          Pending Applications
        </button>
        <button
          onClick={() => setActiveTab('addProduct')}
          className={`pb-2 px-4 font-medium ${
            activeTab === 'addProduct'
              ? 'border-b-2 border-teal-600 text-teal-600'
              : 'text-gray-600'
          }`}
        >
          Add Product
        </button>
      </div>

      {/* Pending Applications Tab */}
      {activeTab === 'applications' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Vendor Applications</h2>
          {loading ? (
            <p>Loading...</p>
          ) : applications.length === 0 ? (
            <p className="text-gray-600">No pending applications.</p>
          ) : (
            <div className="space-y-4">
              {applications.map(app => (
                <div key={app._id} className="bg-white p-4 rounded-lg shadow border">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">{app.user?.name}</h3>
                      <p className="text-gray-600">{app.user?.email}</p>
                      <p className="text-sm text-gray-500 mt-2">{app.businessDescription}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(app._id)}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                      >
                        ✓ Approve
                      </button>
                      <button
                        onClick={() => handleReject(app._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      >
                        ✗ Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add Product Tab */}
      {activeTab === 'addProduct' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
          <form onSubmit={handleProductSubmit} className="bg-white p-6 rounded-lg shadow space-y-4 max-w-2xl">
            <input
              name="name"
              type="text"
              className="w-full p-3 border rounded-lg"
              placeholder="Product name"
              value={form.name}
              onChange={handleProductChange}
              required
            />
            <textarea
              name="description"
              className="w-full p-3 border rounded-lg"
              placeholder="Description"
              rows="4"
              value={form.description}
              onChange={handleProductChange}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                name="price"
                type="number"
                className="w-full p-3 border rounded-lg"
                placeholder="Price"
                value={form.price}
                onChange={handleProductChange}
                required
              />
              <input
                name="stock"
                type="number"
                className="w-full p-3 border rounded-lg"
                placeholder="Stock"
                value={form.stock}
                onChange={handleProductChange}
                required
              />
            </div>
            <select
              name="category"
              className="w-full p-3 border rounded-lg"
              value={form.category}
              onChange={handleProductChange}
            >
              <option>Electronics</option>
              <option>Clothing</option>
              <option>Food</option>
              <option>Books</option>
              <option>Home & Garden</option>
            </select>
            <input
              name="imageUrl"
              type="url"
              className="w-full p-3 border rounded-lg"
              placeholder="Image URL"
              value={form.imageUrl}
              onChange={handleProductChange}
              required
            />
            <button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Add Product
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
