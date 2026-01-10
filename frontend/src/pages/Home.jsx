import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import GlowButton from '../components/ui/GlowButton'
import { FaSignInAlt, FaUserPlus } from 'react-icons/fa'
import AuthModal from '../components/auth/AuthModal'

export default function Home() {
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const [authOpen, setAuthOpen] = useState(false)
  const [initialMode, setInitialMode] = useState('login')

  const openAuth = (mode) => {
    setInitialMode(mode)
    setAuthOpen(true)
  }

  // If logged in:
  if (isAuthenticated) {
    // If Admin -> Go to Admin Dashboard
    if (user?.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />
    }
    // Everyone else -> Go to Shop Dashboard
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20 selection:text-white">

      {/* Navbar Placeholder (Navbar component sits on top, ensuring it matches later) */}

      {/* Hero Section: "The Pro Standard" */}
      <section className="relative h-screen flex flex-col justify-center items-center text-center overflow-hidden">

        {/* Subtle Titanium Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl px-6">
          <h1 className="text-7xl md:text-9xl font-bold tracking-tighter mb-6 bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
            HaatBazar.
          </h1>
          <p className="text-2xl md:text-3xl text-gray-400 font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
            আপনার বাজার, আপনার হাতের মুঠোয়
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <GlowButton onClick={() => openAuth('login')} variant="primary" className="px-10 py-4 text-lg">
              Enter Store
            </GlowButton>
            <button
              onClick={() => openAuth('register')}
              className="text-lg text-blue-400 hover:text-blue-300 transition-colors font-medium flex items-center gap-2 group"
            >
              Join the Ecosystem <span className="group-hover:translate-x-1 transition-transform">›</span>
            </button>
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