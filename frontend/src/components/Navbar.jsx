import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-hot-toast'
import { logoutUser } from '../redux/slices/authSlice'
import { motion, AnimatePresence } from 'framer-motion'
import { FaStore, FaSignOutAlt, FaHome, FaShoppingBag, FaBox, FaUser } from 'react-icons/fa'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const { cartItems } = useSelector((state) => state.cart || {})

  // Crash prevention check
  const safeUser = user || {};

  const handleLogout = async () => {
    navigate('/')
    await dispatch(logoutUser())
    toast.success('Logged out successfully')
  }

  // Animation variants
  const navItemVariants = {
    hover: { scale: 1.05, transition: { type: "spring", stiffness: 400, damping: 10 } },
    tap: { scale: 0.95 }
  }

  if (!isAuthenticated && location.pathname === '/') return null

  return (
    <nav className="fixed top-0 w-full z-50 transition-all duration-300">
      {/* Frosted Glass Container */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-xl border-b border-white/10" />

      <div className="relative max-w-[1400px] mx-auto px-6 h-16 grid grid-cols-3 items-center">

        {/* Left Side: Navigation Links */}
        <div className="flex items-center justify-start">
          <div className="hidden md:flex items-center gap-6">
            {!isAuthenticated ? (
              <>
                {['Features', 'Marketplace', 'Vendors'].map((item) => (
                  <a key={item} href="#" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                    {item}
                  </a>
                ))}
              </>
            ) : (
              <>
                {safeUser.role !== 'admin' && (
                  <>
                    <Link to="/dashboard" className={`text-sm font-medium transition-colors ${location.pathname === '/dashboard' ? 'text-white' : 'text-gray-400 hover:text-white'}`}>Store</Link>
                    <Link to="/cart" className={`text-sm font-medium transition-colors ${location.pathname === '/cart' ? 'text-white' : 'text-gray-400 hover:text-white'}`}>
                      Bag {cartItems?.length > 0 && <span className="ml-1 text-xs bg-white text-black px-1.5 rounded-full">{cartItems.length}</span>}
                    </Link>
                    <Link to="/orders/me" className={`text-sm font-medium transition-colors ${location.pathname === '/orders/me' ? 'text-white' : 'text-gray-400 hover:text-white'}`}>Orders</Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* Center: Logo */}
        <div className="flex justify-center z-10">
          <Link
            to={isAuthenticated ? (safeUser.role === 'admin' ? '/admin/dashboard' : '/dashboard') : '/'}
            className="flex items-center gap-2 group"
          >
            <span className="text-2xl font-bold tracking-tight text-white group-hover:text-gray-300 transition-colors">
              HaatBazar<span className="text-gray-500">.</span>
            </span>
          </Link>
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center justify-end gap-6">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="text-sm font-medium text-white hover:text-gray-300 transition-colors">Log In</Link>
              <Link to="/register" className="btn-pro-primary !py-1.5 !px-4 !text-sm">
                Get Started
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-4">
              {safeUser.role !== 'vendor' && safeUser.role !== 'admin' && (
                <>
                  {(!safeUser.vendorInfo?.status) && (
                    <Link to="/vendor/apply" className="hidden sm:block text-xs font-bold uppercase tracking-widest text-teal-400 hover:text-teal-300">
                      Become a Vendor
                    </Link>
                  )}
                  {safeUser.vendorInfo?.status === 'pending' && (
                    <span className="hidden sm:block text-xs font-bold uppercase tracking-widest text-yellow-400/80 cursor-default">
                      Application Pending
                    </span>
                  )}
                  {safeUser.vendorInfo?.status === 'rejected' && (
                    <Link to="/vendor/apply" className="hidden sm:block text-xs font-bold uppercase tracking-widest text-red-400 hover:text-red-300">
                      Rejected (Apply Again)
                    </Link>
                  )}
                </>
              )}
              {safeUser.role !== 'vendor' && safeUser.role !== 'admin' && <div className="hidden sm:block h-4 w-px bg-white/20" />}

              {safeUser.role === 'vendor' && (
                <Link to="/vendor/dashboard" className="hidden sm:block text-xs font-bold uppercase tracking-widest text-blue-400 hover:text-blue-300">
                  Vendor Console
                </Link>
              )}

              {safeUser.role === 'vendor' && <div className="h-4 w-px bg-white/20" />}

              <div className="flex items-center gap-3">
                <Link to="/profile" className="flex items-center gap-2 text-sm text-gray-300 font-medium hover:text-white transition-colors">
                  <span className="hidden sm:block">{safeUser.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-xs font-medium text-gray-500 hover:text-white transition-colors border border-white/10 px-3 py-1 rounded-full hover:bg-white/10 flex items-center gap-2"
                >
                  <FaSignOutAlt className="sm:hidden" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      {isAuthenticated && safeUser.role !== 'admin' && (
        <div className="md:hidden fixed bottom-0 left-0 w-full bg-[#151516]/90 backdrop-blur-xl border-t border-white/10 flex justify-around items-center py-3 z-50 pb-safe">
          <Link to="/dashboard" className={`flex flex-col items-center gap-1 ${location.pathname === '/dashboard' ? 'text-white' : 'text-gray-500'}`}>
            <FaHome size={20} />
            <span className="text-[10px] font-medium">Store</span>
          </Link>
          <Link to="/cart" className={`relative flex flex-col items-center gap-1 ${location.pathname === '/cart' ? 'text-white' : 'text-gray-500'}`}>
            <div className="relative">
              <FaShoppingBag size={20} />
              {cartItems?.length > 0 && (
                <span className="absolute -top-1 -right-2 bg-blue-500 text-white text-[9px] font-bold px-1 rounded-full">{cartItems.length}</span>
              )}
            </div>
            <span className="text-[10px] font-medium">Bag</span>
          </Link>
          <Link to="/orders/me" className={`flex flex-col items-center gap-1 ${location.pathname === '/orders/me' ? 'text-white' : 'text-gray-500'}`}>
            <FaBox size={20} />
            <span className="text-[10px] font-medium">Orders</span>
          </Link>
          <Link to="/profile" className={`flex flex-col items-center gap-1 ${location.pathname === '/profile' ? 'text-white' : 'text-gray-500'}`}>
            <FaUser size={20} />
            <span className="text-[10px] font-medium">Profile</span>
          </Link>
        </div>
      )}
    </nav>
  )
}