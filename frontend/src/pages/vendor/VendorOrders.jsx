import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBoxOpen, FaShippingFast, FaCheckCircle, FaTrashAlt, FaMapMarkerAlt, FaUser, FaPhone } from 'react-icons/fa';

import GlassCard from '../../components/ui/GlassCard';
import GlowButton from '../../components/ui/GlowButton';
import PageTransition from '../../components/ui/PageTransition';

export default function VendorOrders() {
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVendorOrders = async () => {
    try {
      const { data } = await axios.get('/vendor/orders');
      setOrders(data.orders);
    } catch (err) {
      if (err.response?.status !== 401) {
        toast.error('Could not fetch orders');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchVendorOrders();
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`/admin/order/${orderId}`, { orderStatus: newStatus });
      toast.success(`Order marked as ${newStatus}`);
      fetchVendorOrders();
    } catch (err) {
      toast.error('Failed to update order status');
    }
  };

  const handleClearHistory = async () => {
    if (window.confirm('Are you sure you want to clear all delivered order history?')) {
      try {
        await axios.delete('/vendor/orders/delivered');
        toast.success('History cleared');
        fetchVendorOrders();
      } catch (err) {
        toast.error('Failed to clear history');
      }
    }
  };

  const statusColors = {
    'Delivered': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'Cancelled': 'bg-red-500/10 text-red-400 border-red-500/20',
    'Shipped': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    'Processing': 'bg-blue-500/10 text-blue-400 border-blue-500/20'
  };

  if (loading) return (
    <PageTransition>
      <div className="flex items-center justify-center min-h-[60vh] bg-black">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
      </div>
    </PageTransition>
  );

  return (
    <PageTransition>
      <div className="min-h-screen pt-32 pb-20 px-6 sm:px-8 bg-black">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Manage Orders</h1>
              <p className="text-gray-400">Track and manage your customer shipments</p>
            </div>

            <GlowButton
              onClick={handleClearHistory}
              disabled={orders.length === 0}
              style={{ background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)' }}
              className={`flex items-center gap-2 !py-2.5 !px-5 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed text-white shadow-lg shadow-red-500/30`}
            >
              <FaTrashAlt size={16} />
              Clear Delivered History
            </GlowButton>
          </div>

          {orders.length === 0 ? (
            <GlassCard className="py-20 bg-[#1C1C1E] border-white/10 text-center">
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-gray-500 mb-2">
                  <FaBoxOpen size={40} />
                </div>
                <h3 className="text-xl font-semibold text-white">No active orders</h3>
                <p className="text-gray-500 max-w-sm">When customers place orders for your products, they will appear here.</p>
              </div>
            </GlassCard>
          ) : (
            <div className="grid gap-6">
              <AnimatePresence>
                {orders.map((order, index) => (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <GlassCard className="p-0 overflow-hidden group bg-[#1C1C1E] border-white/10 shadow-xl hover:bg-white/5 transition-all">
                      {/* Status Bar */}
                      <div className={`h-1 w-full bg-gradient-to-r ${order.orderStatus === 'Delivered' ? 'from-emerald-500 to-teal-500' :
                        order.orderStatus === 'Shipped' ? 'from-amber-500 to-orange-500' :
                          'from-blue-500 to-indigo-500'
                        }`} />

                      <div className="p-6 md:p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                          {/* Column 1: Order Info */}
                          <div className="space-y-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-bold text-lg text-white flex items-center gap-2">
                                  Order #{order._id.slice(-6)}
                                </h3>
                                <span className="text-xs text-gray-500 font-mono uppercase tracking-widest">
                                  ID: {order._id}
                                </span>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColors[order.orderStatus] || 'bg-gray-800'}`}>
                                {order.orderStatus}
                              </span>
                            </div>

                            <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                              <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">
                                <FaUser size={14} />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-white">{order.user?.name || 'Guest User'}</p>
                                <p className="text-xs text-gray-400">{order.user?.email}</p>
                              </div>
                            </div>
                          </div>

                          {/* Column 2: Shipping Info */}
                          <div className="space-y-3 bg-white/5 p-4 rounded-xl border border-white/5">
                            <h4 className="font-bold text-gray-300 flex items-center gap-2 text-sm">
                              <FaMapMarkerAlt className="text-red-400" /> Shipping Details
                            </h4>
                            <div className="text-sm text-gray-400 space-y-1 pl-6 relative">
                              <div className="absolute left-1.5 top-2 bottom-2 w-0.5 bg-white/10"></div>
                              <p className="font-medium text-white">{order.shippingInfo.name}</p>
                              <p>{order.shippingInfo.address}</p>
                              <p>{order.shippingInfo.city}, {order.shippingInfo.division} - {order.shippingInfo.postalCode}</p>
                              <p className="flex items-center gap-2 text-teal-400 font-medium mt-1">
                                <FaPhone size={12} /> {order.shippingInfo.phone}
                              </p>
                            </div>
                          </div>

                          {/* Column 3: Actions & Items */}
                          <div className="flex flex-col justify-between gap-4">
                            <div className="space-y-2">
                              <h4 className="font-bold text-gray-300 text-sm mb-2">Items to Ship:</h4>
                              <div className="max-h-40 overflow-y-auto custom-scrollbar pr-2 space-y-2">
                                {order.orderItems
                                  .filter(item => item.vendor === user?._id)
                                  .map(item => (
                                    <div key={item.product} className="flex justify-between items-center p-2 bg-black/40 rounded-lg border border-white/5 shadow-sm">
                                      <div className="flex items-center gap-3">
                                        <div className="bg-white/10 text-gray-300 w-8 h-8 flex items-center justify-center rounded text-xs font-bold">
                                          x{item.quantity}
                                        </div>
                                        <p className="text-sm font-medium text-gray-300 line-clamp-1">{item.name}</p>
                                      </div>
                                      <p className="text-sm font-bold text-white">৳{item.price * item.quantity}</p>
                                    </div>
                                  ))}
                              </div>
                            </div>

                            {/* Action Buttons */}
                            {order.orderStatus !== 'Delivered' && (
                              <div className="grid grid-cols-3 gap-2 mt-auto pt-4 border-t border-white/10">
                                <button
                                  onClick={() => handleStatusChange(order._id, 'Confirmed')}
                                  className="py-1.5 px-3 rounded-lg text-xs font-bold bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition border border-blue-500/20"
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() => handleStatusChange(order._id, 'Shipped')}
                                  className="py-1.5 px-3 rounded-lg text-xs font-bold bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition border border-amber-500/20"
                                >
                                  Ship
                                </button>
                                <button
                                  onClick={() => handleStatusChange(order._id, 'Delivered')}
                                  className="py-1.5 px-3 rounded-lg text-xs font-bold bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition border border-emerald-500/20"
                                >
                                  Deliver
                                </button>
                              </div>
                            )}
                          </div>

                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}