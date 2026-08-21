import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBoxOpen, FaCalendarAlt, FaCreditCard, FaTruck, FaCheckCircle, FaClock, FaBox } from 'react-icons/fa';
import SubmitReviewModal from '../components/SubmitReviewModal';
import GlassCard from '../components/ui/GlassCard';
import GlowButton from '../components/ui/GlowButton';
import PageTransition from '../components/ui/PageTransition';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({ id: null, name: '', orderId: null });

  const fetchOrders = async () => {
    if (orders.length === 0) setLoading(true);

    try {
      const { data } = await axios.get('/orders/me');
      setOrders(data.orders || []);
    } catch (err) {
      // Silent fail
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusStep = (status) => {
    switch (status) {
      case 'Delivered': return 4;
      case 'Shipped': return 3;
      case 'Processing': return 2;
      default: return 1;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Shipped': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'Cancelled': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'Processing': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default: return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    }
  };

  const steps = [
    { label: 'Order Placed', icon: FaClock },
    { label: 'Processing', icon: FaBox },
    { label: 'Shipped', icon: FaTruck },
    { label: 'Delivered', icon: FaCheckCircle },
  ];

  if (loading) return (
    <PageTransition>
      <div className="flex items-center justify-center min-h-[60vh] bg-black text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
      </div>
    </PageTransition>
  );

  return (
    <PageTransition>
      <div className="min-h-screen pt-32 pb-20 px-6 sm:px-8 bg-black">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between gap-4 mb-10">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">My Orders</h1>
              <p className="text-sm text-gray-400 mt-1">Track delivery status, reviews, and transaction details</p>
            </div>
            <span className="bg-[#1C1C1E] text-gray-400 px-3.5 py-1.5 rounded-full text-xs font-semibold border border-white/10">
              {orders.length} Total Orders
            </span>
          </div>

          {orders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <GlassCard className="py-24 bg-[#1C1C1E] border-white/10 flex flex-col items-center justify-center text-center !rounded-3xl">
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center text-gray-600 mb-6 mx-auto">
                  <FaBoxOpen size={40} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">No orders found</h3>
                <p className="text-gray-500 max-w-sm mb-8 text-lg mx-auto">You haven't placed any orders yet.</p>
                <Link to="/dashboard">
                  <GlowButton className="px-8" variant="primary">Start Shopping</GlowButton>
                </Link>
              </GlassCard>
            </motion.div>
          ) : (
            <div className="space-y-8">
              <AnimatePresence>
                {orders.map((order, index) => {
                  const currentStep = getStatusStep(order.orderStatus);
                  const isStripe = order.paymentInfo?.id?.startsWith('pi_') || order.paymentInfo?.id?.includes('stripe');

                  return (
                    <motion.div
                      key={order._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <GlassCard className="!p-0 overflow-hidden shadow-2xl group transition-all bg-[#1C1C1E] border-white/10 hover:border-white/20 !rounded-3xl">
                        
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-white/5 bg-white/5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Order ID</span>
                              <span className="text-sm font-mono text-gray-200">#{order._id.slice(-8)}</span>
                              
                              {/* Payment badge */}
                              <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-white/10 border border-white/10 text-gray-300">
                                <FaCreditCard size={10} className={isStripe ? "text-blue-400" : "text-emerald-400"} />
                                {isStripe ? "Stripe Card" : "COD / Direct"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400 text-xs">
                              <FaCalendarAlt className="text-gray-600" />
                              {new Date(order.createdAt).toLocaleDateString(undefined, {
                                year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                              })}
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className={`px-4 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.orderStatus)}`}>
                              {order.orderStatus}
                            </div>
                            <div className="text-white font-bold text-lg">
                              <span className="text-gray-500 text-xs font-normal mr-1.5">Total:</span>
                              ৳{order.totalPrice}
                            </div>
                          </div>
                        </div>

                        {/* Visual Order Progress Tracker */}
                        {order.orderStatus !== 'Cancelled' && (
                          <div className="px-6 pt-6 pb-4 bg-black/40 border-b border-white/5">
                            <div className="grid grid-cols-4 relative">
                              {/* Background Bar */}
                              <div className="absolute top-4 left-[12%] right-[12%] h-1 bg-white/10 -z-0" />
                              {/* Active Filled Bar */}
                              <div 
                                className="absolute top-4 left-[12%] h-1 bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500 -z-0"
                                style={{ width: `${((currentStep - 1) / 3) * 76}%` }}
                              />

                              {steps.map((step, sIdx) => {
                                const stepNum = sIdx + 1;
                                const isPassed = currentStep >= stepNum;
                                const isCurrent = currentStep === stepNum;
                                const StepIcon = step.icon;

                                return (
                                  <div key={step.label} className="flex flex-col items-center text-center relative z-10">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                      isPassed 
                                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' 
                                        : 'bg-[#2C2C2E] text-gray-500 border border-white/10'
                                    } ${isCurrent ? 'ring-4 ring-blue-500/20' : ''}`}>
                                      <StepIcon size={12} />
                                    </div>
                                    <span className={`text-[11px] font-medium mt-2 ${isPassed ? 'text-white' : 'text-gray-600'}`}>
                                      {step.label}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Items List */}
                        <div className="p-6 space-y-4">
                          {order.orderItems.map((item) => (
                            <div key={item.product} className="flex flex-col sm:flex-row items-center justify-between gap-6">
                              <div className="flex items-center gap-5 w-full">
                                <div className="w-16 h-16 rounded-xl bg-black overflow-hidden shrink-0 border border-white/10 relative">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover opacity-90"
                                  />
                                </div>
                                <div>
                                  <Link to={`/products/${item.product}`} className="font-bold text-white text-base hover:text-blue-400 transition-colors">
                                    {item.name}
                                  </Link>
                                  <p className="text-xs text-gray-400 mt-1">
                                    Qty: {item.quantity} × <span className="text-gray-200">৳{item.price}</span>
                                  </p>
                                </div>
                              </div>

                              {order.orderStatus === 'Delivered' && (
                                !item.isReviewed ? (
                                  <button
                                    onClick={() => {
                                      setSelectedProduct({ id: item.product, name: item.name, orderId: order._id });
                                      setSubmitModalOpen(true);
                                    }}
                                    className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-white border border-white/10 hover:bg-white hover:text-black transition-all whitespace-nowrap"
                                  >
                                    Write Review
                                  </button>
                                ) : (
                                  <div className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-emerald-400 border border-emerald-500/20 bg-emerald-500/10 whitespace-nowrap">
                                    Reviewed ✓
                                  </div>
                                )
                              )}
                            </div>
                          ))}
                        </div>
                      </GlassCard>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
          <SubmitReviewModal
            isOpen={submitModalOpen}
            onClose={() => setSubmitModalOpen(false)}
            productId={selectedProduct.id}
            orderId={selectedProduct.orderId}
            productName={selectedProduct.name}
            onReviewSubmitted={fetchOrders}
          />
        </div>
      </div>
    </PageTransition>
  );
}