import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-6">
          Welcome to HaatBazar
        </h1>
        <p className="text-2xl text-gray-600 mb-12">
          Your trusted local marketplace - Buy & Sell with ease
        </p>
        <div className="flex gap-4 justify-center">
          <Link 
            to="/login" 
            className="bg-teal-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-teal-700 transition"
          >
            Login
          </Link>
          <Link 
            to="/register" 
            className="bg-gray-200 text-gray-800 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-300 transition"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  )
}
