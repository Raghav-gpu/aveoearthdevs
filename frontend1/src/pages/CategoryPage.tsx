import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Filter, 
  Star, 
  Heart, 
  ShoppingCart, 
  Leaf, 
  SlidersHorizontal,
  Grid3X3,
  LayoutList
} from 'lucide-react';

// Mock data for categories and products
const categories = {
  'eco-home': 'Eco Home & Living',
  'sustainable-fashion': 'Sustainable Fashion',
  'natural-beauty': 'Natural Beauty',
  'organic-food': 'Organic Food',
  'green-tech': 'Green Technology'
};

const mockProducts = [
  {
    id: 1,
    name: "Bamboo Kitchen Utensil Set",
    price: "₹1,299",
    originalPrice: "₹1,899",
    image: "/api/placeholder/300/300",
    rating: 4.8,
    reviews: 234,
    ecoScore: "95%",
    badges: ["Zero Waste", "Renewable"],
    category: "eco-home"
  },
  {
    id: 2,
    name: "Organic Cotton Bedsheet Set",
    price: "₹2,999",
    originalPrice: "₹4,499",
    image: "/api/placeholder/300/300",
    rating: 4.9,
    reviews: 456,
    ecoScore: "92%",
    badges: ["Organic", "Fair Trade"],
    category: "eco-home"
  },
  {
    id: 3,
    name: "Hemp Yoga Mat",
    price: "₹2,199",
    originalPrice: "₹2,899",
    image: "/api/placeholder/300/300",
    rating: 4.7,
    reviews: 189,
    ecoScore: "94%",
    badges: ["Natural", "Biodegradable"],
    category: "eco-home"
  },
  // Add more products for other categories
  {
    id: 4,
    name: "Organic Cotton T-Shirt",
    price: "₹899",
    originalPrice: "₹1,299",
    image: "/api/placeholder/300/300",
    rating: 4.6,
    reviews: 567,
    ecoScore: "89%",
    badges: ["Organic", "Fair Trade"],
    category: "sustainable-fashion"
  },
  {
    id: 5,
    name: "Natural Face Serum",
    price: "₹1,599",
    originalPrice: "₹2,199",
    image: "/api/placeholder/300/300",
    rating: 4.9,
    reviews: 345,
    ecoScore: "96%",
    badges: ["Cruelty-Free", "Vegan"],
    category: "natural-beauty"
  },
  {
    id: 6,
    name: "Organic Quinoa 1kg",
    price: "₹649",
    originalPrice: "₹849",
    image: "/api/placeholder/300/300",
    rating: 4.8,
    reviews: 123,
    ecoScore: "93%",
    badges: ["Certified Organic", "Gluten-Free"],
    category: "organic-food"
  }
];

const CategoryPage = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('popularity');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const categoryName = categories[categorySlug as keyof typeof categories] || 'Products';
  const categoryProducts = mockProducts.filter(product => product.category === categorySlug);

  const sortOptions = [
    { value: 'popularity', label: 'Most Popular' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'eco-score', label: 'Best Eco Score' }
  ];

  const filterOptions = {
    badges: ['Zero Waste', 'Organic', 'Renewable', 'Fair Trade', 'Cruelty-Free', 'Vegan'],
    rating: ['4+ Stars', '3+ Stars'],
    price: ['Under ₹500', '₹500-₹1000', '₹1000-₹2000', '₹2000+']
  };

  const ProductCard = ({ product }: { product: typeof mockProducts[0] }) => (
    <Card className="product-card group cursor-pointer">
      <CardContent className="p-0">
        <div className="relative overflow-hidden rounded-t-2xl">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <Button
            size="sm"
            variant="ghost"
            className="absolute top-2 right-2 text-white hover:text-red-500 bg-black/20 hover:bg-white/90 rounded-full"
          >
            <Heart className="w-4 h-4" />
          </Button>
          <div className="absolute top-2 left-2">
            <Badge className="eco-badge bg-forest text-white">
              {product.ecoScore}
            </Badge>
          </div>
        </div>
        
        <div className="p-4 space-y-3">
          <div className="space-y-2">
            <h3 className="font-semibold text-charcoal group-hover:text-forest transition-colors">
              {product.name}
            </h3>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{product.rating}</span>
                <span className="text-sm text-muted-foreground">({product.reviews})</span>
              </div>
            </div>
            
            <div className="flex gap-2 flex-wrap">
              {product.badges.slice(0, 2).map((badge) => (
                <Badge key={badge} className="eco-badge text-xs">
                  {badge}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-forest">{product.price}</span>
                <span className="text-sm text-muted-foreground line-through">
                  {product.originalPrice}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-moss">
                <Leaf className="w-3 h-3" />
                <span>Eco</span>
              </div>
            </div>
            
            <Button className="w-full btn-secondary">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Category Header */}
      <section className="bg-gradient-hero py-16">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4">
            <h1 className="text-4xl lg:text-5xl font-headline font-bold text-charcoal">
              {categoryName}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover our curated collection of sustainable products that make a positive impact on the planet.
            </p>
            <div className="flex items-center justify-center gap-2 text-forest">
              <Leaf className="w-5 h-5" />
              <span className="font-medium">{categoryProducts.length} eco-friendly products</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <aside className="hidden lg:block w-80 space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-charcoal flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </h3>
              
              {/* Price Range */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-charcoal">Price Range</h4>
                <div className="space-y-2">
                  {filterOptions.price.map((price) => (
                    <label key={price} className="flex items-center gap-2">
                      <input type="checkbox" className="rounded border-border" />
                      <span className="text-sm text-muted-foreground">{price}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Eco Badges */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-charcoal">Eco Certifications</h4>
                <div className="space-y-2">
                  {filterOptions.badges.map((badge) => (
                    <label key={badge} className="flex items-center gap-2">
                      <input type="checkbox" className="rounded border-border" />
                      <span className="text-sm text-muted-foreground">{badge}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-charcoal">Customer Rating</h4>
                <div className="space-y-2">
                  {filterOptions.rating.map((rating) => (
                    <label key={rating} className="flex items-center gap-2">
                      <input type="checkbox" className="rounded border-border" />
                      <span className="text-sm text-muted-foreground">{rating}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 space-y-6">
            {/* Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
                <span className="text-sm text-muted-foreground">
                  Showing {categoryProducts.length} products
                </span>
              </div>

              <div className="flex items-center gap-4">
                {/* Sort */}
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-sm border border-border rounded-lg px-3 py-2 bg-background"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                {/* View Mode */}
                <div className="flex border border-border rounded-lg">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none"
                  >
                    <LayoutList className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {categoryProducts.map((product) => (
                <Link key={product.id} to={`/product/${product.id}`}>
                  <ProductCard product={product} />
                </Link>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center pt-8">
              <Button variant="outline" className="btn-outline">
                Load More Products
              </Button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;