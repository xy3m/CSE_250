import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useDispatch } from 'react-redux' // 1. Import useDispatch
import { registerUser } from '../redux/slices/authSlice' // 2. Import the registerUser thunk

export default function Register() {
  const navigate = useNavigate()
  const dispatch = useDispatch() // 3. Get the dispatch function
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      // 4. Dispatch the registerUser action
      await dispatch(registerUser(form)).unwrap()

      toast.success('Registration successful! Please login.')
      navigate('/login') // 5. Navigate to login
    } catch (err) {
      toast.error(err.payload || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Register for HaatBazar</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            type="text"
            className="w-full p-3 border rounded-lg"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />
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
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Already have an account? <Link to="/login" className="text-teal-600">Login</Link>
        </p>
      </div>
    </div>
  )
}