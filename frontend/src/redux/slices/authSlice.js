import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';

// Register user
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/register', userData);
      // We will let the 'fulfilled' reducer handle localStorage
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

// Login user
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/login', credentials);
      // We will let the 'fulfilled' reducer handle localStorage
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

// 1-Click Demo Login (Admin / Vendor / Customer)
export const demoLoginUser = createAsyncThunk(
  'auth/demoLogin',
  async ({ role }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/demo-login', { role });
      return data;
    } catch (error) {
      console.warn('Live API demo login fallback:', error.message);
      
      // Instant Demo Fallback (ensures 1-Click test always works seamlessly on portfolio demos)
      const targetRole = (role || 'user').toLowerCase();
      let demoUser = {
        _id: '65e000000000000000000001',
        name: 'Demo Customer',
        email: 'customer@haatbazar.com',
        role: 'user',
        avatar: {
          public_id: 'sample_id',
          url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
        },
        addresses: [{
          _id: '65e000000000000000000099',
          name: 'Demo Customer',
          phone: '+1 555-0199',
          addressLine: '742 Evergreen Terrace',
          city: 'Metropolis',
          division: 'Dhaka',
          postalCode: '1205',
          isDefault: true
        }]
      };

      if (targetRole === 'admin') {
        demoUser = {
          _id: '65e000000000000000000002',
          name: 'Demo Admin',
          email: 'admin@haatbazar.com',
          role: 'admin',
          avatar: {
            public_id: 'sample_id',
            url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
          }
        };
      } else if (targetRole === 'vendor') {
        demoUser = {
          _id: '65e000000000000000000003',
          name: 'Demo Vendor',
          email: 'vendor@haatbazar.com',
          role: 'vendor',
          avatar: {
            public_id: 'sample_id',
            url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
          },
          vendorInfo: {
            businessName: 'Apex Electronics & Gear',
            businessType: 'Retail',
            status: 'approved',
            isApproved: true
          }
        };
      }

      const mockToken = 'mock_demo_jwt_token_' + Date.now();
      return {
        success: true,
        user: demoUser,
        token: mockToken
      };
    }
  }
);



// Get user profile
export const getUserProfile = createAsyncThunk(
  'auth/profile',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get('/me');
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

// Logout user
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await axios.get('/logout');
      // We will let the 'fulfilled' reducer handle localStorage
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);

// === INITIAL STATE ===
const initialState = {
  // Load user and token from localStorage
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,
  // Set isAuthenticated based on token
  isAuthenticated: localStorage.getItem('token') ? true : false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- Register ---
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        // Set localStorage
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- Login ---
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        // Set localStorage
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- Demo Login ---
      .addCase(demoLoginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(demoLoginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        // Set localStorage
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(demoLoginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


      // --- Get Profile ---
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        // === UPDATE LOCAL STORAGE ===
        // Persist updated user info (like vendor status)
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        // ============================
      })
      // === AUTO-LOGOUT ON PROFILE ERROR ===
      // If fetching profile fails (token expired), force logout
      .addCase(getUserProfile.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      })

      // --- Logout ---
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        // Clear localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      })
      // === FORCE LOGOUT EVEN ON ERROR ===
      .addCase(logoutUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        // Force clear localStorage even if server error
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;