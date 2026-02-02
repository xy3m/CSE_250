import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUserProfile } from './redux/slices/authSlice'
import Profile from './pages/Profile.jsx'
// Component Imports
import Navbar from './components/Navbar.jsx'
import PrivateRoute from './components/PrivateRoute.jsx'

// Page Imports (User)
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Products from './pages/Products.jsx'
import ProductDetails from './pages/ProductDetails.jsx' // [NEW]
import Cart from './pages/Cart.jsx'
import MyOrders from './pages/MyOrders.jsx'

// Page Imports (Vendor)
import VendorDashboard from './pages/vendor/VendorDashboard.jsx'
import AddProduct from './pages/vendor/AddProduct.jsx'
import VendorProducts from './pages/vendor/VendorProducts.jsx'
import EditProduct from './pages/vendor/EditProduct.jsx'
import VendorOrders from './pages/vendor/VendorOrders.jsx'
import VendorApplication from './pages/vendor/VendorApplication.jsx'

// Page Imports (Admin)
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import AdminEditProduct from './pages/admin/AdminEditProduct.jsx'
import Dashboard from './pages/Dashboard.jsx'

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:id" element={<ProductDetails />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/vendor/apply" element={<VendorApplication />} />

      {/* Protected Routes (Any Authenticated User) */}
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />
      <Route
        path="/orders/me"
        element={
          <PrivateRoute>
            <MyOrders />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <PrivateRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/products/edit/:id"
        element={
          <PrivateRoute allowedRoles={['admin']}>
            <AdminEditProduct />
          </PrivateRoute>
        }
      />

      {/* Vendor Routes */}
      <Route
        path="/vendor/dashboard"
        element={
          <PrivateRoute allowedRoles={['vendor']}>
            <VendorDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/vendor/products/new"
        element={
          <PrivateRoute allowedRoles={['vendor']}>
            <AddProduct />
          </PrivateRoute>
        }
      />
      <Route
        path="/vendor/products"
        element={
          <PrivateRoute allowedRoles={['vendor']}>
            <VendorProducts />
          </PrivateRoute>
        }
      />
      <Route
        path="/vendor/products/edit/:id"
        element={
          <PrivateRoute allowedRoles={['vendor']}>
            <EditProduct />
          </PrivateRoute>
        }
      />
      <Route
        path="/vendor/orders"
        element={
          <PrivateRoute allowedRoles={['vendor']}>
            <VendorOrders />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

function App() {
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector(state => state.auth)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const initAuth = async () => {
      // Check if we have a token in storage
      const token = localStorage.getItem('token');
      if (token) {
        // Verify token with server
        await dispatch(getUserProfile())
      }
      setIsLoaded(true)
    }
    initAuth()
  }, [dispatch])

  // Optional: Show a blank screen or spinner for a split second 
  // while we check the server for the latest status.
  // This prevents the "Apply" button from flashing on screen.
  if (!isLoaded) return null

  return (
    <BrowserRouter>
      <Navbar />
      <Toaster position="top-center" />
      <AnimatedRoutes />
    </BrowserRouter>
  )
}

export default App