import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Products from './pages/Products'
import VendorDashboard from './pages/vendor/VendorDashboard'
import AddProduct from './pages/vendor/AddProduct'
import VendorProducts from './pages/vendor/VendorProducts'
import AdminDashboard from './pages/admin/AdminDashboard'
function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Toaster position="top-center" />
      
      <Routes>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={<Products />} />
        <Route path="/vendor/dashboard" element={<VendorDashboard />} />
        <Route path="/vendor/products/new" element={<AddProduct />} />
        <Route path="/vendor/products" element={<VendorProducts />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
