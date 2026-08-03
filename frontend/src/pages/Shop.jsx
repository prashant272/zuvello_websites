import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Heart, Star, ChevronDown, ChevronRight, Filter, ChevronLeft } from 'lucide-react';
import { API_BASE_URL } from '../api';
import { useCart } from '../contexts/CartContext';
import teddyBanner from '../assets/teddy_banner1.png';
import SEO from '../components/SEO';

const ShopProductCard = ({ product }) => {
    const { _id, slug, name, price, images, rating = 4.8 } = product;
    const { addToCart } = useCart();

    // Simulate original price & discount
    const originalPrice = price === 699 ? 1299 : price === 698 ? 1299 : price + Math.floor(price * 0.86);
    const discount = Math.round(((originalPrice - price) / originalPrice) * 100);

    return (
        <div className="bg-white rounded-[16px] overflow-hidden border border-gray-100 flex flex-col group transition-shadow hover:shadow-md h-full">
            <div className="relative h-44 bg-[#fbf9f6] flex items-center justify-center overflow-hidden">
                <button className="absolute top-3 right-3 text-gray-400 hover:text-red-500 z-10 p-1.5 bg-white/50 rounded-full backdrop-blur-sm">
                    <Heart size={16} />
                </button>
                <Link to={`/product/${slug || _id}`} className="w-full h-full relative block overflow-hidden rounded-t-[16px]">
                    <img
                        src={images && images[0] ? encodeURI(images[0]) : 'https://via.placeholder.com/300'}
                        alt={name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                </Link>
            </div>

            <div className="p-4 flex flex-col gap-2 flex-1 bg-white">
                <Link to={`/product/${slug || _id}`}>
                    <h3 className="font-bold text-[#1c1c1c] text-sm md:text-[15px] leading-tight line-clamp-1">{name}</h3>
                </Link>

                <div className="flex items-center gap-1">
                    <Star size={12} className="text-[#cf7e28] fill-current" />
                    <Star size={12} className="text-[#cf7e28] fill-current" />
                    <Star size={12} className="text-[#cf7e28] fill-current" />
                    <Star size={12} className="text-[#cf7e28] fill-current" />
                    <Star size={12} className="text-[#cf7e28] fill-current" />
                    <span className="text-[11px] text-gray-400 ml-1">({rating})</span>
                </div>

                <div className="flex flex-col mt-auto pt-2 gap-3">
                    <div className="flex items-baseline gap-2">
                        <span className="text-lg font-black text-[#1c1c1c]">₹{price}</span>
                        <span className="text-xs font-bold text-gray-400 line-through">₹{originalPrice}</span>
                        <span className="text-xs font-bold text-[#cf7e28] ml-auto">{discount}% OFF</span>
                    </div>
                    <button
                        onClick={() => addToCart(product)}
                        className="w-full bg-black hover:bg-gray-800 text-white font-bold py-2 rounded-lg text-xs transition-colors"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categoriesList, setCategoriesList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [priceRange, setPriceRange] = useState(5999);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 8;

    // Filters state
    const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
    const [selectedAges, setSelectedAges] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState([]);

    const location = useLocation();
    const navigate = useNavigate();

    const searchParams = new URLSearchParams(location.search);
    const selectedCategory = searchParams.get('category') || 'All';
    const searchQuery = searchParams.get('search') || '';

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [productsRes, categoriesRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/products`),
                    axios.get(`${API_BASE_URL}/categories`)
                ]);

                setProducts(productsRes.data);
                setFilteredProducts(productsRes.data);

                if (categoriesRes.data && Array.isArray(categoriesRes.data)) {
                    setCategoriesList(categoriesRes.data.map(cat => cat.name));
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    const priceFilters = ['Under ₹500', '₹500 - ₹1000', '₹1000 - ₹2000', '₹2000 - ₹5000', 'Above ₹5000'];
    const ageFilters = ['0-2 Years', '3-5 Years', '6-10 Years', '10+ Years'];
    const sizeFilters = ['Small (0-20 cm)', 'Medium (20-40 cm)', 'Large (40-60 cm)', 'Extra Large (60 cm+)'];

    // Handle Checkbox toggles
    const handleToggle = (setter, state, value) => {
        setter(state.includes(value) ? state.filter(i => i !== value) : [...state, value]);
    };

    // Apply all filters
    useEffect(() => {
        let updated = [...products];

        // Search query filter
        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            updated = updated.filter(p =>
                p.name.toLowerCase().includes(lowerQuery) ||
                (p.description && p.description.toLowerCase().includes(lowerQuery))
            );
        }

        // Category filter
        if (selectedCategory !== 'All') {
            updated = updated.filter(p => p.category?.toLowerCase() === selectedCategory.toLowerCase());
        }

        if (selectedPriceRanges.length > 0) {
            updated = updated.filter(p => {
                return selectedPriceRanges.some(range => {
                    if (range === 'Under ₹500') return p.price < 500;
                    if (range === '₹500 - ₹1000') return p.price >= 500 && p.price <= 1000;
                    if (range === '₹1000 - ₹2000') return p.price >= 1000 && p.price <= 2000;
                    if (range === '₹2000 - ₹5000') return p.price >= 2000 && p.price <= 5000;
                    if (range === 'Above ₹5000') return p.price > 5000;
                    return false;
                });
            });
        }

        if (selectedAges.length > 0) {
            updated = updated.filter(p => p.ageGroup && selectedAges.includes(p.ageGroup));
        }

        // For sizes, map front-end labels to backend values simply, or just check string includes
        if (selectedSizes.length > 0) {
            updated = updated.filter(p => {
                if (!p.size) return false;
                return selectedSizes.some(s => s.toLowerCase().includes(p.size.toLowerCase()));
            });
        }

        // Apply slider filter
        updated = updated.filter(p => p.price <= priceRange);

        setFilteredProducts(updated);
        setCurrentPage(1); // Reset page to 1 when filters change
    }, [products, selectedCategory, searchQuery, selectedPriceRanges, selectedAges, selectedSizes, priceRange]);

    // Calculate pagination slices
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const handleCategoryClick = (cat) => {
        const params = new URLSearchParams(location.search);
        if (cat === 'All') {
            params.delete('category');
        } else {
            params.set('category', cat);
        }
        navigate(`/shop?${params.toString()}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fdfdfc]">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#b58145] border-t-transparent"></div>
            </div>
        );
    }

    const itemListSchema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": currentProducts.map((product, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "url": `https://www.zuvello.in/product/${product.slug || product._id}`
        }))
    };

    const collectionSchema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "Shop All Premium Plushies",
        "description": "Browse Zuvello's full collection of soft toys, teddy bears, and premium plushies.",
        "url": "https://www.zuvello.in/shop"
    };

    return (
        <div className="bg-[#fdfdfc] min-h-screen pt-8 pb-20 font-sans">
            <SEO
                title="Shop All Premium Plushies"
                description="Browse Zuvello's full collection of soft toys, teddy bears, and premium plushies."
                schema={[collectionSchema, itemListSchema]}
            />
            <div className="max-w-[1400px] mx-auto px-4 md:px-8">

                {/* Breadcrumb */}
                <div className="text-[13px] text-gray-500 mb-6 flex items-center gap-2 font-medium">
                    <Link to="/" className="hover:text-[#b58145]">Home</Link>
                    <ChevronRight size={12} />
                    <span className="text-[#1c1c1c]">Shop</span>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Left Sidebar */}
                    <aside className="w-full lg:w-[260px] flex-shrink-0 space-y-8">

                        {/* Categories Box */}
                        <div className="bg-[#fcfaf7] rounded-2xl p-6 border border-[#f0ebe1]">
                            <h3 className="font-extrabold text-[15px] text-[#1c1c1c] mb-4">Categories</h3>
                            <ul className="space-y-3">
                                <li
                                    onClick={() => handleCategoryClick('All')}
                                    className={`cursor-pointer text-[14px] transition-colors ${selectedCategory === 'All' ? 'text-black font-extrabold' : 'text-gray-700 font-bold hover:text-black'}`}
                                >
                                    All Categories
                                </li>
                                {categoriesList.map(cat => (
                                    <li
                                        key={cat}
                                        onClick={() => handleCategoryClick(cat)}
                                        className={`cursor-pointer text-[14px] transition-colors ${selectedCategory === cat ? 'text-black font-extrabold' : 'text-gray-700 font-bold hover:text-black'}`}
                                    >
                                        {cat}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Filter Section */}
                        <div className="bg-[#fcfaf7] rounded-2xl p-6 border border-[#f0ebe1]">
                            <h3 className="font-extrabold text-[15px] text-[#1c1c1c] mb-6">Filter By</h3>

                            {/* Price Filter */}
                            <div className="mb-8">
                                <div className="flex justify-between items-center mb-3 cursor-pointer">
                                    <h4 className="font-bold text-[13px] text-[#1c1c1c]">Price</h4>
                                    <ChevronDown size={14} className="text-[#b58145]" />
                                </div>
                                <div className="space-y-2.5">
                                    {priceFilters.map(filter => (
                                        <label key={filter} className="flex items-center gap-3 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 rounded border-gray-400 text-black focus:ring-black accent-black"
                                                checked={selectedPriceRanges.includes(filter)}
                                                onChange={() => handleToggle(setSelectedPriceRanges, selectedPriceRanges, filter)}
                                            />
                                            <span className="text-[14px] text-gray-800 font-bold group-hover:text-black">{filter}</span>
                                        </label>
                                    ))}
                                </div>

                                <div className="mt-6">
                                    <input
                                        type="range"
                                        min="199" max="5999"
                                        value={priceRange}
                                        onChange={(e) => setPriceRange(e.target.value)}
                                        className="w-full h-1.5 bg-[#e5dfd5] rounded-lg appearance-none cursor-pointer accent-[#b58145]"
                                    />
                                    <div className="flex justify-between text-[11px] font-bold text-gray-800 mt-2">
                                        <span>₹199</span>
                                        <span>₹5999</span>
                                    </div>
                                </div>
                            </div>

                            {/* Age Filter */}
                            <div className="mb-8">
                                <div className="flex justify-between items-center mb-3 cursor-pointer">
                                    <h4 className="font-bold text-[13px] text-[#1c1c1c]">Age</h4>
                                    <ChevronDown size={14} className="text-[#b58145]" />
                                </div>
                                <div className="space-y-2.5">
                                    {ageFilters.map(filter => (
                                        <label key={filter} className="flex items-center gap-3 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 rounded border-gray-400 text-black focus:ring-black accent-black"
                                                checked={selectedAges.includes(filter)}
                                                onChange={() => handleToggle(setSelectedAges, selectedAges, filter)}
                                            />
                                            <span className="text-[14px] text-gray-800 font-bold group-hover:text-black">{filter}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Size Filter */}
                            <div>
                                <div className="flex justify-between items-center mb-3 cursor-pointer">
                                    <h4 className="font-bold text-[13px] text-[#1c1c1c]">Size</h4>
                                    <ChevronDown size={14} className="text-[#b58145]" />
                                </div>
                                <div className="space-y-2.5">
                                    {sizeFilters.map(filter => (
                                        <label key={filter} className="flex items-center gap-3 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 rounded border-gray-400 text-black focus:ring-black accent-black"
                                                checked={selectedSizes.includes(filter)}
                                                onChange={() => handleToggle(setSelectedSizes, selectedSizes, filter)}
                                            />
                                            <span className="text-[14px] text-gray-800 font-bold group-hover:text-black">{filter}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </aside>

                    {/* Right Content */}
                    <div className="flex-1 flex flex-col gap-6">

                        {/* Banner */}
                        <div className="bg-[#f9ecd8] rounded-[24px] overflow-hidden flex flex-col md:flex-row relative h-auto md:h-[280px]">
                            <div className="p-8 md:p-12 flex-1 flex flex-col justify-center z-10">
                                <span className="text-black font-extrabold text-sm md:text-[15px] mb-2 tracking-wider uppercase">Soft Toys That Bring</span>
                                <h2 className="font-serif text-3xl md:text-[42px] font-black text-black leading-tight mb-4">
                                    Happiness Home
                                </h2>
                                <p className="text-black font-black text-[15px] tracking-widest mb-6 uppercase">UP TO 40% OFF</p>
                                <div>
                                    <button className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-xl font-bold text-sm transition-colors shadow-lg">
                                        Shop Now
                                    </button>
                                </div>
                            </div>
                            <div className="w-full md:w-[45%] h-[200px] md:h-full relative overflow-hidden flex items-end justify-center md:justify-end pr-0 md:pr-8">
                                <img src={teddyBanner} alt="Teddy Bear Banner" className="h-full object-cover mix-blend-multiply drop-shadow-2xl translate-y-6 md:translate-y-12" />
                            </div>
                        </div>

                        {/* Top Bar */}
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 py-2">
                            <p className="text-[13px] font-medium text-gray-500">
                                Showing {filteredProducts.length > 0 ? indexOfFirstProduct + 1 : 0} - {Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} products
                            </p>
                            <div className="flex items-center gap-2">
                                <span className="text-[13px] font-medium text-gray-500">Sort by:</span>
                                <div className="relative">
                                    <select className="appearance-none bg-white border border-[#f0ebe1] rounded-lg pl-4 pr-8 py-2 text-[13px] font-bold text-[#1c1c1c] focus:outline-none focus:border-[#b58145] cursor-pointer">
                                        <option>Popularity</option>
                                        <option>Price: Low to High</option>
                                        <option>Price: High to Low</option>
                                        <option>Newest First</option>
                                    </select>
                                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#b58145] pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {/* Product Grid */}
                        {filteredProducts.length === 0 ? (
                            <div className="bg-white rounded-2xl p-16 text-center border border-gray-100 mt-4 shadow-sm flex flex-col items-center justify-center">
                                <p className="text-gray-500 font-medium text-[15px]">No products match your filters.</p>
                                <button
                                    onClick={() => {
                                        navigate('/shop');
                                        setSelectedPriceRanges([]);
                                        setSelectedAges([]);
                                        setSelectedSizes([]);
                                        setPriceRange(5999);
                                    }}
                                    className="mt-4 text-[#b58145] font-bold hover:underline"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                                    {currentProducts.map(product => (
                                        <ShopProductCard key={product._id} product={product} />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex justify-center items-center gap-2 mt-12 mb-8">
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                            className="w-8 h-8 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 flex items-center justify-center font-bold text-xs shadow-sm disabled:opacity-50"
                                        >
                                            <ChevronLeft size={14} />
                                        </button>

                                        {[...Array(totalPages)].map((_, i) => (
                                            <button
                                                key={i + 1}
                                                onClick={() => setCurrentPage(i + 1)}
                                                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-sm ${currentPage === i + 1 ? 'bg-black text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}

                                        <button
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                            className="w-8 h-8 rounded-full bg-white border border-gray-200 text-black hover:bg-[#fcfaf7] flex items-center justify-center shadow-sm disabled:opacity-50"
                                        >
                                            <ChevronRight size={14} />
                                        </button>
                                    </div>
                                )}
                            </>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Shop;