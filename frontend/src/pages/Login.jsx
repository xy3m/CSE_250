import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useDispatch } from 'react-redux' 
import { loginUser } from '../redux/slices/authSlice' 

export default function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch() 
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      // 1. Dispatch the login action
      const resultAction = await dispatch(loginUser(form))
      
      // 2. Check if the login actually succeeded
      if (loginUser.rejected.match(resultAction)) {
        // If rejected, throw error with the payload message
        throw new Error(resultAction.payload || 'Login failed')
      }

      // 3. Unwrap the user data
      const response = resultAction.payload
      const user = response.user
      
      toast.success(`Welcome back, ${user.name}!`)
      
      // 4. === REDIRECT BASED ON ROLE ===
      if (user.role === 'admin') {
        navigate('/admin/dashboard')
      } else {
        navigate('/dashboard')
      }

    } catch (err) {
      toast.error(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login to HaatBazar</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
            className="w-full p-3 border rounded-lg"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            className="w-full p-3 border rounded-lg"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="w-full bg-teal-600 text-white p-3 rounded-lg hover:bg-teal-700"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Don't have an account? <Link to="/register" className="text-teal-600">Register</Link>
        </p>
      </div>
    </div>
  )
}