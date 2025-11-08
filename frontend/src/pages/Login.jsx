import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useDispatch } from 'react-redux' // 1. Import useDispatch
import { loginUser } from '../redux/slices/authSlice' // 2. Import the loginUser thunk

export default function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch() // 3. Get the dispatch function
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      // 4. Dispatch the loginUser action and unwrap the result
      const resultAction = await dispatch(loginUser(form))
      const { user } = resultAction.payload
      
      toast.success(`Welcome back, ${user.name}!`)
      
      // 5. Navigate to products. The Navbar will update automatically.
      navigate('/products')

    } catch (err) {
      // The thunk will return the error message
      toast.error(err.payload || 'Login failed')
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