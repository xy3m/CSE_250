import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import axios from '../api/axios'
import { addItemToCart } from '../redux/slices/cartSlice'
import { toast } from 'react-hot-toast'
import { FaStar, FaArrowLeft, FaShieldAlt, FaTruck, FaUndo } from 'react-icons/fa'
import GlowButton from '../components/ui/GlowButton'
import PageTransition from '../components/ui/PageTransition'

export default function ProductDetails() {
    const { id } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [selectedImage, setSelectedImage] = useState(0)
    const [qty, setQty] = useState(1)

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`/products/${id}`)
                setProduct(data.product)
            } catch (err) {
                toast.error('Failed to load product')
                navigate('/products')
            } finally {
                setLoading(false)
            }
        }
        fetchProduct()
    }, [id, navigate])

    const handleAddToCart = () => {
        if (product.stock === 0) return
        dispatch(addItemToCart({ ...product, qty }))
        toast.success('Added to Bag')
    }

    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>
    if (!product) return null

    return (
        <PageTransition>
            <div className="min-h-screen bg-black pt-32 pb-12 px-6">
                <div className="max-w-[1200px] mx-auto">

                    <Link to="/products" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors text-sm font-medium">
                        <FaArrowLeft size={12} /> Back to Store
                    </Link>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">

                        {/* Left: Sticky Image Gallery */}
                        <div className="relative">
                            <div className="sticky top-28 space-y-6">
                                <div className="aspect-[4/5] w-full bg-[#151516] overflow-hidden rounded-3xl border border-white/10 relative group">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                                    <img
                                        src={product.images?.[selectedImage]?.url || 'https://via.placeholder.com/600'}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                                    />
                                    {product.stock === 0 && (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20 backdrop-blur-sm">
                                            <span className="text-white border border-white/20 px-6 py-2 rounded-full font-bold tracking-widest uppercase bg-white/5 backdrop-blur-md">Sold Out</span>
                                        </div>
                                    )}
                                </div>

                                {product.images?.length > 1 && (
                                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                                        {product.images.map((img, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setSelectedImage(idx)}
                                                className={`w-20 h-20 shrink-0 rounded-2xl overflow-hidden border-2 transition-all ${selectedImage === idx ? 'border-white opacity-100' : 'border-transparent opacity-50 hover:opacity-100'}`}
                                            >
                                                <img src={img.url} className="w-full h-full object-cover" alt="" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right: Details */}
                        <div className="flex flex-col pt-4">
                            <div className="mb-4">
                                <span className="text-xs font-bold tracking-widest text-blue-400 uppercase">{product.category}</span>
                            </div>

                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight tracking-tight">{product.name}</h1>

                            <div className="flex items-center gap-4 mb-8">
                                <span className="text-3xl font-medium text-white">৳{product.price}</span>
                                <div className="flex items-center gap-1 text-yellow-400 text-sm bg-yellow-400/10 px-3 py-1 rounded-full border border-yellow-400/20">
                                    <FaStar /> <span className="font-bold text-yellow-500">{product.ratings || 0}</span> <span className="text-gray-400 ml-1">({product.numOfReviews} reviews)</span>
                                </div>
                            </div>

                            <div className="h-px bg-white/10 w-full mb-8"></div>

                            <p className="text-lg text-gray-400 leading-relaxed mb-10 font-light">
                                {product.description}
                            </p>

                            {/* Actions */}
                            <div className="bg-[#1C1C1E] p-8 rounded-3xl border border-white/5 shadow-2xl mb-10">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="flex items-center bg-black/50 border border-white/10 rounded-full px-6 h-14 w-max">
                                        <button onClick={() => setQty(Math.max(1, qty - 1))} className="text-gray-400 hover:text-white p-2 transition-colors text-xl">-</button>
                                        <span className="font-bold w-10 text-center text-white">{qty}</span>
                                        <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="text-gray-400 hover:text-white p-2 transition-colors text-xl">+</button>
                                    </div>
                                    <GlowButton
                                        onClick={handleAddToCart}
                                        disabled={product.stock === 0}
                                        className="flex-1 h-14 text-lg !rounded-full"
                                        variant="primary"
                                    >
                                        {product.stock === 0 ? 'Out of Stock' : 'Add to Bag'}
                                    </GlowButton>
                                </div>
                                {product.stock > 0 && product.stock < 10 && (
                                    <p className="text-xs text-orange-400 mt-4 font-medium flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                                        Only {product.stock} left in stock - order soon.
                                    </p>
                                )}
                            </div>

                            {/* Trust Badges */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm text-gray-500">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/5 rounded-full text-white"><FaTruck /></div>
                                    <span>Fast Delivery</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/5 rounded-full text-white"><FaShieldAlt /></div>
                                    <span>Secure Payment</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/5 rounded-full text-white"><FaUndo /></div>
                                    <span>Easy Returns</span>
                                </div>
                            </div>

                            {/* Vendor Info */}
                            <div className="mt-12 p-6 bg-white/5 rounded-2xl border border-white/5">
                                <p className="text-xs font-bold uppercase text-gray-500 mb-2 tracking-widest">Sold By</p>
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-lg text-white">{product.vendor?.name || "Local Vendor"}</span>
                                    <Link to="/products" className="text-sm font-medium text-blue-400 hover:text-blue-300">View Store</Link>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </PageTransition>
    )
}
