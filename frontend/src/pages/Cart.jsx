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
  
  // NEW: State for the shipping form
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    phone: '',
    addressLine: '',
    city: '',
    division: '',
    postalCode: ''
  });

  const handleShippingChange = (e) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value
    });
  };

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

  // NEW: Check if all required shipping fields are filled
  const isShippingFormValid = () => {
    return shippingInfo.name && shippingInfo.phone && shippingInfo.addressLine && shippingInfo.city && shippingInfo.division && shippingInfo.postalCode;
  };

  const handleCheckout = async () => {
    // Validate the form before submitting
    if (!isShippingFormValid()) {
      toast.error('Please fill in all shipping details');
      return;
    }
    
    const orderData = {
      orderItems: cartItems.map(item => ({
        product: item.product,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        vendor: item.vendor
      })),
      // Use the shipping info from the form
      shippingInfo: {
        name: shippingInfo.name,
        phone: shippingInfo.phone,
        address: shippingInfo.addressLine, // Note: backend orderModel expects 'address'
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
      navigate('/orders/me'); // Redirect to "My Orders" page
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
        
        {/* === NEW SHIPPING FORM === */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Shipping Details</h2>
          <form className="space-y-3">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="w-full p-2 border rounded"
              value={shippingInfo.name}
              onChange={handleShippingChange}
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              className="w-full p-2 border rounded"
              value={shippingInfo.phone}
              onChange={handleShippingChange}
              required
            />
            <input
              type="text"
              name="addressLine"
              placeholder="Address Line (e.g., House, Road)"
              className="w-full p-2 border rounded"
              value={shippingInfo.addressLine}
              onChange={handleShippingChange}
              required
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                name="city"
                placeholder="City"
                className="w-full p-2 border rounded"
                value={shippingInfo.city}
                onChange={handleShippingChange}
                required
              />
              <input
                type="text"
                name="postalCode"
                placeholder="Postal Code"
                className="w-full p-2 border rounded"
                value={shippingInfo.postalCode}
                onChange={handleShippingChange}
                required
              />
            </div>
            <input
              type="text"
              name="division"
              placeholder="Division (e.g., Dhaka, Sylhet)"
              className="w-full p-2 border rounded"
              value={shippingInfo.division}
              onChange={handleShippingChange}
              required
            />
          </form>
        </div>
        {/* ========================== */}

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
            // Update disabled check
            disabled={cartItems.length === 0 || !isShippingFormValid()}
            className="w-full bg-teal-600 text-white p-3 rounded-lg hover:bg-teal-700 mt-4 disabled:bg-gray-400"
          >
            Place Order (Cash on Delivery)
          </button>
        </div>
      </div>
    </div>
  );
}