import React, { useRef } from 'react';
import { Heart, ArrowRight, Play, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

// Dummy data for Instagram Feed
const instagramPosts = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=400&q=80',
    title: 'Cutest BFF\nForever 💞',
    link: 'https://instagram.com',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1585644781431-778832a82989?auto=format&fit=crop&w=400&q=80',
    title: 'Cuddle Time\nIs Happy Time',
    link: 'https://instagram.com',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1557313885-48b4e758a623?auto=format&fit=crop&w=400&q=80',
    title: "Softness You'll\nFall in Love 🌙",
    link: 'https://instagram.com',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1533000755675-9252327494ce?auto=format&fit=crop&w=400&q=80',
    title: 'Magical\nUnicorns ✨',
    link: 'https://instagram.com',
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1608889476561-6242cb816d12?auto=format&fit=crop&w=400&q=80',
    title: 'Perfect\nGift 🎁',
    link: 'https://instagram.com',
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1518717758536-f3af4d6faa6b?auto=format&fit=crop&w=400&q=80',
    title: 'Snuggle\nWeather ☁️',
    link: 'https://instagram.com',
  },
];

const InstagramFeed = () => {
  return (
    <section className="py-6 md:py-12 bg-white font-sans border-b border-gray-50">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 relative">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-xl md:text-[24px] font-extrabold text-[#1c1c1c] tracking-tight">
              Instagram Reels
            </h2>
            <Heart size={20} className="text-[#ef4c7f] fill-current" />
          </div>
          
          <a 
            href="https://instagram.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[13px] font-bold text-[#b58145] hover:text-[#9d6d36] transition-colors"
          >
            View All <ArrowRight size={14} strokeWidth={2.5} />
          </a>
        </div>

        {/* Instagram Scroll Area */}
        <div 
            className="flex overflow-x-auto gap-2 md:gap-4 pb-4 -mx-2 px-2 scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {instagramPosts.map((post) => (
            <InstaCard key={post.id} post={post} />
          ))}
        </div>

      </div>
    </section>
  );
};

// Separated into a sub-component to handle individual playback state on hover
const InstaCard = ({ post }) => {
  return (
    <a 
      href={post.link}
      target="_blank"
      rel="noopener noreferrer"
      className="w-[23%] md:w-[calc(100%/5-16px)] lg:w-[calc(100%/6-16px)] flex-none snap-start flex flex-col gap-2 group transform hover:-translate-y-1 transition-all duration-300"
    >
      <div className="relative w-full aspect-[9/16] rounded-[16px] md:rounded-[20px] overflow-hidden shadow-sm border border-gray-100">
        {/* Background Image (Thumbnail) */}
        <img
          src={post.image}
          alt="Instagram Post"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Top Left Icon (Insta Reels icon) */}
        <div className="absolute top-2 left-2 z-20 w-4 h-4 md:w-5 md:h-5 rounded-full border border-white/50 flex items-center justify-center bg-white/10 backdrop-blur-sm">
          <Instagram size={10} className="text-white md:w-3 md:h-3" />
        </div>

        {/* Top Right Icon (Heart) */}
        <div className="absolute top-2 right-2 z-20 w-4 h-4 md:w-5 md:h-5 rounded-full border border-white/50 flex items-center justify-center bg-white/10 backdrop-blur-sm">
          <Heart size={10} className="text-white md:w-3 md:h-3" />
        </div>

        {/* Center Play Button */}
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <div className="w-8 h-8 md:w-12 md:h-12 bg-white/95 rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
            <Play size={14} className="text-[#1c1c1c] ml-0.5 md:w-5 md:h-5 md:ml-1" fill="currentColor" />
          </div>
        </div>
      </div>

      {/* Bottom Text */}
      <div className="px-0.5">
        <h4 className="text-[9px] sm:text-[11px] md:text-[13px] font-bold text-[#1c1c1c] leading-snug whitespace-pre-line">
          {post.title}
        </h4>
      </div>
    </a>
  );
};

export default InstagramFeed;
