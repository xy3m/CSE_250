import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useDispatch } from 'react-redux' 
import { loginUser, demoLoginUser } from '../redux/slices/authSlice' 
import { motion } from 'framer-motion'
import { FaShieldAlt, FaStore, FaUserCheck, FaBolt, FaArrowRight, FaLock, FaEnvelope } from 'react-icons/fa'
import GlassCard from '../components/ui/GlassCard'
import GlowButton from '../components/ui/GlowButton'
import PageTransition from '../components/ui/PageTransition'

export default function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch() 
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [demoLoadingRole, setDemoLoadingRole] = useState(null)

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleRoleRedirect = (role) => {
    if (role === 'admin') {
      navigate('/admin/dashboard')
    } else if (role === 'vendor') {
      navigate('/vendor/dashboard')
    } else {
      navigate('/dashboard')
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      const resultAction = await dispatch(loginUser(form))
      
      if (loginUser.rejected.match(resultAction)) {
        throw new Error(resultAction.payload || 'Login failed')
      }

      const user = resultAction.payload.user
      toast.success(`Welcome back, ${user.name}!`)
      handleRoleRedirect(user.role)
    } catch (err) {
      toast.error(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = async (role) => {
    setDemoLoadingRole(role)
    try {
      const resultAction = await dispatch(demoLoginUser({ role }))
      
      if (demoLoginUser.rejected.match(resultAction)) {
        throw new Error(resultAction.payload || `Demo login as ${role} failed`)
      }

      const user = resultAction.payload.user
      toast.success(`Logged in as Demo ${role.toUpperCase()}!`)
      handleRoleRedirect(user.role)
    } catch (err) {
      toast.error(err.message || 'Demo login failed')
    } finally {
      setDemoLoadingRole(null)
    }
  }

  const demoRoles = [
    {
      role: 'admin',
      title: 'Admin Console',
      desc: 'Platform metrics, order overview, user management & vendor approvals',
      icon: FaShieldAlt,
      color: 'from-purple-500/20 to-indigo-500/20 border-purple-500/30 text-purple-400',
      badge: 'Super Admin'
    },
    {
      role: 'vendor',
      title: 'Vendor Store',
      desc: 'Manage inventory, add products, view sales analytics & fulfill orders',
      icon: FaStore,
      color: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-400',
      badge: 'Merchant'
    },
    {
      role: 'customer',
      title: 'Customer Experience',
      desc: 'Browse catalog, real-time cart, checkout & track order status',
      icon: FaUserCheck,
      color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400',
      badge: 'Shopper'
    }
  ]

  return (
    <PageTransition>
      <div className="min-h-screen pt-28 pb-16 px-4 sm:px-6 bg-black flex flex-col items-center justify-center relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-4xl mx-auto space-y-8 relative z-10">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-gray-300">
              <FaBolt className="text-amber-400" /> Instant Portfolio Demo Access
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Sign In to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">HaatBazar</span>
            </h1>
            <p className="text-gray-400 text-sm max-w-md mx-auto">
              Test any user role with 1-click instant login or sign in with your credentials.
            </p>
          </div>

          {/* 1-Click Demo Showcase Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {demoRoles.map((item) => {
              const Icon = item.icon
              const isCurrentLoading = demoLoadingRole === item.role
              return (
                <motion.div
                  key={item.role}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  className="h-full"
                >
                  <GlassCard className={`p-5 h-full flex flex-col justify-between !rounded-2xl border bg-gradient-to-b ${item.color} relative overflow-hidden`}>
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
                          <Icon size={20} />
                        </div>
                        <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 border border-white/10 text-gray-200">
                          {item.badge}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white mb-1">{item.title}</h3>
                      <p className="text-xs text-gray-400 leading-relaxed mb-4">{item.desc}</p>
                    </div>

                    <button
                      onClick={() => handleDemoLogin(item.role)}
                      disabled={demoLoadingRole !== null || loading}
                      className="w-full py-2.5 px-3 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-gray-200 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                    >
                      {isCurrentLoading ? (
                        <div className="animate-spin rounded-full h-3.5 w-3.5 border-t-2 border-b-2 border-black"></div>
                      ) : (
                        <>
                          <span>1-Click Test</span>
                          <FaArrowRight size={10} />
                        </>
                      )}
                    </button>
                  </GlassCard>
                </motion.div>
              )
            })}
          </div>

          {/* Standard Form Box */}
          <div className="max-w-md mx-auto w-full">
            <GlassCard className="p-8 !rounded-3xl shadow-2xl bg-[#1C1C1E]/80 border-white/10">
              <div className="flex items-center gap-2 mb-6">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Or Manual Login</span>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-400">Email Address</label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                    <input
                      name="email"
                      type="email"
                      className="w-full pl-10 pr-4 py-3 bg-black/60 border border-white/10 rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-blue-500 transition-all"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-400">Password</label>
                  <div className="relative">
                    <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                    <input
                      name="password"
                      type="password"
                      className="w-full pl-10 pr-4 py-3 bg-black/60 border border-white/10 rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-blue-500 transition-all"
                      placeholder="••••••••"
                      value={form.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <GlowButton
                  type="submit"
                  className="w-full !py-3.5 mt-2 rounded-xl text-sm"
                  variant="primary"
                  disabled={loading || demoLoadingRole !== null}
                >
                  {loading ? 'Authenticating...' : 'Sign In'}
                </GlowButton>
              </form>

              <p className="mt-6 text-center text-xs text-gray-400">
                Don't have an account?{' '}
                <Link to="/register" className="text-blue-400 font-semibold hover:underline">
                  Create Account
                </Link>
              </p>
            </GlassCard>
          </div>

        </div>
      </div>
    </PageTransition>
  )
}