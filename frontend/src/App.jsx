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
import EditProduct from './pages/vendor/EditProduct' // 1. IMPORT THE COMPONENT
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminEditProduct from './pages/admin/AdminEditProduct' // <-- 1. ADD THIS IMPORT
import Cart from './pages/Cart'
import MyOrders from './pages/MyOrders'
import VendorOrders from './pages/vendor/VendorOrders'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Toaster position="top-center" />
      
      <Routes>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/products/edit/:id" element={<AdminEditProduct />} /> {/* <-- 2. ADD THIS ROUTE */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={<Products />} />
        <Route path="/vendor/dashboard" element={<VendorDashboard />} />
        <Route path="/vendor/products/new" element={<AddProduct />} />
        <Route path="/vendor/products" element={<VendorProducts />} />
        <Route path="/vendor/products/edit/:id" element={<EditProduct />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders/me" element={<MyOrders />} />
        <Route path="/vendor/orders" element={<VendorOrders />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
