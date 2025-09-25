import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { 
  Leaf, 
  Recycle, 
  Award, 
  Heart,
  ShoppingCart,
  Star
} from 'lucide-react';

const ecoProducts = [
  {
    id: 1,
    name: "Solar-Powered Bluetooth Speaker",
    brand: "EcoSound",
    price: "₹4,299",
    originalPrice: "₹5,999",
    rating: 4.8,
    reviews: 234,
    ecoScore: "96%",
    carbonSaved: "2.3kg",
    image: "/api/placeholder/300/300",
    badges: ["Solar Powered", "Recycled Materials"],
    features: ["30h Battery", "Waterproof", "Wireless Charging"]
  },
  {
    id: 2,
    name: "Organic Bamboo Bed Sheets",
    brand: "Natural Dreams",
    price: "₹3,499",
    originalPrice: "₹4,999",
    rating: 4.9,
    reviews: 156,
    ecoScore: "94%",
    carbonSaved: "1.8kg",
    image: "/api/placeholder/300/300",
    badges: ["GOTS Certified", "Bamboo Fiber"],
    features: ["Hypoallergenic", "Temperature Regulating", "Antibacterial"]
  },
  {
    id: 3,
    name: "Refillable Glass Water Bottle",
    brand: "Pure Flow",
    price: "₹1,899",
    originalPrice: "₹2,499",
    rating: 4.7,
    reviews: 523,
    ecoScore: "98%",
    carbonSaved: "0.9kg",
    image: "/api/placeholder/300/300",
    badges: ["Zero Plastic", "Lifetime Refills"],
    features: ["Borosilicate Glass", "Silicone Sleeve", "Leak-Proof"]
  },
  {
    id: 4,
    name: "Compostable Phone Case",
    brand: "Earth Guard",
    price: "₹1,299",
    originalPrice: "₹1,799",
    rating: 4.6,
    reviews: 89,
    ecoScore: "92%",
    carbonSaved: "0.3kg",
    image: "/api/placeholder/300/300",
    badges: ["Compostable", "Plant-Based"],
    features: ["Drop Protection", "90-Day Decomposition", "All Models"]
  }
];

const GoGreenSection = () => {
  const handleAddToCart = (productName: string) => {
    console.log(`Added ${productName} to cart`);
  };

  const handleAddToWishlist = (productName: string) => {
    console.log(`Added ${productName} to wishlist`);
  };

  return (
    <section className="py-20 bg-gradient-moss/5">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Leaf className="w-6 h-6 text-moss" />
            <Badge className="eco-badge">Go Green Picks</Badge>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-headline font-bold text-charcoal mb-4">
            Top Eco-Friendly Products
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Handpicked sustainable products that make a real difference. 
            Shop with purpose and track your positive impact.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {ecoProducts.map((product, index) => (
            <Card 
              key={product.id}
              className="product-card group overflow-hidden h-full"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Product Image */}
              <div className="relative overflow-hidden">
                <div className="w-full h-64 bg-gradient-to-br from-moss/20 to-clay/20 flex items-center justify-center">
                  <div className="text-6xl opacity-20">🌱</div>
                </div>
                
                {/* Badges */}
                <div className="absolute top-3 left-3 space-y-1">
                  {product.badges.slice(0, 2).map((badge) => (
                    <Badge key={badge} className="eco-badge text-xs">
                      {badge}
                    </Badge>
                  ))}
                </div>
                
                {/* Wishlist Button */}
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-3 right-3 w-8 h-8 p-0 bg-white/90 hover:bg-white text-muted-foreground hover:text-forest rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
                  onClick={() => handleAddToWishlist(product.name)}
                >
                  <Heart className="w-4 h-4" />
                </Button>

                {/* Eco Score */}
                <div className="absolute bottom-3 right-3 bg-moss/90 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  <Leaf className="w-3 h-3" />
                  {product.ecoScore}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6 space-y-4">
                <div>
                  <div className="text-sm text-moss font-medium mb-1">
                    {product.brand}
                  </div>
                  <h3 className="font-semibold text-charcoal line-clamp-2 leading-tight">
                    {product.name}
                  </h3>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-current text-yellow-400" />
                    <span className="text-sm font-medium">{product.rating}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    ({product.reviews} reviews)
                  </span>
                </div>

                {/* Features */}
                <div className="space-y-1">
                  {product.features.slice(0, 2).map((feature) => (
                    <div key={feature} className="text-xs text-muted-foreground flex items-center gap-1">
                      <div className="w-1 h-1 bg-moss rounded-full" />
                      {feature}
                    </div>
                  ))}
                </div>

                {/* Carbon Impact */}
                <div className="bg-forest/5 rounded-lg p-3 flex items-center gap-2">
                  <Recycle className="w-4 h-4 text-forest" />
                  <div className="text-xs">
                    <span className="font-medium text-forest">
                      -{product.carbonSaved} CO₂
                    </span>
                    <span className="text-muted-foreground"> saved</span>
                  </div>
                </div>

                {/* Price & CTA */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-forest">
                        {product.price}
                      </span>
                      <span className="text-sm text-muted-foreground line-through ml-2">
                        {product.originalPrice}
                      </span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {Math.round(((parseInt(product.originalPrice.replace(/[^\d]/g, '')) - parseInt(product.price.replace(/[^\d]/g, ''))) / parseInt(product.originalPrice.replace(/[^\d]/g, ''))) * 100)}% OFF
                    </Badge>
                  </div>
                  
                  <Button 
                    className="w-full btn-secondary group"
                    onClick={() => handleAddToCart(product.name)}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Impact Summary */}
        <div className="bg-card rounded-3xl p-8 shadow-card">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-forest mb-2">5.3kg</div>
              <div className="text-sm text-muted-foreground">Total CO₂ Saved</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-forest mb-2">12</div>
              <div className="text-sm text-muted-foreground">Trees Planted</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-forest mb-2">95%</div>
              <div className="text-sm text-muted-foreground">Avg Eco Score</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-forest mb-2">3.2k</div>
              <div className="text-sm text-muted-foreground">Happy Customers</div>
            </div>
          </div>
        </div>

        {/* View All CTA */}
        <div className="text-center mt-12">
          <Button className="btn-hero">
            <Award className="w-5 h-5 mr-2" />
            View All Eco Products
          </Button>
        </div>
      </div>
    </section>
  );
};

export default GoGreenSection;