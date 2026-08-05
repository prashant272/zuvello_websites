import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Facebook, Instagram, Twitter, Youtube, MapPin, Phone, MessageCircle } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../api';

const Footer = () => {
    const [categories, setCategories] = useState([]);
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await axios.get(`${API_BASE_URL}/categories`);
                // limit to 5 for footer
                setCategories(data.slice(0, 5));
            } catch (error) {
                console.error("Error fetching categories for footer:", error);
            }
        };
        fetchCategories();
    }, []);

    const quickLinks = [
        { name: 'About Us', path: '/about' },
        { name: 'Contact Us', path: '/contact' },
        { name: 'FAQs', path: '/faqs' },
        { name: 'Track Order', path: '/my-orders' },
        { name: 'Returns & Refunds', path: '/return-policy' },
    ];

    const customerService = [
        { name: 'Shipping Policy', path: '/shipping-policy' },
        { name: 'Return Policy', path: '/return-policy' },
        { name: 'Terms & Conditions', path: '/terms' },
        { name: 'Privacy Policy', path: '/privacy' },
        { name: 'Help Center', path: '/help' },
    ];

    return (
        <footer className="w-full font-sans bg-white pt-8">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8">

                {/* Unified Footer Container matching screenshot design */}
                <div className="bg-[#fdf3f6] rounded-[30px] pt-10 pb-6 px-6 md:px-12 flex flex-col gap-10">

                    {/* TOP: Newsletter Section */}
                    <section aria-labelledby="newsletter-heading" className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-pink-100 pb-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0 border border-pink-50">
                                <Mail className="text-[#cf7e28]" strokeWidth={1.5} size={24} />
                            </div>
                            <div>
                                <h3 id="newsletter-heading" className="text-xl md:text-2xl font-bold text-[#483d36] mb-1">
                                    Join Our Zuvello Family! 🧸
                                </h3>
                                <p className="text-xs md:text-sm text-gray-600 font-medium">
                                    Get exclusive offers, new arrival alerts & more.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col w-full md:w-auto flex-1 max-w-lg">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    if (email) {
                                        setSubscribed(true);
                                        setEmail('');
                                        setTimeout(() => setSubscribed(false), 3000);
                                    }
                                }}
                                className="flex bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100"
                            >
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    aria-label="Email Address for Newsletter"
                                    className="flex-1 px-5 py-3 outline-none text-sm text-[#483d36] placeholder:text-gray-400"
                                />
                                <button
                                    type="submit"
                                    className="bg-[#cf7e28] hover:bg-[#b56e22] transition-colors text-white px-6 md:px-8 py-3 font-bold text-sm"
                                >
                                    Subscribe
                                </button>
                            </form>
                            {subscribed && (
                                <span className="text-green-600 text-xs font-bold mt-2 ml-2">Successfully Subscribed! 🎉</span>
                            )}
                        </div>
                    </section>

                    {/* MIDDLE: Links Grid */}
                    <nav aria-label="Footer Navigation" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 md:gap-4">

                        {/* 1. Brand & About */}
                        <section aria-labelledby="footer-brand" className="flex flex-col md:col-span-1 border-b md:border-b-0 md:border-r border-pink-100 pb-6 md:pb-0 pr-0 md:pr-4">
                            <Link to="/" className="flex flex-col items-start gap-3 mb-6">
                                <img src="/logo.png" alt="Zuvello Logo" className="h-24 md:h-28 object-contain rounded-full shadow-md border border-gray-100" />
                                <p className="text-[11px] md:text-[12px] font-black text-[#1c1c1c] uppercase tracking-wide ml-1">
                                    A Unit of Manasvi Enterprises
                                </p>
                            </Link>
                            <p className="text-xs text-gray-600 font-medium leading-relaxed mb-6">
                                Premium soft toys for kids and loved ones. Because every hug matters!
                            </p>
                            <nav aria-label="Social Media" className="flex items-center gap-3">
                                <a href="https://facebook.com/zuvello.in" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-7 h-7 rounded-full bg-pink-100 text-[#cf7e28] flex items-center justify-center hover:bg-[#cf7e28] hover:text-white transition-colors">
                                    <Facebook size={14} />
                                </a>
                                <a href="https://instagram.com/zuvello.in" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-7 h-7 rounded-full bg-pink-100 text-[#cf7e28] flex items-center justify-center hover:bg-[#cf7e28] hover:text-white transition-colors">
                                    <Instagram size={14} />
                                </a>
                                <a href="https://twitter.com/zuvello_in" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="w-7 h-7 rounded-full bg-pink-100 text-[#cf7e28] flex items-center justify-center hover:bg-[#cf7e28] hover:text-white transition-colors">
                                    <Twitter size={14} />
                                </a>
                                <a href="https://youtube.com/@zuvello" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-7 h-7 rounded-full bg-pink-100 text-[#cf7e28] flex items-center justify-center hover:bg-[#cf7e28] hover:text-white transition-colors">
                                    <Youtube size={14} />
                                </a>
                            </nav>
                        </section>

                        {/* 2. Quick Links */}
                        <section aria-labelledby="footer-quick-links" className="flex flex-col pl-0 md:pl-2">
                            <h4 id="footer-quick-links" className="text-sm font-bold text-[#483d36] mb-5">Quick Links</h4>
                            <ul className="flex flex-col gap-3">
                                {quickLinks.map(link => (
                                    <li key={link.name}>
                                        <Link to={link.path} className="text-xs font-medium text-gray-600 hover:text-[#cf7e28] transition-colors">{link.name}</Link>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        {/* 3. Customer Service */}
                        <section aria-labelledby="footer-customer-service" className="flex flex-col pl-0 md:pl-2">
                            <h4 id="footer-customer-service" className="text-sm font-bold text-[#483d36] mb-5">Customer Service</h4>
                            <ul className="flex flex-col gap-3">
                                {customerService.map(link => (
                                    <li key={link.name}>
                                        <Link to={link.path} className="text-xs font-medium text-gray-600 hover:text-[#cf7e28] transition-colors">{link.name}</Link>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        {/* 4. Categories */}
                        <section aria-labelledby="footer-categories" className="flex flex-col pl-0 md:pl-2 border-b md:border-b-0 md:border-r border-pink-100 pb-6 md:pb-0 pr-0 md:pr-4">
                            <h4 id="footer-categories" className="text-sm font-bold text-[#483d36] mb-5">Categories</h4>
                            <ul className="flex flex-col gap-3">
                                {categories.map(cat => (
                                    <li key={cat._id}>
                                        <Link to={`/shop?category=${cat.name}`} className="text-xs font-medium text-gray-600 hover:text-[#cf7e28] transition-colors">{cat.name}</Link>
                                    </li>
                                ))}
                                {categories.length === 0 && (
                                    <li className="text-xs font-medium text-gray-400">Loading...</li>
                                )}
                            </ul>
                        </section>

                        {/* 5. Contact Us */}
                        <address className="flex flex-col pl-0 md:pl-2 not-italic">
                            <h4 className="text-sm font-bold text-[#483d36] mb-5">Contact Us</h4>
                            <ul className="flex flex-col gap-4">
                                <li className="flex items-start gap-3">
                                    <Phone size={16} className="text-[#cf7e28] shrink-0 mt-1" />
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-[#cf7e28] uppercase tracking-wider mb-0.5">Proprietor</span>
                                        <span className="text-[12px] font-bold text-[#483d36]">Sachin : +91 8506847545</span>
                                        <span className="text-[12px] font-bold text-[#483d36]">Chaitanya : +91 8882727504</span>
                                    </div>
                                </li>
                                <li className="flex items-center gap-3">
                                    <MessageCircle size={16} className="text-[#cf7e28] shrink-0" />
                                    <a href="mailto:zuvello879@gmail.com" className="text-xs font-medium text-[#483d36] hover:text-[#cf7e28] transition-colors">zuvello879@gmail.com</a>
                                </li>
                                <li className="flex items-start gap-3">
                                    <MapPin size={16} className="text-[#cf7e28] shrink-0 mt-0.5" />
                                    <span className="text-xs font-medium text-[#483d36] leading-relaxed">
                                        N-16/A-2, Dilshad Garden,<br />Delhi-110095
                                    </span>
                                </li>
                            </ul>
                        </address>

                    </nav>

                    {/* BOTTOM: Copyright & Payment */}
                    <aside aria-label="Copyright and Payment Methods" className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t border-pink-100">
                        <small className="text-[11px] font-medium text-gray-500">
                            © {new Date().getFullYear()} Zuvello. All Rights Reserved.
                        </small>
                        <div className="flex items-center gap-3">
                            <div className="h-6 w-10 bg-white rounded flex items-center justify-center border border-gray-100 shadow-sm text-[10px] font-bold text-blue-900" aria-label="Visa">VISA</div>
                            <div className="h-6 w-10 bg-white rounded flex items-center justify-center border border-gray-100 shadow-sm" aria-label="Mastercard">
                                <div className="flex">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500 -ml-1"></div>
                                </div>
                            </div>
                            <div className="h-6 w-10 bg-white rounded flex items-center justify-center border border-gray-100 shadow-sm text-[10px] font-bold italic text-gray-700" aria-label="UPI">UPI</div>
                            <div className="h-6 w-10 bg-white rounded flex items-center justify-center border border-gray-100 shadow-sm text-[10px] font-bold text-blue-500" aria-label="Paytm">Paytm</div>
                        </div>
                    </aside>

                </div>
            </div>

            {/* Safe spacing at absolute bottom */}
            <div className="h-6 w-full bg-white"></div>
        </footer>
    );
};

export default Footer;