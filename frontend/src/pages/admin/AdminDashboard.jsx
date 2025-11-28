import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from '../../api/axios'
import { toast } from 'react-hot-toast'
import { useSelector } from 'react-redux'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('applications')
  
  // State for Applications
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  
  // State for Products
  const [allProducts, setAllProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(false)
  
  // State for Users
  const [users, setUsers] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(true)

  const { user } = useSelector(state => state.auth)

  // --- 1. Fetch Users ---
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const { data } = await axios.get('/admin/users'); 
      setUsers(data.users || []);
    } catch (err) {
      toast.error('Failed to fetch users');
    } finally {
      setLoadingUsers(false);
    }
  };

  // --- 2. Fetch Pending Applications ---
  const fetchApplications = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/admin/vendor/applications')
      setApplications(data.applications || [])
    } catch (err) {
      console.error('Error fetching applications:', err)
    } finally {
      setLoading(false)
    }
  }

  // --- 3. Fetch All Products ---
  const fetchAllProducts = async () => {
    setLoadingProducts(true)
    try {
      const { data } = await axios.get('/products')
      if (data.success) {
        setAllProducts(data.products)
      }
    } catch (err) {
      toast.error('Could not fetch products')
    } finally {
      setLoadingProducts(false)
    }
  }

  // Load Data on Mount
  useEffect(() => {
    if (user?.role !== 'admin') {
      toast.error('Access denied. Admins only.')
      navigate('/')
      return
    }
    fetchApplications()
    fetchAllProducts()
    fetchUsers() 
  }, [navigate, user])

  // --- Handlers ---

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user? This is permanent.')) {
      try {
        await axios.delete(`/admin/user/${id}`);
        toast.success('User deleted successfully');
        fetchUsers(); 
      } catch (err) {
        toast.error('Failed to delete user');
      }
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.put(`/admin/vendor/${id}`, { approved: true }) 
      toast.success('Application approved!')
      fetchApplications()
    } catch (err) {
      toast.error('Failed to approve application')
    }
  }

  const handleReject = async (id) => {
    try {
      await axios.put(`/admin/vendor/${id}`, { approved: false }) 
      toast.success('Application rejected')
      fetchApplications()
    } catch (err) {
      toast.error('Failed to reject application')
    }
  }

  const handleProductDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return
    }
    try {
      await axios.delete(`/products/${id}`)
      toast.success('Product deleted')
      fetchAllProducts()
    } catch (err) {
      toast.error('Failed to delete product')
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">⚙️ Admin Dashboard</h1>

      {/* Tabs Menu */}
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
          onClick={() => setActiveTab('manageProducts')}
          className={`pb-2 px-4 font-medium ${
            activeTab === 'manageProducts'
              ? 'border-b-2 border-teal-600 text-teal-600'
              : 'text-gray-600'
          }`}
        >
          Manage All Products
        </button>
        
        <button
          onClick={() => setActiveTab('manageUsers')}
          className={`pb-2 px-4 font-medium ${
            activeTab === 'manageUsers'
              ? 'border-b-2 border-teal-600 text-teal-600'
              : 'text-gray-600'
          }`}
        >
          Manage Users
        </button>
      </div>

      {/* === TAB 1: PENDING APPLICATIONS === */}
      {activeTab === 'applications' && (
        <div>
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
                      <h3 className="font-bold text-lg">{app.name} ({app.email})</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 mt-4 text-sm">
                        <div>
                          <strong className="text-gray-600">Business Name:</strong>
                          <p>{app.vendorInfo.businessName}</p>
                        </div>
                        <div>
                          <strong className="text-gray-600">Business Type:</strong>
                          <p>{app.vendorInfo.businessType}</p>
                        </div>
                        <div>
                          <strong className="text-gray-600">Phone:</strong>
                          <p>{app.vendorInfo.phoneNumber}</p>
                        </div>
                        <div>
                          <strong className="text-gray-600">Tax ID:</strong>
                          <p>{app.vendorInfo.taxId}</p>
                        </div>
                        <div className="col-span-2">
                          <strong className="text-gray-600">Address:</strong>
                          <p>{app.vendorInfo.businessAddress}</p>
                        </div>
                        <div className="col-span-2">
                          <strong className="text-gray-600">Description:</strong>
                          <p>{app.vendorInfo.description}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleApprove(app._id)}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
                      >
                        ✓ Approve
                      </button>
                      <button
                        onClick={() => handleReject(app._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full"
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

      {/* === TAB 2: MANAGE PRODUCTS === */}
      {activeTab === 'manageProducts' && (
        <div>
          {loadingProducts ? (
            <p>Loading products...</p>
          ) : allProducts.length === 0 ? (
            <p className="text-gray-600">No products found.</p>
          ) : (
            <div className="space-y-4">
              {allProducts.map(product => (
                <div key={product._id} className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img 
                      src={product.images?.[0]?.url || 'https://via.placeholder.com/100'} 
                      alt={product.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div>
                      <h2 className="text-xl font-semibold">{product.name}</h2>
                      <p className="text-gray-600">
                        Vendor: {product.vendor?.name || 'Unknown'} • Stock: {product.stock} • Price: ৳{product.price}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Link
                      to={`/admin/products/edit/${product._id}`}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 font-medium"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleProductDelete(product._id)}
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
      )}

      {/* === TAB 3: MANAGE USERS === */}
      {activeTab === 'manageUsers' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Manage All Users</h2>
          {loadingUsers ? (
            <p>Loading users...</p>
          ) : (
            <div className="space-y-4">
              {users.map(u => (
                <div key={u._id} className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <h3 className="font-semibold">{u.name}</h3>
                      <p className="text-sm text-gray-600">{u.email}</p>
                      <span className="text-xs font-medium bg-gray-200 text-gray-800 px-2 py-0.5 rounded-full capitalize">
                        {u.role}
                      </span>
                    </div>
                  </div>
                  {user._id !== u._id && (
                    <button
                      onClick={() => handleDeleteUser(u._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 font-medium"
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  )
}