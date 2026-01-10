import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from '../../api/axios'
import { toast } from 'react-hot-toast'
import { motion } from 'framer-motion'
import { FaBoxOpen, FaChartLine, FaShoppingBag, FaPlus, FaCubes, FaStore, FaListAlt } from 'react-icons/fa'
import GlassCard from '../../components/ui/GlassCard'
import PageTransition from '../../components/ui/PageTransition'

export default function VendorDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // This endpoint comes from vendorController.js [cite: 31]
        const { data } = await axios.get('/vendor/dashboard')
        if (data.success) {
          setStats(data.stats)
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Could not load dashboard')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <PageTransition>
        <div className="flex items-center justify-center min-h-[60vh] bg-black text-white">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
        </div>
      </PageTransition>
    )
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <PageTransition>
      <div className="min-h-screen pt-32 pb-20 px-6 sm:px-8 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-10">
            <div className="bg-white/10 p-4 rounded-full border border-white/10">
              <FaStore className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Vendor Dashboard</h1>
              <p className="text-gray-500">Overview of your store performance.</p>
            </div>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
          >
            <motion.div variants={item}>
              <GlassCard className="p-6 bg-[#1C1C1E] border-white/10 shadow-xl hover:bg-white/5 transition-all group">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider group-hover:text-blue-400 transition-colors">Total Products</h3>
                    <p className="text-4xl font-extrabold text-white mt-3">
                      {stats?.productCount ?? 0}
                    </p>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl text-blue-400 border border-white/5 group-hover:scale-110 transition-transform">
                    <FaCubes size={24} />
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            <motion.div variants={item}>
              <GlassCard className="p-6 bg-[#1C1C1E] border-white/10 shadow-xl hover:bg-white/5 transition-all group">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider group-hover:text-green-400 transition-colors">Total Sales</h3>
                    <p className="text-4xl font-extrabold text-white mt-3">
                      ৳{stats?.totalSales ?? 0}
                    </p>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl text-green-400 border border-white/5 group-hover:scale-110 transition-transform">
                    <FaChartLine size={24} />
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            <motion.div variants={item}>
              <GlassCard className="p-6 bg-[#1C1C1E] border-white/10 shadow-xl hover:bg-white/5 transition-all group">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider group-hover:text-purple-400 transition-colors">Total Orders</h3>
                    <p className="text-4xl font-extrabold text-white mt-3">
                      {stats?.totalOrders ?? 0}
                    </p>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl text-purple-400 border border-white/5 group-hover:scale-110 transition-transform">
                    <FaShoppingBag size={24} />
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <GlassCard className="p-8 bg-[#1C1C1E] border-white/10 shadow-xl">
              <h2 className="text-xl font-bold mb-8 text-white flex items-center gap-2">
                <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link
                  to="/vendor/products/new"
                  className="flex flex-col items-center justify-center gap-4 bg-blue-600/10 border border-blue-500/20 text-blue-400 p-8 rounded-2xl hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all font-bold text-lg group text-center"
                >
                  <div className="bg-blue-500/20 p-4 rounded-full group-hover:bg-white/20 transition-colors">
                    <FaPlus size={24} />
                  </div>
                  Add New Product
                </Link>

                <Link
                  to="/vendor/products"
                  className="flex flex-col items-center justify-center gap-4 bg-white/5 border border-white/10 text-gray-300 p-8 rounded-2xl hover:bg-white/10 hover:text-white hover:border-white/20 transition-all font-bold text-lg group text-center"
                >
                  <div className="bg-white/5 p-4 rounded-full group-hover:bg-white/20 transition-colors">
                    <FaCubes size={24} />
                  </div>
                  Manage Products
                </Link>

                <Link
                  to="/vendor/orders"
                  className="flex flex-col items-center justify-center gap-4 bg-purple-500/10 border border-purple-500/20 text-purple-400 p-8 rounded-2xl hover:bg-purple-600 hover:text-white hover:border-purple-500 transition-all font-bold text-lg group text-center"
                >
                  <div className="bg-purple-500/20 p-4 rounded-full group-hover:bg-white/20 transition-colors">
                    <FaListAlt size={24} />
                  </div>
                  Received Orders
                </Link>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  )
}