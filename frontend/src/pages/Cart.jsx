// frontend/src/pages/Cart.jsx
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from '../api/axios';
import { updateCartQuantity, removeItemFromCart, clearCart } from '../redux/slices/cartSlice';

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  // State for selected address
  const [selectedAddress, setSelectedAddress] = useState(
    user?.addresses?.find(a => a.isDefault)?._id || null
  );
  
  const handleQuantityChange = (id, quantity) => {
    dispatch(updateCartQuantity({ productId: id, quantity: Number(quantity) }));
  };

  const handleRemove = (id) => {
    dispatch(removeItemFromCart(id));
    toast.success('Item removed from cart');
  };

  // Calculate prices
  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingPrice = itemsPrice > 500 ? 0 : 50; // Example: Free shipping over ৳500
  const taxPrice = 0; // Example: 0 tax
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const handleCheckout = async () => {
    if (!selectedAddress) {
      toast.error('Please select a shipping address');
      return;
    }

    const shippingInfo = user.addresses.find(a => a._id === selectedAddress);
    
    const orderData = {
      orderItems: cartItems.map(item => ({
        product: item.product,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        vendor: item.vendor
      })),
      shippingInfo: {
        name: shippingInfo.name,
        phone: shippingInfo.phone,
        address: shippingInfo.addressLine,
        city: shippingInfo.city,
        division: shippingInfo.division,
        postalCode: shippingInfo.postalCode,
      },
      paymentInfo: {
        id: 'COD', // Payment ID for Cash on Delivery
        status: 'pending',
        method: 'cod',
      },
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    };

    try {
      await axios.post('/order/new', orderData);
      dispatch(clearCart());
      toast.success('Order placed successfully!');
      navigate('/orders/me'); // Redirect to a new "My Orders" page
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <p>Your cart is empty. <Link to="/products" className="text-teal-600">Go Shopping</Link></p>
        ) : (
          cartItems.map(item => (
            <div key={item.product} className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img src={item.image} alt={item.name} className="w-20 h-20 rounded-lg object-cover" />
                <div>
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <p className="text-gray-600">৳{item.price}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item.product, e.target.value)}
                  min="1"
                  max={item.stock}
                  className="w-16 p-2 border rounded"
                />
                <button onClick={() => handleRemove(item.product)} className="text-red-500 hover:text-red-700">
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="lg:col-span-1 space-y-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Shipping Address</h2>
          {!user?.addresses || user.addresses.length === 0 ? (
            <p>Please <Link to="/me/update" className="text-teal-600">add an address</Link> to your profile.</p>
          ) : (
            user.addresses.map(addr => (
              <div key={addr._id} className="p-2 border rounded-md mb-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="address"
                    value={addr._id}
                    checked={selectedAddress === addr._id}
                    onChange={() => setSelectedAddress(addr._id)}
                  />
                  <div>
                    <strong>{addr.name}</strong>, {addr.addressLine}, {addr.city}
                  </div>
                </label>
              </div>
            ))
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between"><p>Subtotal:</p> <p>৳{itemsPrice.toFixed(2)}</p></div>
            <div className="flex justify-between"><p>Shipping:</p> <p>৳{shippingPrice.toFixed(2)}</p></div>
            <div className="flex justify-between"><p>Tax:</p> <p>৳{taxPrice.toFixed(2)}</p></div>
            <hr />
            <div className="flex justify-between font-bold text-lg"><p>Total:</p> <p>৳{totalPrice.toFixed(2)}</p></div>
          </div>
          <button
            onClick={handleCheckout}
            disabled={cartItems.length === 0 || !selectedAddress}
            className="w-full bg-teal-600 text-white p-3 rounded-lg hover:bg-teal-700 mt-4 disabled:bg-gray-400"
          >
            Place Order (Cash on Delivery)
          </button>
        </div>
      </div>
    </div>
  );
}