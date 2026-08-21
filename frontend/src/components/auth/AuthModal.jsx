import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaShieldAlt, FaStore, FaUserCheck, FaBolt, FaEnvelope, FaLock, FaUser } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { loginUser, registerUser, demoLoginUser } from '../../redux/slices/authSlice';
import GlassCard from '../ui/GlassCard';
import GlowButton from '../ui/GlowButton';

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
    const [mode, setMode] = useState(initialMode);
    const [loading, setLoading] = useState(false);
    const [demoLoadingRole, setDemoLoadingRole] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        setMode(initialMode);
        setFormData({ name: '', email: '', password: '' });
    }, [initialMode, isOpen]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRoleRedirect = (role) => {
        if (role === 'admin') {
            navigate('/admin/dashboard');
        } else if (role === 'vendor') {
            navigate('/vendor/dashboard');
        } else {
            navigate('/dashboard');
        }
    };

    const handleDemoLogin = async (role) => {
        setDemoLoadingRole(role);
        try {
            const resultAction = await dispatch(demoLoginUser({ role }));
            if (demoLoginUser.rejected.match(resultAction)) {
                throw new Error(resultAction.payload || `Demo login as ${role} failed`);
            }
            const user = resultAction.payload.user;
            toast.success(`Logged in as Demo ${role.toUpperCase()}!`);
            onClose();
            handleRoleRedirect(user.role);
        } catch (err) {
            toast.error(err.message || 'Demo login failed');
        } finally {
            setDemoLoadingRole(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (mode === 'login') {
                const resultAction = await dispatch(loginUser({
                    email: formData.email,
                    password: formData.password
                }));

                if (loginUser.rejected.match(resultAction)) {
                    throw new Error(resultAction.payload || 'Login failed');
                }

                const user = resultAction.payload.user;
                toast.success(`Welcome back, ${user.name}!`);
                onClose();
                handleRoleRedirect(user.role);
            } else {
                await dispatch(registerUser(formData)).unwrap();
                toast.success('Registration successful! Please login.');
                setMode('login');
                setFormData(prev => ({ ...prev, password: '' }));
            }
        } catch (err) {
            const errorMessage = typeof err === 'string' ? err : (err.message || 'Authentication failed');
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-md z-10"
                >
                    <GlassCard className="p-7 relative overflow-hidden bg-[#1C1C1E] border-white/10 !rounded-3xl shadow-2xl">
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                        >
                            <FaTimes size={18} />
                        </button>

                        {/* Header */}
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-white mb-1">
                                {mode === 'login' ? 'Sign In to HaatBazar' : 'Join HaatBazar'}
                            </h2>
                            <p className="text-xs text-gray-400">
                                {mode === 'login'
                                    ? 'Instant 1-click test roles or email login'
                                    : 'Create a new customer account'}
                            </p>
                        </div>

                        {/* 1-Click Quick Demo Bar */}
                        <div className="mb-6 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                            <div className="flex items-center justify-between mb-2.5">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
                                    <FaBolt className="text-yellow-400" /> Instant 1-Click Demo
                                </span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleDemoLogin('admin')}
                                    disabled={demoLoadingRole !== null || loading}
                                    className="py-2 px-1 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-300 hover:bg-purple-500/30 font-semibold text-[11px] transition-all flex flex-col items-center gap-1"
                                >
                                    <FaShieldAlt size={12} />
                                    <span>{demoLoadingRole === 'admin' ? '...' : 'Admin'}</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleDemoLogin('vendor')}
                                    disabled={demoLoadingRole !== null || loading}
                                    className="py-2 px-1 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-300 hover:bg-blue-500/30 font-semibold text-[11px] transition-all flex flex-col items-center gap-1"
                                >
                                    <FaStore size={12} />
                                    <span>{demoLoadingRole === 'vendor' ? '...' : 'Vendor'}</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleDemoLogin('customer')}
                                    disabled={demoLoadingRole !== null || loading}
                                    className="py-2 px-1 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/30 font-semibold text-[11px] transition-all flex flex-col items-center gap-1"
                                >
                                    <FaUserCheck size={12} />
                                    <span>{demoLoadingRole === 'customer' ? '...' : 'Shopper'}</span>
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 mb-4">
                            <div className="h-px flex-1 bg-white/10" />
                            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Or with email</span>
                            <div className="h-px flex-1 bg-white/10" />
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-3">
                            {mode === 'register' && (
                                <div className="relative">
                                    <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={13} />
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Full Name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required={mode === 'register'}
                                        className="w-full pl-10 pr-4 py-2.5 bg-black border border-white/10 rounded-xl text-white placeholder-gray-500 text-xs focus:outline-none focus:border-blue-500 transition-all"
                                    />
                                </div>
                            )}

                            <div className="relative">
                                <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={13} />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email Address"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-10 pr-4 py-2.5 bg-black border border-white/10 rounded-xl text-white placeholder-gray-500 text-xs focus:outline-none focus:border-blue-500 transition-all"
                                />
                            </div>

                            <div className="relative">
                                <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={13} />
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-10 pr-4 py-2.5 bg-black border border-white/10 rounded-xl text-white placeholder-gray-500 text-xs focus:outline-none focus:border-blue-500 transition-all"
                                />
                            </div>

                            <GlowButton
                                type="submit"
                                className="w-full justify-center !py-3 mt-4 text-xs font-bold"
                                disabled={loading || demoLoadingRole !== null}
                                variant="primary"
                            >
                                {loading ? 'Processing...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
                            </GlowButton>
                        </form>

                        {/* Toggle Mode */}
                        <div className="mt-5 text-center text-xs text-gray-400">
                            {mode === 'login' ? (
                                <p>
                                    Don't have an account?{' '}
                                    <button
                                        onClick={() => setMode('register')}
                                        className="text-blue-400 font-bold hover:underline"
                                    >
                                        Register
                                    </button>
                                </p>
                            ) : (
                                <p>
                                    Already have an account?{' '}
                                    <button
                                        onClick={() => setMode('login')}
                                        className="text-blue-400 font-bold hover:underline"
                                    >
                                        Sign In
                                    </button>
                                </p>
                            )}
                        </div>
                    </GlassCard>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

