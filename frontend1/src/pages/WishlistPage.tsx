import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Heart, 
  ShoppingCart, 
  Star, 
  Leaf, 
  Trash2,
  Share2,
  ArrowRight,
  Filter,
  Grid3X3,
  LayoutList
} from 'lucide-react';

// Mock wishlist data
const mockWishlistItems = [
  {
    id: 1,
    name: "Eco Bamboo Kitchen Utensil Set",
    price: "₹1,299",
    originalPrice: "₹1,899",
    image: "/api/placeholder/300/300",
    rating: 4.8,
    reviews: 234,
    ecoScore: "95%",
    badges: ["Zero Waste", "Renewable"],
    inStock: true,
    discount: "32% OFF",
    addedDate: "2024-01-10",
    priceDropped: false
  },
  {
    id: 2,
    name: "Organic Cotton T-Shirt",
    price: "₹799",
    originalPrice: "₹1,299",
    image: "/api/placeholder/300/300",
    rating: 4.6,
    reviews: 567,
    ecoScore: "89%",
    badges: ["Organic", "Fair Trade"],
    inStock: true,
    discount: "38% OFF",
    addedDate: "2024-01-08",
    priceDropped: true,
    previousPrice: "₹899"
  },
  {
    id: 3,
    name: "Natural Face Serum",
    price: "₹1,599",
    originalPrice: "₹2,199",
    image: "/api/placeholder/300/300",
    rating: 4.9,
    reviews: 345,
    ecoScore: "96%",
    badges: ["Cruelty-Free", "Vegan"],
    inStock: false,
    discount: "27% OFF",
    addedDate: "2024-01-05",
    priceDropped: false,
    restockDate: "2024-02-01"
  },
  {
    id: 4,
    name: "Solar Power Bank",
    price: "₹2,299",
    originalPrice: "₹3,299",
    image: "/api/placeholder/300/300",
    rating: 4.7,
    reviews: 189,
    ecoScore: "92%",
    badges: ["Renewable Energy", "Durable"],
    inStock: true,
    discount: "30% OFF",
    addedDate: "2024-01-03",
    priceDropped: false
  },
  {
    id: 5,
    name: "Hemp Yoga Mat",
    price: "₹2,199",
    originalPrice: "₹2,899",
    image: "/api/placeholder/300/300",
    rating: 4.5,
    reviews: 98,
    ecoScore: "94%",
    badges: ["Natural", "Biodegradable"],
    inStock: true,
    discount: "24% OFF",
    addedDate: "2023-12-28",
    priceDropped: false
  },
  {
    id: 6,
    name: "Recycled Paper Notebooks",
    price: "₹399",
    originalPrice: "₹599",
    image: "/api/placeholder/300/300",
    rating: 4.4,
    reviews: 78,
    ecoScore: "88%",
    badges: ["Recycled", "Plastic-Free"],
    inStock: true,
    discount: "33% OFF",
    addedDate: "2023-12-25",
    priceDropped: true,
    previousPrice: "₹449"
  }
];

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState(mockWishlistItems);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('date-added');
  const [filterBy, setFilterBy] = useState('all');

  const removeFromWishlist = (id: number) => {
    setWishlistItems(items => items.filter(item => item.id !== id));
  };

  const moveToCart = (id: number) => {
    // TODO: Implement move to cart functionality
  };

  const sortOptions = [
    { value: 'date-added', label: 'Date Added' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'discount', label: 'Biggest Discount' }
  ];

  const filterOptions = [
    { value: 'all', label: 'All Items' },
    { value: 'in-stock', label: 'In Stock' },
    { value: 'out-of-stock', label: 'Out of Stock' },
    { value: 'price-drop', label: 'Price Dropped' }
  ];

  const filteredItems = wishlistItems.filter(item => {
    switch (filterBy) {
      case 'in-stock':
        return item.inStock;
      case 'out-of-stock':
        return !item.inStock;
      case 'price-drop':
        return item.priceDropped;
      default:
        return true;
    }
  });

  const WishlistItemCard = ({ item }: { item: typeof mockWishlistItems[0] }) => (
    <Card className="product-card group">
      <CardContent className="p-0">
        <div className="relative overflow-hidden rounded-t-2xl">
          <Link to={`/product/${item.id}`}>
            <img 
              src={item.image} 
              alt={item.name}
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </Link>
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            <Badge className="eco-badge bg-forest text-white">
              {item.ecoScore}
            </Badge>
            {item.discount && (
              <Badge className="eco-badge bg-clay text-white text-xs">
                {item.discount}
              </Badge>
            )}
            {item.priceDropped && (
              <Badge className="eco-badge bg-red-500 text-white text-xs">
                Price Drop!
              </Badge>
            )}
            {!item.inStock && (
              <Badge className="eco-badge bg-gray-500 text-white text-xs">
                Out of Stock
              </Badge>
            )}
          </div>

          {/* Action Buttons */}
          <div className="absolute top-2 right-2 flex flex-col gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => removeFromWishlist(item.id)}
              className="text-white hover:text-red-500 bg-black/20 hover:bg-white/90 rounded-full"
            >
              <Heart className="w-4 h-4 fill-current" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-white hover:text-gray-700 bg-black/20 hover:bg-white/90 rounded-full"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="p-4 space-y-3">
          <div className="space-y-2">
            <Link 
              to={`/product/${item.id}`}
              className="font-semibold text-charcoal group-hover:text-forest transition-colors line-clamp-2"
            >
              {item.name}
            </Link>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{item.rating}</span>
                <span className="text-sm text-muted-foreground">({item.reviews})</span>
              </div>
            </div>
            
            <div className="flex gap-2 flex-wrap">
              {item.badges.slice(0, 2).map((badge) => (
                <Badge key={badge} className="eco-badge text-xs">
                  {badge}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-forest">{item.price}</span>
                <span className="text-sm text-muted-foreground line-through">
                  {item.originalPrice}
                </span>
              </div>
              
              {item.priceDropped && item.previousPrice && (
                <div className="text-xs text-red-600">
                  Price dropped from {item.previousPrice}!
                </div>
              )}
              
              {!item.inStock && item.restockDate && (
                <div className="text-xs text-muted-foreground">
                  Expected restock: {item.restockDate}
                </div>
              )}
              
              <div className="text-xs text-muted-foreground">
                Added on {item.addedDate}
              </div>
            </div>
            
            <div className="space-y-2">
              <Button 
                className="w-full btn-secondary"
                onClick={() => moveToCart(item.id)}
                disabled={!item.inStock}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {item.inStock ? 'Move to Cart' : 'Notify When Available'}
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm"
                className="w-full text-red-500 hover:text-red-700"
                onClick={() => removeFromWishlist(item.id)}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Remove
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center space-y-6 max-w-md mx-auto">
            <div className="text-6xl mb-4">💚</div>
            <h1 className="text-3xl font-headline font-bold text-charcoal">
              Your wishlist is empty
            </h1>
            <p className="text-muted-foreground">
              Save your favorite sustainable products to your wishlist and never lose track of them.
            </p>
            <Button asChild className="btn-hero">
              <Link to="/products">
                <Heart className="w-5 h-5 mr-2" />
                Start Wishlist
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-headline font-bold text-charcoal mb-2">
            My Wishlist
          </h1>
          <p className="text-muted-foreground">
            {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} saved for later
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4 mb-6">
          <Button 
            onClick={() => {
              const inStockItems = wishlistItems.filter(item => item.inStock);
              inStockItems.forEach(item => moveToCart(item.id));
            }}
            disabled={!wishlistItems.some(item => item.inStock)}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add All to Cart
          </Button>
          
          <Button variant="outline">
            <Share2 className="w-4 h-4 mr-2" />
            Share Wishlist
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => setWishlistItems([])}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        </div>

        {/* Price Drop Alert */}
        {wishlistItems.some(item => item.priceDropped) && (
          <Card className="mb-6 bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-red-800">Price Drop Alert!</h3>
                  <p className="text-red-600 text-sm">
                    {wishlistItems.filter(item => item.priceDropped).length} item(s) in your wishlist have lower prices now!
                  </p>
                </div>
                <Button size="sm" className="ml-auto">
                  View Deals
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <select 
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="text-sm border border-border rounded-lg px-3 py-2 bg-background"
            >
              {filterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            
            <span className="text-sm text-muted-foreground">
              {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''}
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

        {/* Wishlist Items */}
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
        }`}>
          {filteredItems.map((item) => (
            <WishlistItemCard key={item.id} item={item} />
          ))}
        </div>

        {/* Empty Filter Results */}
        {filteredItems.length === 0 && wishlistItems.length > 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-charcoal mb-2">No items match your filter</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your filter settings</p>
            <Button variant="outline" onClick={() => setFilterBy('all')}>
              Show All Items
            </Button>
          </div>
        )}

        {/* Eco Impact Summary */}
        {wishlistItems.length > 0 && (
          <Card className="mt-8 bg-gradient-moss text-white">
            <CardContent className="p-6 text-center">
              <Leaf className="w-8 h-8 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Potential Eco Impact</h3>
              <p className="text-sm opacity-90">
                If you purchase all items in your wishlist, you'll save approximately{' '}
                <strong>{(wishlistItems.length * 0.5).toFixed(1)}kg CO₂</strong> and plant{' '}
                <strong>{wishlistItems.length} trees</strong>!
              </p>
            </CardContent>
          </Card>
        )}

        {/* Continue Shopping */}
        <div className="text-center mt-8">
          <Button asChild variant="outline" className="btn-outline">
            <Link to="/products">
              Continue Shopping
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;