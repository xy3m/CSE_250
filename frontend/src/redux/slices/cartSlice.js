// frontend/src/redux/slices/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Load cart from localStorage if it exists
  cartItems: localStorage.getItem('cartItems')
    ? JSON.parse(localStorage.getItem('cartItems'))
    : [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Add item to cart (or update quantity if it exists)
    addItemToCart: (state, action) => {
      const product = action.payload;
      const itemExists = state.cartItems.find(
        (i) => i.product === product._id
      );

      if (itemExists) {
        // Increase quantity, but not past the available stock
        itemExists.quantity = Math.min(
          itemExists.quantity + 1,
          itemExists.stock
        );
      } else {
        // Add new item to cart
        state.cartItems.push({
          product: product._id,
          name: product.name,
          price: product.price,
          image: product.images?.[0]?.url || 'httpsIA://via.placeholder.com/150',
          stock: product.stock,
          vendor: product.vendor, // We need this for the order
          quantity: 1,
        });
      }
      // Save to localStorage
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },

    // Update quantity
    updateCartQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.cartItems.find((i) => i.product === productId);
      if (item) {
        item.quantity = Math.max(1, Math.min(quantity, item.stock));
      }
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },

    // Remove item from cart
    removeItemFromCart: (state, action) => {
      const productId = action.payload;
      state.cartItems = state.cartItems.filter(
        (i) => i.product !== productId
      );
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },

    // Clear cart (after order)
    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem('cartItems');
    },
  },
});

export const {
  addItemToCart,
  removeItemFromCart,
  updateCartQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;