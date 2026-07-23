import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description, name, type, image }) {
  const brandName = "Zuvello";
  const defaultTitle = `${brandName} | Premium Plushies, Toys & E-commerce Store`;
  const defaultDescription = `Shop the best premium plushies, teddy bears, and toys at ${brandName}. Discover new arrivals, best sellers, and exclusive combo offers. Buy online now!`;
  const defaultImage = `https://zuvello.com/combo_plushies.png`;
  const defaultType = 'website';

  const seoTitle = (title && title !== 'Home') ? `${title} | ${brandName}` : defaultTitle;
  const seoDescription = description || defaultDescription;
  const seoImage = image || defaultImage;
  const seoType = type || defaultType;

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{seoTitle}</title>
      <meta name='description' content={seoDescription} />
      
      {/* OpenGraph tags */}
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:type" content={seoType} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:site_name" content={brandName} />

      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />
    </Helmet>
  );
}
