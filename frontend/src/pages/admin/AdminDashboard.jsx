import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from '../../api/axios'
import { toast } from 'react-hot-toast'
import { useSelector } from 'react-redux'
import GlassCard from '../../components/ui/GlassCard'
import GlowButton from '../../components/ui/GlowButton'
import { FaUserTimes, FaTrashAlt, FaCheck, FaTimes, FaEdit, FaBoxOpen, FaUsers } from 'react-icons/fa'

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
    // 1. If user is null (Logged out), just go home silently.
    if (!user) {
      navigate('/');
      return;
    }

    // 2. If user exists but is NOT an admin, THEN show the error.
    if (user.role !== 'admin') {
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

  // Prevent crash if user is null (during logout)
  if (!user) return null

  return (
    <div className="min-h-screen pt-32 px-6 bg-black pb-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">⚙️ Admin Dashboard</h1>
        </div>

        {/* Tabs Menu */}
        <div className="mb-8">
          <GlassCard className="p-2 !bg-[#1C1C1E] !border-white/10 rounded-2xl flex flex-col md:flex-row gap-2">
            <button
              onClick={() => setActiveTab('applications')}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all text-center ${activeTab === 'applications'
                ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
            >
              Pending Applications
            </button>

            <button
              onClick={() => setActiveTab('manageProducts')}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all text-center ${activeTab === 'manageProducts'
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
            >
              Manage All Products
            </button>

            <button
              onClick={() => setActiveTab('manageUsers')}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all text-center ${activeTab === 'manageUsers'
                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
            >
              Manage Users
            </button>
          </GlassCard>
        </div>

        {/* === TAB 1: PENDING APPLICATIONS === */}
        {activeTab === 'applications' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white mb-4">Pending Vendor Applications</h2>
            {loading ? (
              <div className="text-gray-500 text-center py-10">Loading applications...</div>
            ) : applications.length === 0 ? (
              <GlassCard className="text-center py-12 bg-[#1C1C1E] border-white/10">
                <p className="text-gray-500 text-lg">No pending applications.</p>
              </GlassCard>
            ) : (
              <div className="space-y-4">
                {applications.map(app => (
                  <GlassCard key={app._id} className="p-6 bg-[#1C1C1E] border-white/10 shadow-xl">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-4">
                          <h3 className="font-bold text-xl text-white">{app.name}</h3>
                          <span className="text-gray-500 text-sm">({app.email})</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm bg-black/40 p-4 rounded-xl border border-white/5">
                          <div>
                            <strong className="block text-gray-500 text-xs uppercase tracking-wider mb-1">Business Name</strong>
                            <p className="text-gray-200 font-semibold">{app.vendorInfo.businessName}</p>
                          </div>
                          <div>
                            <strong className="block text-gray-500 text-xs uppercase tracking-wider mb-1">Business Type</strong>
                            <p className="text-gray-200 font-semibold">{app.vendorInfo.businessType}</p>
                          </div>
                          <div>
                            <strong className="block text-gray-500 text-xs uppercase tracking-wider mb-1">Phone</strong>
                            <p className="text-gray-200 font-semibold">{app.vendorInfo.phoneNumber}</p>
                          </div>

                          {/* === TAX ID SECTION === */}
                          <div>
                            <strong className="block text-gray-500 text-xs uppercase tracking-wider mb-1">BIN (Tax ID)</strong>
                            <p className="flex items-center gap-2 text-gray-200 font-semibold">
                              {app.vendorInfo.taxId}

                              {app.vendorInfo.taxIdVerified ? (
                                <span className="bg-emerald-500/10 text-emerald-400 text-xs px-2 py-0.5 rounded-full border border-emerald-500/20 font-bold flex items-center gap-1">
                                  <FaCheck size={10} /> Verified
                                </span>
                              ) : (
                                <span className="bg-rose-500/10 text-rose-400 text-xs px-2 py-0.5 rounded-full border border-rose-500/20 font-bold flex items-center gap-1">
                                  <FaTimes size={10} /> Unverified
                                </span>
                              )}
                            </p>
                          </div>
                          {/* ====================== */}

                          <div className="col-span-1 md:col-span-2">
                            <strong className="block text-gray-500 text-xs uppercase tracking-wider mb-1">Address</strong>
                            <p className="text-gray-300">{app.vendorInfo.businessAddress}</p>
                          </div>
                          <div className="col-span-1 md:col-span-2">
                            <strong className="block text-gray-500 text-xs uppercase tracking-wider mb-1">Description</strong>
                            <p className="text-gray-300">{app.vendorInfo.description}</p>
                          </div>
                        </div>
                      </div>

                      {/* === ACTION BUTTONS === */}
                      <div className="flex flex-col gap-3 w-full md:w-48 flex-shrink-0">

                        {/* APPROVE BUTTON */}
                        <GlowButton
                          onClick={() => handleApprove(app._id)}
                          disabled={!app.vendorInfo.taxIdVerified}
                          title={!app.vendorInfo.taxIdVerified ? "Cannot approve unverified Tax ID" : "Approve Application"}
                          className={`w-full justify-center ${app.vendorInfo.taxIdVerified
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                            : 'bg-gray-800 text-gray-500 cursor-not-allowed shadow-none border border-white/5'
                            }`}
                        >
                          <FaCheck className="mr-2" /> Approve
                        </GlowButton>

                        <button
                          onClick={() => handleReject(app._id)}
                          className="flex items-center justify-center bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-2.5 rounded-xl hover:bg-rose-500/20 w-full font-bold transition-all"
                        >
                          <FaTimes className="mr-2" /> Reject
                        </button>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}
          </div>
        )}

        {/* === TAB 2: MANAGE PRODUCTS === */}
        {activeTab === 'manageProducts' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white mb-4">Manage All Products</h2>
            {loadingProducts ? (
              <div className="text-gray-500 text-center py-10">Loading products...</div>
            ) : allProducts.length === 0 ? (
              <GlassCard className="text-center py-12 bg-[#1C1C1E] border-white/10">
                <p className="text-gray-400 text-lg">No products found.</p>
              </GlassCard>
            ) : (
              <div className="space-y-4">
                {allProducts.map(product => (
                  <GlassCard key={product._id} className="p-4 bg-[#1C1C1E] border-white/10 shadow-lg hover:border-blue-500/30 transition-all group">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-white/10 flex-shrink-0 bg-black">
                          <img
                            src={product.images?.[0]?.url || 'https://via.placeholder.com/100'}
                            alt={product.name}
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                          />
                        </div>
                        <div>
                          <h2 className="text-lg font-bold text-white">{product.name}</h2>
                          <div className="text-sm text-gray-400 flex flex-wrap gap-x-3 gap-y-1 mt-1">
                            <span className="flex items-center gap-1"><FaUsers size={12} className="text-gray-500" /> {product.vendor?.name || 'Unknown'}</span>
                            <span className="text-gray-600">|</span>
                            <span className="flex items-center gap-1"><FaBoxOpen size={12} className="text-gray-500" /> Stock: <span className={product.stock > 0 ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>{product.stock}</span></span>
                            <span className="text-gray-600">|</span>
                            <span className="font-bold text-white">৳{product.price}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          to={`/admin/products/edit/${product._id}`}
                          className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors border border-blue-500/20"
                          title="Edit Product"
                        >
                          <FaEdit size={18} />
                        </Link>
                        <button
                          onClick={() => handleProductDelete(product._id)}
                          className="p-2 bg-rose-500/10 text-rose-400 rounded-lg hover:bg-rose-500/20 transition-colors border border-rose-500/20"
                          title="Delete Product"
                        >
                          <FaTrashAlt size={18} />
                        </button>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}
          </div>
        )}

        {/* === TAB 3: MANAGE USERS === */}
        {activeTab === 'manageUsers' && (
          <div>
            <h2 className="text-xl font-bold text-white mb-6">Manage All Users</h2>
            {loadingUsers ? (
              <div className="text-gray-500 text-center py-10">Loading users...</div>
            ) : (
              <div className="space-y-4">
                {users.map(u => (
                  <GlassCard key={u._id} className="p-4 bg-[#1C1C1E] border-white/10 shadow-lg">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold text-white border border-white/10 ${u.role === 'admin' ? 'bg-purple-500' : u.role === 'vendor' ? 'bg-teal-600' : 'bg-blue-600'
                          }`}>
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-bold text-white">{u.name}</h3>
                          <p className="text-sm text-gray-400">{u.email}</p>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mt-1 inline-block border ${u.role === 'admin' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : u.role === 'vendor' ? 'bg-teal-500/10 text-teal-400 border-teal-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                            }`}>
                            {u.role}
                          </span>
                        </div>
                      </div>
                      {user._id !== u._id && (
                        <button
                          onClick={() => handleDeleteUser(u._id)}
                          className="group flex items-center gap-2 bg-rose-500/10 text-rose-400 px-4 py-2 rounded-xl hover:bg-rose-500 hover:text-white transition-all border border-rose-500/20 hover:border-rose-500 font-bold text-sm"
                        >
                          <FaUserTimes /> Delete
                        </button>
                      )}
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}