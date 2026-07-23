import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, XCircle, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import SEO from '../components/SEO';

const CartPage = () => {
    const { cartItems, removeFromCart, updateQty, cartTotal } = useCart();
    const navigate = useNavigate();
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponError, setCouponError] = useState('');
    const [couponLoading, setCouponLoading] = useState(false);

    // Initialize coupon from localStorage if it exists
    React.useEffect(() => {
        const savedCoupon = localStorage.getItem('appliedCoupon');
        if (savedCoupon) {
            setAppliedCoupon(JSON.parse(savedCoupon));
        }
    }, []);

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return;
        setCouponLoading(true);
        setCouponError('');
        try {
            const { data } = await axios.post('/api/coupons/validate', { code: couponCode });
            const discountAmount = (cartTotal * (data.discountPercentage / 100));
            const couponData = {
                code: data.code,
                discountPercentage: data.discountPercentage,
                discountAmount: discountAmount
            };
            setAppliedCoupon(couponData);
            localStorage.setItem('appliedCoupon', JSON.stringify(couponData));
            setCouponCode('');
        } catch (error) {
            setCouponError(error.response?.data?.message || 'Invalid coupon code');
        } finally {
            setCouponLoading(false);
        }
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        localStorage.removeItem('appliedCoupon');
    };

    const finalTotal = appliedCoupon ? cartTotal - appliedCoupon.discountAmount : cartTotal;

    if (cartItems.length === 0) {
        return (
    <div className="pt-32 pb-24 min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <SEO title="Cart" />
                <ShoppingBag className="w-20 h-20 text-gray-300 mb-6" />
                <h2 className="text-3xl font-black text-gray-900 mb-4">Your cart is empty</h2>
                <p className="text-gray-500 mb-8 text-center max-w-md">
                    Looks like you haven't added anything to your cart yet. Explore our premium laddus and start shopping!
                </p>
                <Link
                    to="/shop"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-10 py-4 rounded-2xl transition-all shadow-lg shadow-indigo-200"
                >
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="pt-12 pb-24 min-h-screen bg-gray-50">
            <div className="container-custom px-4">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 tracking-tight">
                    Your Shopping <span className="text-indigo-600">Cart</span>
                </h1>

                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Items List */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item) => (
                            <div
                                key={item._id}
                                className="bg-white border border-gray-100 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6 group hover:shadow-md transition-all"
                            >
                                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-100 shrink-0">
                                    <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 text-center md:text-left">
                                    <h3 className="text-xl font-bold text-gray-900 mb-1">{item.name}</h3>
                                    <p className="text-gray-500 text-xs uppercase tracking-widest">{item.category}</p>
                                </div>
                                <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-xl border border-gray-200">
                                    <button
                                        onClick={() => updateQty(item._id, Math.max(1, item.qty - 1))}
                                        className="p-1 text-gray-500 hover:text-indigo-600 transition-colors"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="text-gray-900 font-bold w-4 text-center">{item.qty}</span>
                                    <button
                                        onClick={() => updateQty(item._id, item.qty + 1)}
                                        className="p-1 text-gray-500 hover:text-indigo-600 transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="text-xl font-black text-gray-900 md:w-24 text-right">
                                    ₹{item.price * item.qty}
                                </div>
                                <button
                                    onClick={() => removeFromCart(item._id)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white border border-gray-200 rounded-3xl p-8 sticky top-32 shadow-sm">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-gray-500">
                                    <span>Subtotal</span>
                                    <span className="text-gray-900 font-medium">₹{cartTotal}</span>
                                </div>
                                
                                {/* Coupon Section */}
                                {!appliedCoupon ? (
                                    <div className="pt-4 border-t border-gray-100">
                                        <div className="flex gap-2">
                                            <div className="relative flex-1">
                                                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <input
                                                    type="text"
                                                    placeholder="Coupon Code"
                                                    value={couponCode}
                                                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 uppercase"
                                                />
                                            </div>
                                            <button
                                                onClick={handleApplyCoupon}
                                                disabled={couponLoading || !couponCode.trim()}
                                                className="bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white font-bold px-4 rounded-xl text-sm transition-colors"
                                            >
                                                Apply
                                            </button>
                                        </div>
                                        {couponError && <p className="text-red-500 text-xs mt-2 font-medium">{couponError}</p>}
                                    </div>
                                ) : (
                                    <div className="pt-4 border-t border-gray-100">
                                        <div className="bg-green-50 border border-green-100 rounded-xl p-3 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                                                <div>
                                                    <p className="text-sm font-bold text-green-800">{appliedCoupon.code}</p>
                                                    <p className="text-xs text-green-600">{appliedCoupon.discountPercentage}% OFF applied</p>
                                                </div>
                                            </div>
                                            <button onClick={handleRemoveCoupon} className="text-gray-400 hover:text-red-500 transition-colors">
                                                <XCircle className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {appliedCoupon && (
                                    <div className="flex justify-between text-green-600 font-bold">
                                        <span>Discount</span>
                                        <span>-₹{appliedCoupon.discountAmount.toFixed(0)}</span>
                                    </div>
                                )}

                                <div className="flex justify-between text-gray-500">
                                    <span>Shipping</span>
                                    <span className="text-green-600 font-bold uppercase text-xs">Free</span>
                                </div>
                                <div className="pt-4 border-t border-gray-100 flex justify-between items-end">
                                    <span className="text-gray-900 font-bold">Total Amount</span>
                                    <span className="text-3xl font-black text-indigo-600">₹{finalTotal.toFixed(0)}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => navigate('/checkout/address')}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl shadow-indigo-200"
                            >
                                Proceed to Checkout
                                <ArrowRight className="w-5 h-5" />
                            </button>
                            <p className="text-[10px] text-gray-400 mt-4 text-center font-bold uppercase tracking-widest">
                                Safe & Secure Checkout
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
