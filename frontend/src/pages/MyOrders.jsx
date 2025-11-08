// frontend/src/pages/MyOrders.jsx
import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { toast } from 'react-hot-toast';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <p>Loading your orders...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <p>You have not placed any orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order._id} className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex justify-between">
                <div>
                  <p className="font-bold">Order ID:</p>
                  <p className="text-sm text-gray-600">{order._id}</p>
                </div>
                <div>
                  <p className="font-bold">Total:</p>
                  <p>৳{order.totalPrice}</p>
                </div>
                <div>
                  <p className="font-bold">Status:</p>
                  <p className={`font-semibold ${order.orderStatus === 'Delivered' ? 'text-green-600' : 'text-yellow-600'}`}>
                    {order.orderStatus}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}