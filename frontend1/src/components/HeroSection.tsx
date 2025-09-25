import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge'; // Keeping if needed for other sections
import { ShoppingCart, Leaf, Award, Heart, ArrowLeft, ArrowRight } from 'lucide-react'; // Added Arrow icons for carousel
import heroImage from '@/assets/hero-sustainable-products.jpg';
import bambooBottle from '@/assets/product-bamboo-bottle.jpg';
import cottonBags from '@/assets/product-cotton-bags.jpg';
import skincareSet from '@/assets/product-skincare-set.jpg';
import bambooToothbrush from '@/assets/product-bamboo-toothbrush.jpg'; // Assuming you have this image

const taglines = [
  "Buy better. Live lighter.",
  "Sustainable choices, beautiful life.",
  "Earth-friendly finds, delivered."
];

// Expanded product list to fill carousel, adding a toothbrush
// Use this array to quickly fix the error
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
  },
  {
    id: 4,
    name: "Eco Bamboo Water Bottle",
    price: "₹1,299",
    originalPrice: "₹1,599",
    image: bambooBottle,
    ecoScore: "95%",
    badges: ["Zero Waste", "Renewable"]
  },
  {
    id: 5,
    name: "Organic Cotton Bag Set",
    price: "₹899",
    originalPrice: "₹1,199",
    image: cottonBags,
    ecoScore: "92%",
    badges: ["Organic", "Plastic-Free"]
  },
  {
    id: 6,
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
  const [isTaglineVisible, setIsTaglineVisible] = useState(true);
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Tagline animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTaglineVisible(false);
      setTimeout(() => {
        setCurrentTagline((prev) => (prev + 1) % taglines.length);
        setIsTaglineVisible(true);
      }, 300); // Duration of fade out
    }, 3000); // Time visible

    return () => clearInterval(interval);
  }, []);

  // Carousel auto-scroll effect
  useEffect(() => {
    const autoScrollInterval = setInterval(() => {
      handleNext();
    }, 5000); // Auto-scroll every 5 seconds

    return () => clearInterval(autoScrollInterval);
  }, [currentCarouselIndex]); // Restart interval if index changes (e.g., manual navigation)

  const handleAddToCart = (productName: string) => {
    console.log(`Added ${productName} to cart`);
    // Implement leaf particles animation here if desired
  };

  const productsPerView = 3;
  const totalPages = Math.ceil(topProducts.length / productsPerView);

  const handleNext = () => {
    setCurrentCarouselIndex((prevIndex) => {
      const nextIndex = (prevIndex + productsPerView);
      return nextIndex >= topProducts.length ? 0 : nextIndex; // Loop to start
    });
  };

  const handlePrev = () => {
    setCurrentCarouselIndex((prevIndex) => {
      const prevStartIndex = prevIndex - productsPerView;
      return prevStartIndex < 0 ? (totalPages - 1) * productsPerView : prevStartIndex; // Loop to end
    });
  };

  const visibleProducts = topProducts.slice(currentCarouselIndex, currentCarouselIndex + productsPerView);
  // If we reach the end and there aren't enough products, loop back to fill
  if (visibleProducts.length < productsPerView && topProducts.length > productsPerView) {
    visibleProducts.push(...topProducts.slice(0, productsPerView - visibleProducts.length));
  }


  return (
    <section className="relative min-h-screen bg-gradient-hero overflow-hidden flex items-center justify-center">
      {/* Parallax Background */}
      <div className="absolute inset-0 parallax-layer">
        <img 
          src={heroImage} 
          alt="Sustainable lifestyle products" 
          className="w-full h-full object-cover opacity-100"
        />
        <div className="absolute inset-0 bg-background/70" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16"> {/* Increased vertical padding */}
        <div className="grid lg:grid-cols-2 gap-16 items-center"> {/* Increased gap */}
          {/* Hero Content (left side) */}
          <div className="space-y-6 slide-up pt-8 text-center lg:text-left"> {/* Centered for smaller screens */}
            <div className="space-y-3">
              <div className="flex items-center justify-center lg:justify-start gap-2 text-moss font-medium">
                <Leaf className="w-5 h-5" />
                <span>Conscious Commerce for Earth</span>
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-headline font-bold text-charcoal leading-tight">
                Shop
                <span className="text-forest block">Sustainable</span>
              </h1>
              
              <div className="h-12 flex items-center justify-center lg:justify-start">
                <p 
                  className={`text-lg lg:text-xl text-muted-foreground transition-all duration-300 ${
                    isTaglineVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                >
                  {taglines[currentTagline]}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
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
            <div className="grid grid-cols-3 gap-4 pt-6 mt-8 border-t border-border/20"> {/* Increased top margin */}
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

          {/* Top Eco Picks Carousel (right side) */}
          <div className="space-y-6 slide-up text-center lg:text-left">
            <h2 className="text-xl font-headline font-bold text-charcoal">
              Top Eco Picks
            </h2>
            
            <div className="relative">
              {/* Carousel Container */}
              <div ref={carouselRef} className="flex overflow-hidden relative space-x-6"> {/* Use space-x-6 for gaps */}
                {visibleProducts.map((product, index) => (
                  <div 
                    key={product.id}
                    className="flex-none w-[calc(33.333%-16px)] lg:w-[calc(33.333%-16px)] product-card-new group relative overflow-hidden rounded-xl shadow-lg bg-card border border-border transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                    // Adjust width dynamically based on desired items per view if not 3
                    // For 3 items and space-x-6 (24px gap): (100% - 2*24px) / 3 = 33.333% - 16px
                    style={{ minWidth: `calc(33.333% - 16px)`}} 
                  >
                    <img 
                      src={product.image}
                      alt={product.name}
                      className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-105" // Larger image area
                    />
                    
                    {/* Overlay for Title and Badges */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 via-background/60 to-transparent p-4 pb-16 transition-all duration-300 group-hover:pb-20"> {/* Pushed up for button */}
                      <h3 className="font-semibold text-lg text-charcoal mb-2 leading-tight">
                        {product.name}
                      </h3>
                      <div className="flex gap-1 flex-wrap justify-center lg:justify-start">
                        {product.badges.map((badge) => (
                          <Badge key={badge} className="eco-badge text-xs px-1.5 py-0.5">
                            {badge}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Price & Eco Score - visible on hover or always */}
                    <div className="absolute inset-x-0 bottom-12 flex items-center justify-between p-4 transition-all duration-300 group-hover:bottom-20">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base font-bold text-forest">{product.price}</span>
                        <span className="text-xs text-muted-foreground line-through">
                          {product.originalPrice}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-moss">
                        <Leaf className="w-3 h-3" />
                        <span>{product.ecoScore}</span>
                      </div>
                    </div>

                    {/* Add to Cart Button */}
                    <Button 
                      className="absolute inset-x-0 bottom-0 w-full btn-secondary text-sm py-3 rounded-t-none opacity-0 translate-y-full group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
                      onClick={() => handleAddToCart(product.name)}
                    >
                      Add to Cart <ShoppingCart className="ml-2 w-4 h-4" />
                    </Button>

                    {/* Heart Icon (top right) */}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/30 hover:bg-black/50 rounded-full p-2 h-auto w-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Carousel Navigation Buttons */}
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-1/2 -left-8 transform -translate-y-1/2 text-charcoal hover:text-forest bg-background/50 hover:bg-background/80 rounded-full transition-all duration-300 z-20"
                onClick={handlePrev}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-1/2 -right-8 transform -translate-y-1/2 text-charcoal hover:text-forest bg-background/50 hover:bg-background/80 rounded-full transition-all duration-300 z-20"
                onClick={handleNext}
              >
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>

            <div className="text-center pt-2">
              <Button variant="ghost" className="text-forest hover:text-forest/80 text-sm">
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