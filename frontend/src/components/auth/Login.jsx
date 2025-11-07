import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser, clearError } from '../../redux/slices/authSlice'
import { toast } from 'react-hot-toast'

export default function Login() {
  const dispatch = useDispatch()
  const { loading, error } = useSelector(state => state.auth)

  const [form, setForm] = useState({ email: '', password: '' })

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = e => {
    e.preventDefault()
    dispatch(loginUser(form))
      .unwrap()
      .then(() => {
        toast.success('Login successful!')
      })
      .catch(err => {
        toast.error(err)
        dispatch(clearError())
      })
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Login</h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          className="input-field"
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          className="input-field"
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button
          className="btn-primary w-full"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Logging In...' : 'Login'}
        </button>
      </form>
    </div>
  )
}
