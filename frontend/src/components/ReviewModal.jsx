import { useState, useEffect } from 'react';
import { FaStar, FaTimes } from 'react-icons/fa';
import axios from '../api/axios';

export default function ReviewModal({ isOpen, onClose, productId }) {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && productId) {
            fetchReviews();
        }
    }, [isOpen, productId]);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('/products/reviews', {
                params: { id: productId }
            });
            setReviews(data.reviews || []);
        } catch (error) {
            console.error("Failed to fetch reviews", error);
            setReviews([]);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl animate-scale-in">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-2xl font-bold text-slate-800">Product Reviews</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <FaTimes size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                    {loading ? (
                        <div className="flex justify-center py-10">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                        </div>
                    ) : reviews.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-gray-500 text-lg">No reviews yet.</p>
                            <p className="text-gray-400 text-sm mt-1">Be the first to review this product!</p>
                        </div>
                    ) : (
                        reviews.map((review) => (
                            <div key={review._id} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-sm">
                                            {review.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="font-semibold text-slate-800">{review.name}</span>
                                    </div>
                                    <div className="flex text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <FaStar key={i} className={i < review.rating ? "text-yellow-400" : "text-gray-300"} size={14} />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-slate-600 text-sm leading-relaxed">{review.comment}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
