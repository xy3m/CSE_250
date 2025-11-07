import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) setUser(JSON.parse(storedUser))
  }, [location])

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    setUser(null)
    toast.success('Logged out')
    navigate('/')
  }

  if (!user && location.pathname === '/') return null

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to={user ? '/products' : '/'} className="text-2xl font-bold text-teal-600">
            🛒 HaatBazar
          </Link>

          <div className="flex gap-6 items-center">
            {!user ? (
              <>
                <Link to="/login" className="hover:text-teal-600">Login</Link>
                <Link to="/register" className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700">
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link to="/products" className="hover:text-teal-600 font-medium">
                  Shop
                </Link>

                {/* Vendor-specific links */}
                {user.role === 'vendor' && (
                  <>
                    <Link to="/vendor/products/new" className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700">
                      + Add Product
                    </Link>
                    <Link to="/vendor/dashboard" className="hover:text-teal-600">
                      My Store
                    </Link>
                  </>
                )}

                {/* Admin-specific link - Just Admin Panel */}
                {user.role === 'admin' && (
                  <Link to="/admin/dashboard" className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
                    Admin Panel
                  </Link>
                )}

                <span className="text-gray-600">Hi, {user.name}</span>
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
