import React, { useState, useMemo } from 'react';
import { 
  Filter, 
  Star, 
  Heart, 
  ShoppingCart, 
  Leaf, 
  SlidersHorizontal,
  Grid3X3,
  LayoutList,
  ChevronDown,
  Search
} from 'lucide-react';
import { Link } from 'react-router-dom';

// --- CUSTOM COLORS & STYLES (Tailwind Configuration) ---
const customColors = {
  forest: '#047857', // Primary Dark Green
  moss: '#34d399', // Secondary Light Green
  charcoal: '#1f2937', // Dark Grey (Muted Foreground)
  background: '#f9fafb', // Light Background
  border: '#d1d5db',
  accent: '#fde047',
  clay: '#b91c1c', // Used for badge/alerts
  'primary-foreground': 'white',
  'muted-foreground': '#4b5563', // A darker gray
};

const formatPrice = (price) => `₹${price.toLocaleString('en-IN')}`;

// --- CATEGORIES & MOCK DATA ---
const categories = {
  'all': 'Explore All Products', 
  'zerowaste': 'Zero Waste Essentials',
  'fashion': 'Sustainable Fashion',
  'upcycled': 'Upcycled & Repurposed',
  'beauty': 'Conscious Beauty',
  'green-tech': 'Green Technology'
};

const mockProducts = [
  { id: 1, name: "Bamboo Kitchen Utensil Set", price: 1299, originalPrice: 1899, image: "https://placehold.co/300x200/e9d5ff/4c1d95?text=Bamboo", rating: 4.8, reviews: 234, ecoScore: "95%", badges: ["Zero Waste", "Renewable"], category: "zerowaste" },
  { id: 2, name: "Organic Cotton Bedsheet Set", price: 2999, originalPrice: 4499, image: "https://placehold.co/300x200/99f6e4/042f2e?text=Cotton+Bedding", rating: 4.9, reviews: 456, ecoScore: "92%", badges: ["Organic", "Fair Trade"], category: "fashion" },
  { id: 3, name: "Hemp Yoga Mat", price: 2199, originalPrice: 2899, image: "https://placehold.co/300x200/a7f3d0/065f46?text=Hemp+Mat", rating: 4.7, reviews: 189, ecoScore: "94%", badges: ["Natural", "Biodegradable"], category: "zerowaste" },
  { id: 4, name: "Recycled PET Water Bottle", price: 499, originalPrice: 799, image: "https://placehold.co/300x200/bae6fd/0369a1?text=Recycled+Bottle", rating: 4.6, reviews: 567, ecoScore: "89%", badges: ["Recycled", "BPA Free"], category: "zerowaste" },
  { id: 5, name: "Linen Trousers - Earth Dye", price: 1899, originalPrice: 2499, image: "https://placehold.co/300x200/fecaca/991b1b?text=Linen+Pants", rating: 4.6, reviews: 567, ecoScore: "89%", badges: ["Organic", "Fair Trade"], category: "fashion" },
  { id: 6, name: "Natural Face Serum", price: 1599, originalPrice: 2199, image: "https://placehold.co/300x200/fce7f3/9d174d?text=Vegan+Serum", rating: 4.9, reviews: 345, ecoScore: "96%", badges: ["Cruelty-Free", "Vegan"], category: "beauty" },
  { id: 7, name: "Organic Quinoa 1kg", price: 649, originalPrice: 849, image: "https://placehold.co/300x200/ffedd5/9a3412?text=Quinoa", rating: 4.8, reviews: 123, ecoScore: "93%", badges: ["Certified Organic", "Gluten-Free"], category: "zerowaste" },
  { id: 8, name: "Upcycled Denim Tote Bag", price: 999, originalPrice: 1499, image: "https://placehold.co/300x200/bfdbfe/1e3a8a?text=Denim+Tote", rating: 4.7, reviews: 112, ecoScore: "90%", badges: ["Upcycled", "Handmade"], category: "upcycled" },
  { id: 9, name: "Refillable Toothpaste Tablets", price: 599, originalPrice: 799, image: "https://placehold.co/300x200/ccfbf1/0f766e?text=Toothpaste", rating: 4.8, reviews: 401, ecoScore: "98%", badges: ["Zero Waste", "Plastic-Free"], category: "zerowaste" },
  { id: 10, name: "Vintage Silk Scarf Dress", price: 4500, originalPrice: 5500, image: "https://placehold.co/300x200/fef3c7/a16207?text=Vintage+Dress", rating: 4.9, reviews: 55, ecoScore: "88%", badges: ["Upcycled", "Unique"], category: "upcycled" },
  { id: 11, name: "Solid Shampoo Bar - Citrus", price: 449, originalPrice: 699, image: "https://placehold.co/300x200/f0f9ff/0c4a6e?text=Shampoo+Bar", rating: 4.7, reviews: 290, ecoScore: "97%", badges: ["Palm-Oil Free", "Vegan"], category: "beauty" },
  { id: 12, name: "Modular Desk Lamp - Bamboo/LED", price: 5999, originalPrice: 7500, image: "https://placehold.co/300x200/f5d0fe/701a75?text=LED+Lamp", rating: 4.4, reviews: 42, ecoScore: "87%", badges: ["Low Energy", "Durable"], category: "green-tech" },
  { id: 13, name: "Fair Trade Alpaca Sweater", price: 6999, originalPrice: 9500, image: "https://placehold.co/300x200/fefce8/78350f?text=Alpaca+Sweater", rating: 4.5, reviews: 67, ecoScore: "91%", badges: ["Ethical", "Natural Fiber"], category: "fashion" },
];

// --- UI COMPONENTS ---
const Button = ({ children, onClick = () => {}, variant = 'default', size = 'md', className = '' }) => {
  let baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  // Custom Sizing
  if (size === 'sm') baseClasses += ' px-3 py-1 text-sm h-9';
  else if (size === 'md') baseClasses += ' px-4 py-2 h-10';
  else if (size === 'lg') baseClasses += ' px-6 py-3 text-lg h-12';

  // Custom Variants (Matching old file & new header's intent)
  if (variant === 'default') baseClasses += ` bg-forest text-primary-foreground hover:bg-opacity-90 active:bg-opacity-80 focus:ring-forest shadow-md`;
  else if (variant === 'outline') baseClasses += ` border border-forest text-forest bg-transparent hover:bg-forest/5 focus:ring-forest`;
  else if (variant === 'secondary' || className.includes('btn-secondary')) baseClasses += ` bg-moss text-charcoal hover:bg-opacity-90 active:bg-opacity-80 focus:ring-moss shadow-md`;
  else if (variant === 'ghost') baseClasses += ` text-muted-foreground bg-transparent hover:bg-gray-100/70 focus:ring-gray-300`;

  return (
    <button className={`${baseClasses} ${className}`} onClick={onClick}>
      {children}
    </button>
  );
};

const Card = ({ children, className = '' }) => (
  <div className={`bg-white border border-border rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, variant = 'default', className = '' }) => {
  let baseClasses = 'inline-flex items-center px-2 py-0.5 font-semibold transition-colors focus:outline-none rounded-full';
  
  if (variant === 'default') baseClasses += ` bg-gray-200 text-charcoal text-xs`;
  else if (variant === 'eco-badge') baseClasses += ` bg-moss/20 text-forest text-xs border border-moss`;
  // Badge used in Header (wishlist count)
  else if (className.includes('bg-clay')) baseClasses = `bg-clay text-white text-xs p-0 flex items-center justify-center`; 
  
  return (
    <span className={`${baseClasses} ${className}`}>{children}</span>
  );
};

// Removed inbuilt header; global header from layout will be used

// --- Page Hero Component ---
const PageHero = ({ title, subtitle }) => {
  return (
    <div className="w-full h-[18vh] min-h-[140px] bg-gradient-to-r from-forest to-moss text-white flex items-center justify-center rounded-2xl shadow-xl mb-8">
      <div className="text-center p-6">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
          {title}
        </h1>
        <p className="text-lg sm:text-xl font-medium mt-1 opacity-90">
          {subtitle}
        </p>
      </div>
    </div>
  );
};

// --- Product Card Component (Fixed Dimensions) ---
const ProductCard = ({ product, viewMode }) => {
  
  const CardContentGrid = () => (
    // Fixed Card Height: h-[480px]
    <div className="h-[480px] flex flex-col p-0"> 
      <div className="relative overflow-hidden rounded-t-2xl flex-shrink-0 h-48">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <Button
          size="sm"
          variant="ghost"
          className="absolute top-3 right-3 text-white hover:text-red-500 bg-black/30 hover:bg-white/90 rounded-full p-2"
        >
          <Heart className="w-4 h-4" />
        </Button>
        <div className="absolute top-3 left-3">
          <Badge variant="eco-badge" className="bg-forest text-white">
            {product.ecoScore}
          </Badge>
        </div>
      </div>
      
      {/* Content Area - Fixed Height for consistency (flex-grow fills remaining space) */}
      <div className="p-4 space-y-3 flex-grow flex flex-col justify-between"> 
        <div className="space-y-2 flex-shrink-0">
          <h3 className="font-semibold text-charcoal text-lg group-hover:text-forest transition-colors truncate">
            {product.name}
          </h3>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
              <span className="text-sm font-medium">{product.rating}</span>
              <span className="text-sm text-gray-500">({product.reviews})</span>
            </div>
          </div>
          
          {/* Fixed height for badges row */}
          <div className="flex gap-2 flex-wrap h-6 overflow-hidden"> 
            {product.badges.slice(0, 2).map((badge) => (
              <Badge key={badge} variant="eco-badge" className="text-xs">
                {badge}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="space-y-3 pt-2 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 pl-3">
              <span className="text-2xl font-bold text-forest">{formatPrice(product.price)}</span>
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-moss">
              <Leaf className="w-3 h-3" />
              <span>Eco</span>
            </div>
          </div>
          
          <Button variant="default" className="w-full">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );

  const CardContentList = () => (
    <div className="flex flex-col md:flex-row p-4 items-center justify-between space-y-4 md:space-y-0 md:space-x-6">
      <div className="flex items-center space-x-4 w-full md:w-auto">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-24 h-24 object-cover rounded-xl flex-shrink-0"
        />
        <div className="space-y-1">
          <h3 className="font-semibold text-charcoal text-lg group-hover:text-forest transition-colors truncate">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
            <span className="text-sm font-medium">{product.rating} ({product.reviews})</span>
            <Badge variant="eco-badge">{product.ecoScore}</Badge>
          </div>
          <div className="flex gap-2 flex-wrap pt-1">
            {product.badges.map((badge) => (
              <Badge key={badge} variant="eco-badge" className="text-xs">
                {badge}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end space-y-2 flex-shrink-0 min-w-[150px]">
        <div className="flex flex-col items-end">
          <span className="text-2xl font-bold text-forest">{formatPrice(product.price)}</span>
          <span className="text-sm text-gray-500 line-through">
            {formatPrice(product.originalPrice)}
          </span>
        </div>
        <Button variant="default" size="sm" className="min-w-[120px]">
          <ShoppingCart className="w-4 h-4 mr-1.5" />
          Cart
        </Button>
      </div>
    </div>
  );

  return (
    <Card className="product-card group cursor-pointer transition-transform duration-300 hover:scale-[1.01]">
      {viewMode === 'grid' ? <CardContentGrid /> : <CardContentList />}
    </Card>
  );
};


// --- Product Listing Component ---
const ProductListing = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('popularity');
  const [currentCategory, setCurrentCategory] = useState('all'); 
  const [searchTerm, setSearchTerm] = useState(''); 
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedBadges, setSelectedBadges] = useState([]);
  const [selectedRating, setSelectedRating] = useState([]);
  
  const categoryName = categories[currentCategory] || categories['all'];
  const categoryTagline = currentCategory === 'all' 
    ? "Curated for a greener planet, browse our full ethical collection."
    : `Sustainable essentials for a better you and a healthier Earth.`;


  // Helper function to get price as number
  const getPriceValue = (product) => product.price;

  // Memoized product list for efficient filtering and sorting
  const finalProducts = useMemo(() => {
    let products = mockProducts;

    // 1. Category Filtering
    if (currentCategory !== 'all') {
      products = products.filter(p => p.category === currentCategory);
    }

    // 2. Search Term Filtering
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.badges.some(badge => badge.toLowerCase().includes(searchLower)) ||
        p.category.toLowerCase().includes(searchLower)
      );
    }
    
    // 3. Filter by Badges/Rating
    products = products.filter(product => {
      const passesBadgeFilter = selectedBadges.length === 0 || 
        selectedBadges.every(filterBadge => product.badges.includes(filterBadge));

      const passesRatingFilter = selectedRating.length === 0 ||
        selectedRating.some(filterRating => {
          if (filterRating === '4+ Stars') return product.rating >= 4.0;
          return true;
        });
      
      return passesBadgeFilter && passesRatingFilter;
    });

    // 4. Sorting Logic
    return products.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return getPriceValue(a) - getPriceValue(b);
        case 'price-high':
          return getPriceValue(b) - getPriceValue(a);
        case 'rating':
          return b.rating - a.rating;
        case 'eco-score':
          return parseInt(b.ecoScore) - parseInt(a.ecoScore);
        case 'popularity':
        default:
          return b.reviews - a.reviews; 
      }
    });
  }, [currentCategory, searchTerm, selectedBadges, selectedRating, sortBy]);


  const sortOptions = [
    { value: 'popularity', label: 'Most Popular' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'eco-score', label: 'Best Eco Score' }
  ];

  const filterOptions = {
    badges: ['Zero Waste', 'Organic', 'Renewable', 'Fair Trade', 'Cruelty-Free', 'Vegan', 'Recycled', 'Gluten-Free', 'Upcycled', 'Handmade', 'Durable', 'Plastic-Free'],
    rating: ['4+ Stars'],
  };

  const handleBadgeChange = (badge) => {
    setSelectedBadges(prev => 
      prev.includes(badge) ? prev.filter(b => b !== badge) : [...prev, badge]
    );
  };
  
  const handleRatingChange = (rating) => {
    setSelectedRating(prev => 
      prev.includes(rating) ? prev.filter(r => r !== rating) : [...prev, rating]
    );
  };

  const clearAllFilters = () => {
      setCurrentCategory('all');
      setSelectedBadges([]);
      setSelectedRating([]);
      setSearchTerm('');
  };

  // Filter Sidebar Component (Decorated)
  const FilterSidebar = ({ isMobile }) => (
    <aside className={`w-full lg:w-80 space-y-6 lg:space-y-8 p-6 lg:p-0 
      bg-white lg:bg-transparent lg:border-none 
      ${isMobile ? 'h-full overflow-y-auto' : 'hidden lg:block'}`}
    >
      <div className="lg:sticky lg:top-4 space-y-6">
        <h3 className="font-extrabold text-2xl text-charcoal flex items-center justify-between">
          <span className='flex items-center gap-2'><SlidersHorizontal className="w-5 h-5 text-forest" /> Filter & Category</span>
          <Button variant="ghost" onClick={clearAllFilters} size="sm" className="text-sm text-red-500 hover:text-red-700">Clear All</Button>
        </h3>
        
        {/* Category Selection (UPDATED) */}
        <Card className="p-4 space-y-1">
          <h4 className="font-bold text-base text-charcoal mb-2 flex items-center gap-2">
            <Filter className="w-4 h-4 text-forest" />
            Product Categories
          </h4>
          <div className="space-y-1 max-h-60 overflow-y-auto">
            {Object.entries(categories).map(([slug, name]) => (
              <button 
                key={slug} 
                onClick={() => setCurrentCategory(slug)}
                className={`w-full text-left px-3 py-2 rounded-xl transition-colors text-sm 
                  ${currentCategory === slug 
                    ? 'bg-forest text-white shadow-md font-semibold' 
                    : 'text-gray-700 hover:bg-gray-100'
                  }`}
              >
                {name}
              </button>
            ))}
          </div>
        </Card>

        {/* Eco Badges Filter */}
        <Card className="p-4 space-y-2">
          <h4 className="font-bold text-base text-charcoal flex items-center gap-2">
            <Leaf className="w-4 h-4 text-forest" />
            Eco Certifications
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {filterOptions.badges.map((badge) => (
              <label key={badge} className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 accent-forest border-border rounded-md" 
                  checked={selectedBadges.includes(badge)}
                  onChange={() => handleBadgeChange(badge)}
                />
                <span className="text-sm text-gray-600">{badge}</span>
              </label>
            ))}
          </div>
        </Card>

        {/* Rating Filter */}
        <Card className="p-4 space-y-2">
          <h4 className="font-bold text-base text-charcoal flex items-center gap-2">
            <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
            Customer Rating
          </h4>
          <div className="space-y-2">
            {filterOptions.rating.map((rating) => (
              <label key={rating} className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 accent-forest border-border rounded-md" 
                  checked={selectedRating.includes(rating)}
                  onChange={() => handleRatingChange(rating)}
                />
                <span className="text-sm text-gray-600">{rating}</span>
              </label>
            ))}
          </div>
        </Card>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-background font-inter">

      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <nav className="text-sm text-muted-foreground">
          <Link to="/" className="hover:text-forest">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-charcoal font-medium">{categoryName}</span>
        </nav>
      </div>

      {/* Page Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <PageHero 
            title={categoryName} 
            subtitle={categoryTagline} 
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        {/* Stats Bar */}
        <div className="flex items-center justify-between p-3 mb-6 bg-white rounded-xl border border-border/60 shadow-sm">
          <div className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-charcoal">{finalProducts.length}</span> products
          </div>
          <div className="text-xs text-muted-foreground hidden sm:block">
            {selectedBadges.length > 0 && (
              <span className="mr-3">{selectedBadges.length} badge filter(s)</span>
            )}
            {selectedRating.length > 0 && (
              <span>{selectedRating.length} rating filter(s)</span>
            )}
          </div>
        </div>
        <div className="flex gap-8">
          {/* Filters Sidebar (Desktop) */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <FilterSidebar isMobile={false} />
          </div>

          {/* Filters Sidebar (Mobile Overlay) */}
          {isFilterOpen && (
            <div className="fixed inset-0 z-50 bg-white lg:hidden transition-transform duration-300">
              <div className="p-4 border-b flex justify-end">
                <Button variant="ghost" onClick={() => setIsFilterOpen(false)} className="p-1 text-charcoal">Close</Button>
              </div>
              <FilterSidebar isMobile={true} />
            </div>
          )}

          {/* Main Content */}
          <main className="flex-1 space-y-8">
            
            {/* Search and Controls Toolbar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-3 bg-white rounded-xl shadow-sm border border-border/60">
              {/* Search Bar */}
              <div className="relative flex-grow">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search products, keywords, or badges..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-xl focus:ring-2 focus:ring-forest focus:border-transparent"
                />
              </div>

              <div className="flex items-center gap-4 flex-shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFilterOpen(true)}
                  className="lg:hidden bg-background"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
                
                {/* Sort */}
                <div className="relative">
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none text-sm border border-border rounded-xl pl-3 pr-8 py-2 bg-background text-charcoal focus:ring-2 focus:ring-forest cursor-pointer"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>

                {/* View Mode */}
                <div className="flex border border-border rounded-xl bg-background shadow-inner">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className={`rounded-r-none ${viewMode === 'grid' ? 'bg-forest text-white' : 'text-gray-500'}`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <div className="w-px h-full bg-border"></div>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className={`rounded-l-none ${viewMode === 'list' ? 'bg-forest text-white' : 'text-gray-500'}`}
                  >
                    <LayoutList className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {finalProducts.map((product) => (
                <div key={product.id}>
                  <ProductCard product={product} viewMode={viewMode} />
                </div>
              ))}
              {finalProducts.length === 0 && (
                <div className="col-span-full text-center py-16 border-2 border-dashed border-gray-300 rounded-xl bg-white">
                  <Leaf className="w-10 h-10 mx-auto text-moss mb-4" />
                  <p className="text-xl font-medium text-charcoal">No products found!</p>
                  <p className="text-gray-500">Try adjusting your filters, category, or search term.</p>
                </div>
              )}
            </div>
            
            {/* Load More Placeholder */}
            {finalProducts.length > 0 && (
                <div className="text-center pt-8">
                <Button variant="outline">
                    Load More Products
                </Button>
                </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

// --- Page Export ---
const CategoryPage = () => {
  return (
    <div className="min-h-screen">
      <ProductListing />
    </div>
  );
};

export default CategoryPage;
