import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux' 
import { toast } from 'react-hot-toast'
import { logoutUser } from '../redux/slices/authSlice' 

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const { cartItems } = useSelector((state) => state.cart)

  // Crash prevention check
  const safeUser = user || {}; 

  const handleLogout = async () => {
    await dispatch(logoutUser()) 
    toast.success('Logged out successfully')
    navigate('/')
  }

  if (!isAuthenticated && location.pathname === '/') return null

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          
          {/* Logo Link Logic: Admin goes to Admin Dashboard, others go to Shop */}
          <Link 
            to={isAuthenticated ? (safeUser.role === 'admin' ? '/admin/dashboard' : '/dashboard') : '/'} 
            className="text-2xl font-bold text-teal-600"
          >
            🛒 HaatBazar
          </Link>

          <div className="flex gap-6 items-center">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="hover:text-teal-600">Login</Link>
                <Link to="/register" className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700">
                  Register
                </Link>
              </>
            ) : (
              <>
                {/* === HIDE SHOPPING LINKS FOR ADMINS === */}
                {safeUser.role !== 'admin' && (
                  <>
                    <Link to="/dashboard" className="hover:text-teal-600 font-medium">
                      Shop
                    </Link>

                    <Link to="/cart" className="relative hover:text-teal-600 font-medium">
                      🛒 Cart
                      {cartItems.length > 0 && (
                        <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                        </span>
                      )}
                    </Link>

                    <Link to="/orders/me" className="hover:text-teal-600 font-medium">
                      History
                    </Link>
                  </>
                )}

                {/* === VENDOR LINKS === */}
                {safeUser.role === 'vendor' && (
                  <>
                    <Link to="/vendor/orders" className="hover:text-teal-600 font-medium">
                      Received Orders
                    </Link>
                    <Link to="/vendor/dashboard" className="hover:text-teal-600 font-medium">
                      My Store
                    </Link>
                  </>
                )}

                {/* === ADMIN LINKS === */}
                {safeUser.role === 'admin' && (
                  <Link to="/admin/dashboard" className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
                    Admin Dashboard
                  </Link>
                )}

                {/* === USER LINKS (Apply Logic) === */}
                {safeUser.role === 'user' && (
                  <>
                    {(!safeUser.vendorInfo || !safeUser.vendorInfo.applicationDate) && (
                      <Link to="/vendor/apply" className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 font-medium">
                        Apply as Vendor
                      </Link>
                    )}
                    {safeUser.vendorInfo?.applicationDate && safeUser.vendorInfo.status === 'pending' && (
                      <span className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg font-medium border border-yellow-200 cursor-default">
                        ⏳ Application Pending
                      </span>
                    )}
                    {safeUser.vendorInfo?.status === 'rejected' && (
                      <Link to="/vendor/apply" className="bg-red-100 text-red-700 px-4 py-2 rounded-lg font-medium border border-red-200 hover:bg-red-200">
                        ❌ Rejected (Apply Again)
                      </Link>
                    )}
                  </>
                )}

                {/* === PROFILE LINK (Hide for Admins) === */}
                {safeUser.role !== 'admin' && (
                  <Link to="/profile" className="text-gray-600 hidden md:block hover:text-teal-600 font-medium">
                    👤 {safeUser.name}
                  </Link>
                )}

                {/* Optional: Show just the name for Admins without a link */}
                {safeUser.role === 'admin' && (
                  <span className="text-gray-600 hidden md:block font-medium">
                    🛡️ {safeUser.name}
                  </span>
                )}
                
                <button 
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}