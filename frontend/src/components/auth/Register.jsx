import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { registerUser, clearError } from '../../redux/slices/authSlice'
import { toast } from 'react-hot-toast'

export default function Register() {
  const dispatch = useDispatch()
  const { loading, error } = useSelector(state => state.auth)

  const [form, setForm] = useState({ name: '', email: '', password: '' })

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = e => {
    e.preventDefault()
    dispatch(registerUser(form))
      .unwrap()
      .then(() => {
        toast.success('Registration successful! Please login.')
      })
      .catch(err => {
        toast.error(err)
        dispatch(clearError())
      })
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Register</h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          className="input-field"
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />

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
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  )
}
