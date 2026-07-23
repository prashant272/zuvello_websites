import React from 'react';
import Hero from '../components/Hero';
import Categories from '../components/categories';
import TrustBadges from '../components/home/TrustBadges';
import NewArrivals from '../components/home/NewArrivals';
import BestSellers from '../components/home/BestSellers';
import InstagramFeed from '../components/home/InstagramFeed';
import PromoBanners from '../components/home/PromoBanners';
import SEO from '../components/SEO';

const Home = () => {
  return (
    <main className="bg-white min-h-screen">
      <SEO title="Home" />
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Shop by Category */}
      <Categories />
      <TrustBadges />

      {/* 3. New Arrivals */}
      <NewArrivals />

      {/* 4. Best Sellers Section */}
      <BestSellers />

      {/* 5. Instagram Feed */}
      <InstagramFeed />

      {/* 6. Promo Banners & Features */}
      <PromoBanners />
    </main>
  );
};

export default Home;
