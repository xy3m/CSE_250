import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { toast } from 'react-hot-toast';
import SubmitReviewModal from '../components/SubmitReviewModal';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({ id: null, name: '' });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get('/orders/me');
        setOrders(data.orders);
      } catch (err) {
        toast.error('Could not fetch orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <p className="p-6">Loading your orders...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-500 mb-2">You have not placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order._id} className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="flex flex-col md:flex-row justify-between gap-4">

                {/* Left Side: Product Details */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Order #{order._id}</p>
                      <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-700' :
                        order.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-800'
                      }`}>
                      {order.orderStatus}
                    </span>
                  </div>

                  <div className="mt-3 space-y-2">
                    {order.orderItems.map((item) => (
                      <div key={item.product} className="flex items-center justify-between gap-3 bg-slate-50 p-3 rounded-lg">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded border"
                          />
                          <div>
                            <p className="font-semibold text-gray-800">{item.name}</p>
                            <p className="text-sm text-gray-500">Qty: {item.quantity} × ৳{item.price}</p>
                          </div>
                        </div>
                        {order.orderStatus === 'Delivered' && (
                          <button
                            onClick={() => {
                              setSelectedProduct({ id: item.product, name: item.name });
                              setSubmitModalOpen(true);
                            }}
                            className="text-xs sm:text-sm font-medium text-teal-600 border border-teal-200 bg-white px-3 py-1.5 rounded-lg hover:bg-teal-50 hover:border-teal-300 transition-all"
                          >
                            Write Review
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Side: Total & Info */}
                <div className="md:text-right flex flex-col justify-end border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6 mt-4 md:mt-0">
                  <p className="text-gray-500 text-sm">Total Amount</p>
                  <p className="text-2xl font-bold text-teal-600">৳{order.totalPrice}</p>
                  <p className="text-xs text-gray-400 mt-1">{order.orderItems.length} Item(s)</p>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
      <SubmitReviewModal
        isOpen={submitModalOpen}
        onClose={() => setSubmitModalOpen(false)}
        productId={selectedProduct.id}
        productName={selectedProduct.name}
      />
    </div>
  );
}