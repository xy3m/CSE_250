import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-hot-toast'
import { logoutUser } from '../redux/slices/authSlice'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const { cartItems } = useSelector((state) => state.cart || {})

  // Crash prevention check
  const safeUser = user || {};

  const handleLogout = async () => {
    await dispatch(logoutUser())
    toast.success('Logged out successfully')
    navigate('/')
  }

  // Animation variants
  const navItemVariants = {
    hover: { scale: 1.05, transition: { type: "spring", stiffness: 400, damping: 10 } },
    tap: { scale: 0.95 }
  }

  if (!isAuthenticated && location.pathname === '/') return null

  return (
    <nav className="bg-slate-900/90 backdrop-blur-md border-b border-white/10 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo with gradient text */}
          <Link
            to={isAuthenticated ? (safeUser.role === 'admin' ? '/admin/dashboard' : '/dashboard') : '/'}
            className="flex items-center gap-2 group"
          >
            <motion.span
              initial={{ rotate: 0 }}
              whileHover={{ rotate: 10 }}
              className="text-3xl"
            >
              🛒
            </motion.span>
            <span className="text-3xl font-extrabold bg-gradient-to-r from-teal-400 to-yellow-400 bg-clip-text text-transparent tracking-tight group-hover:from-yellow-400 group-hover:to-teal-400 transition-all duration-500">
              HaatBazar
            </span>
          </Link>

          <div className="flex gap-6 items-center">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="text-slate-300 hover:text-white font-medium transition-colors px-4 py-2 rounded-full hover:bg-white/10">Login</Link>
                <Link to="/register">
                  <motion.button
                    whileHover="hover"
                    whileTap="tap"
                    variants={navItemVariants}
                    className="bg-yellow-400 text-slate-900 px-6 py-2.5 rounded-full font-bold shadow-[0_0_15px_rgba(250,204,21,0.4)] hover:shadow-[0_0_25px_rgba(250,204,21,0.6)] transition-all"
                  >
                    Get Started
                  </motion.button>
                </Link>
              </>
            ) : (
              <>
                {/* Navigation Links with Yellow Hover Pills */}
                {safeUser.role !== 'admin' && (
                  <div className="hidden md:flex gap-2">
                    {[
                      { to: "/dashboard", label: "Shop" },
                      { to: "/cart", label: "Cart", badge: cartItems?.reduce((acc, item) => acc + item.quantity, 0) || 0 },
                      { to: "/orders/me", label: "My Orders" }
                    ].map((link) => (
                      <Link key={link.to} to={link.to} className="relative">
                        <motion.div
                          whileHover="hover"
                          whileTap="tap"
                          variants={navItemVariants}
                          className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-300 relative group overflow-hidden ${location.pathname === link.to
                              ? 'bg-yellow-400 text-slate-900 shadow-[0_0_15px_rgba(250,204,21,0.3)]'
                              : 'text-slate-300 hover:text-slate-900 bg-transparent hover:bg-yellow-400'
                            }`}
                        >
                          <span className="relative z-10">{link.label}</span>
                          {link.badge > 0 && (
                            <span className="ml-2 bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full shadow-sm">
                              {link.badge}
                            </span>
                          )}
                        </motion.div>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Vendor Links */}
                {safeUser.role === 'vendor' && (
                  <div className="hidden md:flex gap-2">
                    <Link to="/vendor/orders">
                      <motion.div variants={navItemVariants} whileHover="hover" whileTap="tap" className="px-5 py-2.5 rounded-full font-bold text-sm text-slate-300 hover:bg-yellow-400 hover:text-slate-900 transition-all">
                        Received Orders
                      </motion.div>
                    </Link>
                    <Link to="/vendor/dashboard">
                      <motion.div variants={navItemVariants} whileHover="hover" whileTap="tap" className="px-5 py-2.5 rounded-full font-bold text-sm text-slate-300 hover:bg-yellow-400 hover:text-slate-900 transition-all">
                        My Store
                      </motion.div>
                    </Link>
                  </div>
                )}

                {/* Admin Link */}
                {safeUser.role === 'admin' && (
                  <Link to="/admin/dashboard" className="text-orange-400 font-bold hover:text-orange-300 px-4 py-2 border border-orange-400/30 rounded-full hover:bg-orange-500/10 transition-all">
                    Admin Panel
                  </Link>
                )}

                <div className="h-8 w-px bg-slate-700 mx-2"></div>

                {/* User Profile & Logout */}
                <div className="flex items-center gap-4">
                  {safeUser.role === 'user' && (
                    <>
                      {(!safeUser.vendorInfo || !safeUser.vendorInfo.applicationDate) && (
                        <Link to="/vendor/apply" className="text-sm font-bold text-teal-400 hover:text-teal-300 hover:bg-teal-400/10 px-4 py-2 rounded-full transition-all border border-teal-500/30">
                          Become a Vendor
                        </Link>
                      )}
                    </>
                  )}

                  {safeUser.role !== 'admin' && (
                    <Link to="/profile" className="flex items-center gap-3 group">
                      <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-yellow-400 group-hover:border-yellow-400 transition-all shadow-lg">
                        {safeUser.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="hidden md:flex flex-col">
                        <span className="text-sm font-bold text-slate-200 group-hover:text-yellow-400 transition-colors">{safeUser.name}</span>
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider">{safeUser.role}</span>
                      </div>
                    </Link>
                  )}

                  {safeUser.role === 'admin' && (
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🛡️</span>
                      <span className="text-slate-300 hidden md:block font-medium">{safeUser.name}</span>
                    </div>
                  )}

                  <button
                    onClick={handleLogout}
                    className="text-sm font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 px-4 py-2 rounded-full transition-all"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}