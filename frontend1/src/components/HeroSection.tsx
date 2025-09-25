import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Leaf, Award, Heart } from 'lucide-react';
import heroImage from '@/assets/hero-sustainable-products.jpg';
import bambooBottle from '@/assets/product-bamboo-bottle.jpg';
import cottonBags from '@/assets/product-cotton-bags.jpg';
import skincareSet from '@/assets/product-skincare-set.jpg';

const taglines = [
  "Buy better. Live lighter.",
  "Sustainable choices, beautiful life.",
  "Earth-friendly finds, delivered."
];

const topProducts = [
  {
    id: 1,
    name: "Eco Bamboo Water Bottle",
    price: "₹1,299",
    originalPrice: "₹1,599",
    image: bambooBottle,
    ecoScore: "95%",
    badges: ["Zero Waste", "Renewable"]
  },
  {
    id: 2,
    name: "Organic Cotton Bag Set",
    price: "₹899",
    originalPrice: "₹1,199",
    image: cottonBags,
    ecoScore: "92%",
    badges: ["Organic", "Plastic-Free"]
  },
  {
    id: 3,
    name: "Natural Skincare Bundle",
    price: "₹2,499",
    originalPrice: "₹3,199",
    image: skincareSet,
    ecoScore: "98%",
    badges: ["Cruelty-Free", "Vegan"]
  }
];

const HeroSection = () => {
  const [currentTagline, setCurrentTagline] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentTagline((prev) => (prev + 1) % taglines.length);
        setIsVisible(true);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleAddToCart = (productName: string) => {
    // Add leaf particles animation effect here
    console.log(`Added ${productName} to cart`);
  };

  return (
    <section className="relative min-h-screen bg-gradient-hero overflow-hidden">
      {/* Parallax Background */}
      <div className="absolute inset-0 parallax-layer">
        <img 
          src={heroImage} 
          alt="Sustainable lifestyle products" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/60" />
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen">
          {/* Hero Content */}
          <div className="space-y-8 slide-up">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-moss font-medium">
                <Leaf className="w-5 h-5" />
                <span>Conscious Commerce for Earth</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-headline font-bold text-charcoal leading-tight">
                Shop
                <span className="text-forest block">Sustainable</span>
              </h1>
              
              <div className="h-16 flex items-center">
                <p 
                  className={`text-xl lg:text-2xl text-muted-foreground transition-all duration-300 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                >
                  {taglines[currentTagline]}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="btn-hero">
                Shop Collections
                <ShoppingCart className="ml-2 w-5 h-5" />
              </Button>
              <Button variant="outline" className="btn-outline">
                Learn Impact
                <Award className="ml-2 w-5 h-5" />
              </Button>
            </div>

            {/* Impact Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border/20">
              <div className="text-center">
                <div className="text-2xl font-bold text-forest">50K+</div>
                <div className="text-sm text-muted-foreground">Trees Planted</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-forest">25T</div>
                <div className="text-sm text-muted-foreground">CO₂ Offset</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-forest">1M+</div>
                <div className="text-sm text-muted-foreground">Plastic Saved</div>
              </div>
            </div>
          </div>

          {/* Top 3 Products */}
          <div className="space-y-6 slide-up">
            <div className="text-center lg:text-left">
              <h2 className="text-2xl font-headline font-bold text-charcoal mb-2">
                Top Eco Picks
              </h2>
              <p className="text-muted-foreground">
                Most loved sustainable products this month
              </p>
            </div>

            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div 
                  key={product.id}
                  className="product-card p-6 float-animation"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="flex gap-4">
                    <img 
                      src={product.image}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded-xl"
                    />
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-charcoal">{product.name}</h3>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-muted-foreground hover:text-forest"
                        >
                          <Heart className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="flex gap-2">
                        {product.badges.map((badge) => (
                          <Badge key={badge} className="eco-badge text-xs">
                            {badge}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-forest">{product.price}</span>
                          <span className="text-sm text-muted-foreground line-through">
                            {product.originalPrice}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-moss">
                          <Leaf className="w-3 h-3" />
                          <span>{product.ecoScore}</span>
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full btn-secondary"
                        onClick={() => handleAddToCart(product.name)}
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center pt-4">
              <Button variant="ghost" className="text-forest hover:text-forest/80">
                View All Bestsellers →
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;