import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import GlowButton from '../components/ui/GlowButton'
import { FaSignInAlt, FaUserPlus, FaShieldAlt, FaStore, FaUserCheck, FaBolt, FaArrowRight } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { demoLoginUser } from '../redux/slices/authSlice'
import AuthModal from '../components/auth/AuthModal'

export default function Home() {
  const dispatch = useDispatch()
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const [authOpen, setAuthOpen] = useState(false)
  const [initialMode, setInitialMode] = useState('login')
  const [demoLoadingRole, setDemoLoadingRole] = useState(null)
  const navigate = useNavigate()

  const openAuth = (mode) => {
    setInitialMode(mode)
    setAuthOpen(true)
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

  const handleEnterStore = () => {
    if (isAuthenticated) {
      handleRoleRedirect(user?.role)
    } else {
      openAuth('login')
    }
  }

  const handleDemoLogin = async (role) => {
    setDemoLoadingRole(role)
    try {
      const resultAction = await dispatch(demoLoginUser({ role }))
      if (demoLoginUser.rejected.match(resultAction)) {
        throw new Error(resultAction.payload || `Demo login as ${role} failed`)
      }
      const loggedUser = resultAction.payload.user
      toast.success(`Welcome to HaatBazar (${role.toUpperCase()} mode)!`)
      handleRoleRedirect(loggedUser.role)
    } catch (err) {
      toast.error(err.message || 'Demo login failed')
    } finally {
      setDemoLoadingRole(null)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20 selection:text-white">

      {/* Hero Section: "The Pro Standard" */}
      <section className="relative min-h-screen flex flex-col justify-center items-center text-center overflow-hidden pt-24 pb-16">

        {/* Subtle Titanium Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl px-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-gray-200 mb-6 backdrop-blur-md">
            <FaBolt className="text-amber-400" /> Full-Stack Multi-Vendor E-Commerce Platform
          </div>

          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-4 bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
            HaatBazar.
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 font-medium max-w-2xl mx-auto mb-8 leading-relaxed">
            আপনার বাজার, আপনার হাতের মুঠোয়
          </p>

          {/* Primary CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <GlowButton onClick={handleEnterStore} variant="primary" className="px-8 py-3.5 text-base">
              {isAuthenticated ? 'Go to Dashboard' : 'Enter Store'}
            </GlowButton>
            <Link
              to="/login"
              className="text-base text-gray-300 hover:text-white transition-colors font-medium flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10"
            >
              Manual Sign In <FaArrowRight size={12} />
            </Link>
          </div>

          {/* ⚡ 1-Click Instant Demo Showcase Bar */}
          <div className="mt-4 p-5 sm:p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl max-w-3xl mx-auto shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                <FaBolt className="text-yellow-400" /> Instant 1-Click Demo Login
              </div>
              <span className="text-[11px] text-gray-500">No registration required</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Admin Button */}
              <button
                onClick={() => handleDemoLogin('admin')}
                disabled={demoLoadingRole !== null}
                className="flex items-center justify-between sm:justify-center gap-3 p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/30 hover:bg-purple-500/20 hover:border-purple-500/50 text-purple-300 font-semibold text-xs transition-all group disabled:opacity-50"
              >
                <div className="flex items-center gap-2.5">
                  <FaShieldAlt className="text-purple-400" size={14} />
                  <span>Super Admin</span>
                </div>
                {demoLoadingRole === 'admin' ? (
                  <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-purple-400"></div>
                ) : (
                  <span className="text-[10px] bg-purple-500/20 px-2 py-0.5 rounded text-purple-300 font-mono">1-Click</span>
                )}
              </button>

              {/* Vendor Button */}
              <button
                onClick={() => handleDemoLogin('vendor')}
                disabled={demoLoadingRole !== null}
                className="flex items-center justify-between sm:justify-center gap-3 p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20 hover:border-blue-500/50 text-blue-300 font-semibold text-xs transition-all group disabled:opacity-50"
              >
                <div className="flex items-center gap-2.5">
                  <FaStore className="text-blue-400" size={14} />
                  <span>Merchant Vendor</span>
                </div>
                {demoLoadingRole === 'vendor' ? (
                  <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-blue-400"></div>
                ) : (
                  <span className="text-[10px] bg-blue-500/20 px-2 py-0.5 rounded text-blue-300 font-mono">1-Click</span>
                )}
              </button>

              {/* Customer Button */}
              <button
                onClick={() => handleDemoLogin('customer')}
                disabled={demoLoadingRole !== null}
                className="flex items-center justify-between sm:justify-center gap-3 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 hover:border-emerald-500/50 text-emerald-300 font-semibold text-xs transition-all group disabled:opacity-50"
              >
                <div className="flex items-center gap-2.5">
                  <FaUserCheck className="text-emerald-400" size={14} />
                  <span>Shopper Demo</span>
                </div>
                {demoLoadingRole === 'customer' ? (
                  <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-emerald-400"></div>
                ) : (
                  <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded text-emerald-300 font-mono">1-Click</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>


      {/* Feature Showcase: "Bento Grid" Style */}
      <section className="py-32 px-6 max-w-[1400px] mx-auto">
        <div className="mb-20">
          <h2 className="text-5xl md:text-6xl font-bold tracking-tighter mb-4">Pro-Level Features.</h2>
          <p className="text-2xl text-gray-500">Designed for power users.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Large Span */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2 row-span-2 h-[600px] titanium-card p-12 flex flex-col justify-between group">
            <div>
              <h3 className="text-3xl font-bold mb-2 text-gray-200">Cinematic Shopping.</h3>
              <p className="text-gray-500 text-lg">Immersive product galleries that feel like you're there.</p>
            </div>
            <div className="h-96 w-full bg-gradient-to-br from-gray-800 to-black rounded-2xl overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800"
                className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500"
                alt="Cinematic"
              />
            </div>
          </div>

          {/* Card 2 */}
          <div className="h-[290px] titanium-card p-8 flex flex-col justify-center">
            <span className="text-blue-500 font-bold mb-2">Fast & Secure</span>
            <h3 className="text-2xl font-bold text-white mb-2">Apple-Fast Payments.</h3>
            <p className="text-gray-500 text-sm">Checkout in milliseconds.</p>
          </div>

          {/* Card 3 */}
          <div className="h-[290px] titanium-card p-8 flex flex-col justify-center bg-[#1C1C1E]">
            <span className="text-purple-500 font-bold mb-2">Analytics</span>
            <h3 className="text-2xl font-bold text-white mb-2">Vendor Pro.</h3>
            <p className="text-gray-500 text-sm">Real-time insights for sellers.</p>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-32 text-center border-t border-[#1C1C1E]">
        <h2 className="text-5xl font-bold tracking-tighter mb-8 text-white">Get Pro Today.</h2>
        <GlowButton onClick={() => openAuth('register')} className="bg-white text-black hover:bg-gray-200">
          Start Free Trial
        </GlowButton>
      </section>

      <AuthModal
        isOpen={authOpen}
        initialMode={initialMode}
        onClose={() => setAuthOpen(false)}
      />
    </div>
  )
}