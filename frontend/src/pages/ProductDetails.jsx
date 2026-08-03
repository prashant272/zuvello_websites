import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChevronRight, Star, Heart, Share2, Plus, Minus, RotateCcw, ShieldCheck, CreditCard, CheckCircle2, ChevronUp, ChevronDown } from 'lucide-react';
import { API_BASE_URL } from '../api';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import SEO from '../components/SEO';

const ProductDetails = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [relatedProducts, setRelatedProducts] = useState([]);
    
    // UI State
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get(`${API_BASE_URL}/products/${slug}`);
                setProduct(data);
                if (data.sizes && data.sizes.length > 0) {
                    setSelectedSize(data.sizes[0]);
                }
                
                // Fetch related products
                const relatedRes = await axios.get(`${API_BASE_URL}/products?limit=5`);
                const filtered = relatedRes.data.filter(p => p._id !== data._id && p.category === data.category).slice(0,4);
                if(filtered.length === 0) {
                    setRelatedProducts(relatedRes.data.filter(p => p._id !== data._id).slice(0,4));
                } else {
                    setRelatedProducts(filtered);
                }
                
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
        window.scrollTo(0,0);
    }, [slug]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center font-bold text-xl text-[#cf7e28]">Loading...</div>;
    }

    if (!product) {
        return <div className="min-h-screen flex items-center justify-center font-bold text-xl text-red-500">Product not found!</div>;
    }

    const images = product.images?.length > 0 ? product.images : ['https://via.placeholder.com/600'];
    const originalPrice = product.price === 699 ? 1299 : product.price === 698 ? 1299 : product.price + Math.floor(product.price * 0.86);
    const discount = Math.round(((originalPrice - product.price) / originalPrice) * 100);

    const handleAddToCart = () => {
        addToCart({ ...product, selectedSize, quantity });
    };

    const handleBuyNow = () => {
        addToCart({ ...product, selectedSize, quantity });
        
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            navigate('/checkout/address');
        } else {
            navigate('/login?redirect=/checkout/address');
        }
    };

    return (
    <div className="bg-white min-h-screen font-sans pb-20">
      <SEO 
        title={product.name} 
        type="product"
        description={product.description || `Buy ${product.name} at Zuvello. Premium soft toys and plushies.`}
        image={images[0]}
        schema={{
          "@context": "https://schema.org",
          "@type": "Product",
          "name": product.name,
          "image": images,
          "description": product.description || `Buy ${product.name} at Zuvello. Premium soft toys and plushies.`,
          "sku": product._id,
          "brand": {
            "@type": "Brand",
            "name": "Zuvello"
          },
          "category": product.category,
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "reviewCount": "256"
          },
          "offers": {
            "@type": "Offer",
            "url": `https://www.zuvello.in/product/${slug}`,
            "priceCurrency": "INR",
            "price": product.price,
            "availability": "https://schema.org/InStock",
            "itemCondition": "https://schema.org/NewCondition"
          }
        }}
      />
            <div className="w-full h-1 bg-[#f5eadb]"></div>

            <div className="max-w-[1300px] mx-auto px-4 md:px-8 py-6">
                <div className="text-[13px] text-gray-500 mb-8 flex items-center gap-2 font-medium">
                    <Link to="/" className="hover:text-[#cf7e28]">Home</Link>
                    <ChevronRight size={12} />
                    <Link to="/shop" className="hover:text-[#cf7e28] capitalize">{product.category}</Link>
                    <ChevronRight size={12} />
                    <span className="text-[#1c1c1c] font-bold">{product.name}</span>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    
                    <div className="w-full lg:w-[45%] flex gap-4 md:gap-6">
                        {/* Thumbnails */}
                        <div className="w-[70px] md:w-[85px] hidden md:flex flex-col gap-3 overflow-y-auto no-scrollbar py-1">
                            {images.map((img, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => setSelectedImage(idx)}
                                    className={`w-full aspect-square flex-shrink-0 rounded-[18px] overflow-hidden border-2 transition-all duration-300 ${
                                        selectedImage === idx 
                                        ? 'border-[#cf7e28] shadow-[0_4px_12px_rgba(207,126,40,0.2)] bg-white ring-2 ring-white scale-[1.02]' 
                                        : 'border-transparent bg-[#fcf9f5] hover:bg-white hover:border-[#cf7e28]/40 hover:shadow-sm'
                                    }`}
                                >
                                    <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover mix-blend-multiply p-1.5" />
                                </button>
                            ))}
                        </div>

                        {/* Main Image */}
                        <div className="flex-1 bg-white rounded-[32px] relative flex items-center justify-center border border-[#f5eadb] shadow-[0_8px_40px_rgba(0,0,0,0.03)] group overflow-hidden aspect-square">
                            {/* Ambient Glow */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#cf7e28]/[0.02] to-transparent pointer-events-none"></div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-[#cf7e28]/5 rounded-full blur-[80px] pointer-events-none"></div>
                            
                            <img 
                                src={images[selectedImage]} 
                                alt={product.name} 
                                className="absolute inset-0 w-full h-full object-cover mix-blend-multiply drop-shadow-2xl group-hover:scale-105 transition-transform duration-700 ease-out z-10" 
                            />

                            {/* Mobile Thumbnails */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex md:hidden gap-2 bg-white/80 backdrop-blur-md px-3 py-2 rounded-full border border-gray-100 shadow-sm z-20">
                                {images.map((_, idx) => (
                                    <button 
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                            selectedImage === idx ? 'bg-[#cf7e28] w-4' : 'bg-gray-300'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="w-full lg:w-[35%] flex flex-col pt-2">
                        <h1 className="text-3xl md:text-[34px] font-bold text-[#1c1c1c] mb-2 leading-tight tracking-tight">{product.name}</h1>
                        
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={14} className="text-[#fbb72c] fill-current" />
                                ))}
                            </div>
                            <span className="text-[13px] font-bold text-gray-500">(4.8)</span>
                            <div className="w-[1px] h-3 bg-gray-300"></div>
                            <span className="text-[13px] text-gray-500">256 Reviews</span>
                            <div className="w-[1px] h-3 bg-gray-300"></div>
                            <button className="text-[13px] font-bold text-gray-600 hover:text-[#cf7e28]">Add Your Review</button>
                        </div>

                        <div className="flex items-end gap-3 mb-1">
                            <span className="text-3xl font-black text-[#1c1c1c]">₹{product.price * quantity}</span>
                            <span className="text-lg font-bold text-gray-400 line-through mb-1">₹{originalPrice * quantity}</span>
                            <span className="text-sm font-bold text-[#cf7e28] mb-1.5">{discount}% OFF</span>
                        </div>
                        <p className="text-[11px] text-gray-500 font-medium mb-6">Inclusive of all taxes</p>

                        {product.bulletPoints && product.bulletPoints.length > 0 && (
                            <ul className="flex flex-col gap-2.5 mb-8">
                                {product.bulletPoints.map((bullet, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-[14px] text-gray-700 font-medium">
                                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 flex-shrink-0"></div>
                                        {bullet}
                                    </li>
                                ))}
                            </ul>
                        )}

                        {product.sizes && product.sizes.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-[14px] font-bold text-[#1c1c1c] mb-3">Size</h3>
                                <div className="flex flex-wrap gap-3">
                                    {product.sizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`px-4 py-2 rounded-lg text-[13px] font-bold border transition-colors ${
                                                selectedSize === size 
                                                ? 'bg-[#c18641] text-white border-[#c18641]' 
                                                : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="mb-8">
                            <h3 className="text-[14px] font-bold text-[#1c1c1c] mb-3">Quantity</h3>
                            <div className="inline-flex items-center border border-gray-200 rounded-lg h-10 w-32">
                                <button 
                                    className="w-10 flex items-center justify-center text-gray-500 hover:text-black transition-colors"
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                >
                                    <Minus size={16} />
                                </button>
                                <div className="flex-1 text-center font-bold text-[14px] text-gray-800 border-x border-gray-200">{quantity}</div>
                                <button 
                                    className="w-10 flex items-center justify-center text-gray-500 hover:text-black transition-colors"
                                    onClick={() => setQuantity(quantity + 1)}
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 mb-6">
                            <button 
                                onClick={handleAddToCart}
                                className="flex-1 bg-[#c18641] hover:bg-[#a87438] text-white font-bold py-3.5 rounded-xl shadow-sm transition-all"
                            >
                                Add to Cart
                            </button>
                            <button onClick={handleBuyNow} className="flex-1 bg-white hover:bg-gray-50 text-[#1c1c1c] border-2 border-gray-200 font-bold py-3 rounded-xl transition-all">
                                Buy Now
                            </button>
                        </div>

                        <div className="flex items-center gap-6 text-[14px] font-bold text-gray-600">
                            <button 
                                onClick={() => toggleWishlist(product)}
                                className={`flex items-center gap-2 hover:text-[#c18641] transition-colors ${isInWishlist(product?._id || product?.id) ? 'text-[#c18641]' : ''}`}
                            >
                                <Heart size={18} className={isInWishlist(product?._id || product?.id) ? 'fill-current' : ''} /> 
                                {isInWishlist(product?._id || product?.id) ? 'Added to Wishlist' : 'Wishlist'}
                            </button>
                            <button className="flex items-center gap-2 hover:text-[#c18641] transition-colors">
                                <Share2 size={18} /> Share
                            </button>
                        </div>
                    </div>

                    <div className="w-full lg:w-[20%] flex flex-col gap-6">

                        <div className="bg-[#fcfaf6] rounded-[16px] p-5 border border-[#f5eadb]/80 flex flex-col gap-4">
                            <div className="flex items-center gap-3 text-[13px] font-bold text-gray-700">
                                <RotateCcw size={18} className="text-[#c18641]" />
                                7 Days Easy Returns
                            </div>
                            <div className="flex items-center gap-3 text-[13px] font-bold text-gray-700">
                                <CreditCard size={18} className="text-[#c18641]" />
                                Cash on Delivery
                            </div>
                            <div className="flex items-center gap-3 text-[13px] font-bold text-gray-700">
                                <ShieldCheck size={18} className="text-[#c18641]" />
                                Secure Payment
                            </div>
                            <div className="flex items-center gap-3 text-[13px] font-bold text-gray-700">
                                <CheckCircle2 size={18} className="text-[#c18641]" />
                                1 Year Quality Warranty
                            </div>
                        </div>
                    </div>

                </div>

                {relatedProducts.length > 0 && (
                    <div className="mt-24">
                        <h2 className="text-2xl font-bold text-[#1c1c1c] mb-8 text-center">You May Also Like</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
                            {relatedProducts.map(relProduct => (
                                <Link 
                                    key={relProduct._id} 
                                    to={`/product/${relProduct.slug || relProduct._id}`}
                                    className="bg-white rounded-[16px] overflow-hidden border border-gray-100 flex flex-col group transition-shadow hover:shadow-md"
                                >
                                    <div className="relative aspect-square bg-[#fbf9f6] flex items-center justify-center overflow-hidden p-4">
                                        <img
                                            src={relProduct.images && relProduct.images[0] ? encodeURI(relProduct.images[0]) : 'https://via.placeholder.com/300'}
                                            alt={relProduct.name}
                                            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500 drop-shadow-md"
                                        />
                                    </div>
                                    <div className="p-4 flex flex-col flex-1">
                                        <h3 className="text-[14px] font-bold text-[#1c1c1c] leading-tight mb-2 line-clamp-1">{relProduct.name}</h3>
                                        <div className="flex items-baseline gap-2 mt-auto">
                                            <span className="text-[16px] font-black text-[#1c1c1c]">₹{relProduct.price}</span>
                                            <span className="text-[12px] font-bold text-gray-400 line-through">₹{relProduct.price + 500}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default ProductDetails;
