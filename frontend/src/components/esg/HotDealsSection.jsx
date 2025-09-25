'use client';

import { useState } from 'react';
import HotDealsCard from '../ui/HotDealsCard';

export default function HotDealsSection() {
  const [activeFilter, setActiveFilter] = useState('all');
  const allProducts = [
    {
      title: "Jute Bag | Originally Sourced",
      price: 89,
      originalPrice: 120,
      rating: 4.9,
      reviews: 524,
      tags: ["Staff Pick", "AveoEarth Certified"],
      discount: "-31%",
      imageUrl: "/hero1.png",
      category: "Home & Living"
    },
    {
      title: "Eco Bamboo Bottle",
      price: 45,
      originalPrice: 60,
      rating: 4.7,
      reviews: 312,
      tags: ["Best Seller", "AveoEarth Certified"],
      discount: "-25%",
      imageUrl: "/hero1.png",
      category: "Drinkware"
    },
    {
      title: "Organic Cotton Tote",
      price: 65,
      originalPrice: 85,
      rating: 4.8,
      reviews: 289,
      tags: ["Staff Pick", "Eco-Friendly"],
      discount: "-24%",
      imageUrl: "/hero1.png",
      category: "Fashion"
    },
    {
      title: "Recycled Paper Notebook",
      price: 35,
      originalPrice: 50,
      rating: 4.6,
      reviews: 156,
      tags: ["New Arrival", "AveoEarth Certified"],
      discount: "-30%",
      imageUrl: "/hero1.png",
      category: "Stationery"
    },
    {
      title: "Hemp Fiber Mat",
      price: 125,
      originalPrice: 180,
      rating: 4.9,
      reviews: 432,
      tags: ["Premium", "Staff Pick"],
      discount: "-31%",
      imageUrl: "/hero1.png",
      category: "Home & Living"
    },
    {
      title: "Cork Phone Case",
      price: 55,
      originalPrice: 75,
      rating: 4.5,
      reviews: 201,
      tags: ["Trending", "Eco-Friendly"],
      discount: "-27%",
      imageUrl: "/hero1.png",
      category: "Tech Accessories"
    },
    {
      title: "Organic Cotton T-Shirt",
      price: 85,
      originalPrice: 110,
      rating: 4.8,
      reviews: 289,
      tags: ["Organic", "Fashion"],
      discount: "-23%",
      imageUrl: "/hero1.png",
      category: "Fashion"
    },
    {
      title: "Bamboo Dinnerware Set",
      price: 145,
      originalPrice: 195,
      rating: 4.9,
      reviews: 156,
      tags: ["Premium", "Staff Pick"],
      discount: "-26%",
      imageUrl: "/hero1.png",
      category: "Home & Living"
    },
    {
      title: "Recycled Plastic Pen",
      price: 25,
      originalPrice: 35,
      rating: 4.6,
      reviews: 89,
      tags: ["Eco-Friendly", "Affordable"],
      discount: "-29%",
      imageUrl: "/hero1.png",
      category: "Stationery"
    },
    {
      title: "Steel Water Tumbler",
      price: 65,
      originalPrice: 85,
      rating: 4.7,
      reviews: 234,
      tags: ["Durable", "Best Seller"],
      discount: "-24%",
      imageUrl: "/hero1.png",
      category: "Drinkware"
    },
    {
      title: "Wireless Charging Pad",
      price: 95,
      originalPrice: 125,
      rating: 4.5,
      reviews: 167,
      tags: ["Tech", "Wireless"],
      discount: "-24%",
      imageUrl: "/hero1.png",
      category: "Tech Accessories"
    },
    {
      title: "Linen Throw Pillow",
      price: 75,
      originalPrice: 100,
      rating: 4.8,
      reviews: 198,
      tags: ["Comfort", "Natural"],
      discount: "-25%",
      imageUrl: "/hero1.png",
      category: "Home & Living"
    }
  ];

  const categories = ['all', 'Home & Living', 'Fashion', 'Drinkware', 'Stationery', 'Tech Accessories'];

  const filteredProducts = activeFilter === 'all' 
    ? allProducts 
    : allProducts.filter(product => product.category === activeFilter);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Home & Living': '🏠',
      'Fashion': '👗',
      'Drinkware': '🥤',
      'Stationery': '📝',
      'Tech Accessories': '📱'
    };
    return icons[category] || '🌱';
  };

  return (
    <section className="relative w-full py-12 sm:py-20 bg-gradient-to-br from-[#f8f6f4] via-[#e8e4e1] to-[#ddd7d2] overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-40 h-40 bg-eco-gradient/10 rounded-full animate-blob"></div>
        <div className="absolute bottom-32 right-16 w-32 h-32 bg-eco-gradient/5 rounded-full animate-float" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-eco-gradient/15 rounded-full animate-blob" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center mb-12 sm:mb-16 space-y-6 animate-slide-in-up">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-eco-gradient/20 rounded-full flex items-center justify-center animate-pulse-glow">
              <span className="text-3xl animate-float">🔥</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="font-reem font-bold text-4xl sm:text-5xl lg:text-6xl text-[#1a4032] animate-gradient">
              Hot Deals
            </h2>
            <div className="w-24 h-1 bg-eco-gradient rounded-full mx-auto animate-shimmer"></div>
            <p className="font-poppins text-lg sm:text-xl text-[#52494a] max-w-2xl mx-auto leading-relaxed">
              Discover amazing eco-friendly products at unbeatable prices
            </p>
          </div>

        </div>

        <div className="flex flex-col items-center space-y-6 mb-8 sm:mb-12 animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-4 text-[#1a4032]">
            <div className="h-px bg-eco-gradient flex-1 max-w-20"></div>
            <span className="font-poppins font-medium text-lg">Filter by Category</span>
            <div className="h-px bg-eco-gradient flex-1 max-w-20"></div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleFilterChange(category)}
                className={`px-4 py-2 rounded-full font-poppins font-medium text-sm transition-all duration-300 hover-lift ${
                  activeFilter === category
                    ? 'bg-eco-gradient text-white shadow-lg scale-105'
                    : 'bg-white/80 text-[#1a4032] hover:bg-white hover:shadow-md border border-gray-200'
                }`}
              >
                {category === 'all' ? '🌟 All Products' : `${getCategoryIcon(category)} ${category}`}
              </button>
            ))}
          </div>
          
          <div className="text-center">
            <span className="text-[#52494a] font-poppins text-sm">
              Showing {filteredProducts.length} products
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 lg:gap-8 animate-slide-in-up min-h-[400px]" style={{ animationDelay: '0.3s' }}>
          {filteredProducts.map((product, index) => (
            <div 
              key={`${activeFilter}-${index}`}
              className="animate-slide-in-up hover-lift" 
              style={{ animationDelay: `${0.5 + index * 0.1}s` }}
            >
              <HotDealsCard 
                {...product}
                index={index}
                totalCards={filteredProducts.length}
              />
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center animate-slide-in-up">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl text-gray-400">🔍</span>
            </div>
            <h3 className="font-reem font-semibold text-xl text-[#1a4032] mb-2">No products found</h3>
            <p className="text-[#52494a] font-poppins">Try selecting a different category or check back later for new deals!</p>
          </div>
        )}

        <div className="flex justify-center mt-12 sm:mt-16 animate-slide-in-up" style={{ animationDelay: '1.2s' }}>
          <button 
            onClick={() => window.location.href = '/explore'}
            className="group relative bg-black hover:bg-gray-800 text-white px-8 py-4 rounded-full font-poppins font-semibold text-lg hover-lift shadow-lg overflow-hidden transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
            <div className="relative flex items-center gap-3">
              <span>🛍️</span>
              <span>View All Hot Deals</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}
