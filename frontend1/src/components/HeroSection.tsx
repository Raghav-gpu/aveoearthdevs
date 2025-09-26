import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Leaf, Award, ArrowLeft, ArrowRight } from 'lucide-react';
import heroImage from '@/assets/hero-sustainable-products.jpg';
import bambooBottle from '@/assets/product-bamboo-bottle.jpg';
import cottonBags from '@/assets/product-cotton-bags.jpg';
import skincareSet from '@/assets/product-skincare-set.jpg';

const taglines = [
  "Buy better. Live lighter.",
  "Sustainable choices, beautiful life.",
  "Earth-friendly finds, delivered."
];

// All available product images for cycling
const allImages = [bambooBottle, cottonBags, skincareSet];

// Updated topProducts array with multiple images and expanded to 8 items
const topProducts = [
    {
    id: 1,
    name: "Eco Bamboo Water Bottle",
    price: "₹1,299",
    originalPrice: "₹1,599",
    images: [bambooBottle, cottonBags, skincareSet],
    ecoScore: "95%",
    badges: ["Zero Waste"]
  },
  {
    id: 2,
    name: "Organic Cotton Bag Set (Set of 5)",
    price: "₹899",
    originalPrice: "₹1,199",
    images: [cottonBags, skincareSet, bambooBottle],
    ecoScore: "92%",
    badges: ["Organic"]
  },
  {
    id: 3,
    name: "Natural Skincare Bundle",
    price: "₹2,499",
    originalPrice: "₹3,199",
    images: [skincareSet, bambooBottle, cottonBags],
    ecoScore: "98%",
    badges: ["Cruelty-Free"]
  },
  {
    id: 4,
    name: "Eco Bamboo Water Bottle", // Duplicated item
    price: "₹1,299",
    originalPrice: "₹1,599",
    images: [bambooBottle, skincareSet, cottonBags],
    ecoScore: "95%",
    badges: ["Zero Waste"]
  },
  {
    id: 5,
    name: "Organic Cotton Bag Set (Set of 5)", // Duplicated item
    price: "₹899",
    originalPrice: "₹1,199",
    images: [cottonBags, bambooBottle, skincareSet],
    ecoScore: "92%",
    badges: ["Organic"]
  },
  {
    id: 6,
    name: "Natural Skincare Bundle", // Duplicated item
    price: "₹2,499",
    originalPrice: "₹3,199",
    images: [skincareSet, cottonBags, bambooBottle],
    ecoScore: "98%",
    badges: ["Cruelty-Free"]
  },
  {
    id: 7,
    name: "Eco Bamboo Water Bottle", // Duplicated item
    price: "₹1,299",
    originalPrice: "₹1,599",
    images: [bambooBottle, cottonBags, skincareSet],
    ecoScore: "95%",
    badges: ["Zero Waste"]
  },
  {
    id: 8,
    name: "Organic Cotton Bag Set (Set of 5)", // Duplicated item
    price: "₹899",
    originalPrice: "₹1,199",
    images: [cottonBags, skincareSet, bambooBottle],
    ecoScore: "92%",
    badges: ["Organic"]
  }
];


const HeroSection = () => {
  const [currentTagline, setCurrentTagline] = React.useState(0);
  const [isTaglineVisible, setIsTaglineVisible] = React.useState(true);
  const [currentCarouselIndex, setCurrentCarouselIndex] = React.useState(0);
  const [cardImageIndexes, setCardImageIndexes] = React.useState<{ [key: number]: number }>({});

  const carouselRef = React.useRef<HTMLDivElement>(null);

  // Tagline animation effect
  React.useEffect(() => {
    const interval = setInterval(() => {
      setIsTaglineVisible(false);
      setTimeout(() => {
        setCurrentTagline((prev) => (prev + 1) % taglines.length);
        setIsTaglineVisible(true);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Carousel auto-scroll effect
  React.useEffect(() => {
    const autoScrollInterval = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(autoScrollInterval);
  }, [currentCarouselIndex]);

  const handleAddToCart = (productName: string) => {
    console.log(`Added ${productName} to cart`);
  };

  const productsPerView = 4;
  const totalPages = Math.ceil(topProducts.length / productsPerView);

  const handleNext = () => {
    setCurrentCarouselIndex((prevIndex) => {
      const nextIndex = (prevIndex + productsPerView);
      return nextIndex >= topProducts.length ? 0 : nextIndex;
    });
  };

  const handlePrev = () => {
    setCurrentCarouselIndex((prevIndex) => {
      const prevStartIndex = prevIndex - productsPerView;
      return prevStartIndex < 0 ? (totalPages - 1) * productsPerView : prevStartIndex;
    });
  };

  const handleImageIndicatorClick = (e: React.MouseEvent, productId: number, imageIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    setCardImageIndexes(prev => ({ ...prev, [productId]: imageIndex }));
  };

  const visibleProducts = topProducts.slice(currentCarouselIndex, currentCarouselIndex + productsPerView);
  if (visibleProducts.length < productsPerView && topProducts.length >= productsPerView) {
    visibleProducts.push(...topProducts.slice(0, productsPerView - visibleProducts.length));
  }

  return (
    <section className="relative min-h-screen bg-gradient-hero overflow-hidden flex items-start justify-center">
      {/* Parallax Background */}
      <div className="absolute inset-0 parallax-layer">
        <img
          src={heroImage}
          alt="Sustainable lifestyle products"
          className="w-full h-full object-cover opacity-100"
        />
        <div className="absolute inset-0 bg-background/70" />
      </div>

      <div className="relative z-10 container mx-auto px-10 pt-24 pb-16">
        <div className="grid lg:grid-cols-5 gap-12 items-center">
          {/* Hero Content (left side, taking 2 of 5 columns) */}
          <div className="lg:col-span-2 space-y-6 slide-up text-center lg:text-left">
            <div className="space-y-4">
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
            <div className="grid grid-cols-3 gap-4 pt-6 mt-8 border-t border-border/20">
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

          {/* Top Eco Picks Carousel (right side, taking 3 of 5 columns) */}
          <div className="lg:col-span-3 slide-up">
            {/* ============ CHANGE 1: WRAPPER FOR ALIGNING ALL RIGHT-SIDE CONTENT ============ */}
            <div className="lg:-ml-12 space-y-4">
              <h2 className="text-xl font-headline font-bold text-charcoal text-center lg:text-left">
                Top Picks
              </h2>
              
              <div className="relative">
                {/* Carousel Container */}
                <div ref={carouselRef} className="flex overflow-hidden relative -mx-3">
                  {visibleProducts.map((product) => (
                    <div 
                      key={`${product.id}-${currentCarouselIndex}`}
                      // ============== CHANGE 2: CARD WIDTH DECREASED ==============
                      className="flex-none w-[calc(25%-2px)] px-3"
                    >
                      <div className="group flex flex-col h-full bg-card/80 backdrop-blur-sm border border-border/20 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:border-border/40 overflow-hidden">
                        {/* Image Section with Gallery */}
                        <div className="relative">
                          <img 
                            src={product.images[cardImageIndexes[product.id] || 0]}
                            alt={product.name}
                            className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute top-2 right-2 flex items-center gap-1 text-xs text-moss bg-background/80 px-2 py-1 rounded-full shadow-md">
                            <Leaf className="w-3 h-3" />
                            <span>{product.ecoScore}</span>
                          </div>
                          {/* Image Gallery Indicators */}
                          <div className="absolute bottom-2 left-0 right-0 flex justify-center items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                             {product.images.map((_, index) => (
                              <button
                                key={index}
                                onClick={(e) => handleImageIndicatorClick(e, product.id, index)}
                                className={`h-2 w-2 rounded-full transition-all duration-200 ${
                                  (cardImageIndexes[product.id] || 0) === index 
                                    ? 'bg-black/75 scale-110' 
                                    : 'bg-black/40 hover:bg-black/60'
                                }`}
                                aria-label={`View image ${index + 1}`}
                              />
                            ))}
                          </div>
                        </div>
                        
                        {/* Content Section */}
                        <div className="flex-1 flex flex-col p-3">
                          <div className="flex items-baseline gap-1.5 mb-1">
                            <span className="text-lg font-bold text-forest">{product.price}</span>
                            <span className="text-xs text-muted-foreground line-through">
                              {product.originalPrice}
                            </span>
                          </div>
                          
                          <h3 className="font-semibold text-charcoal text-sm leading-tight h-10 line-clamp-2">
                            {product.name}
                          </h3>

                          <div className="flex-1"></div>

                          <div className="pt-2 border-t border-border/20 mt-2">
                            <Button
                              className="w-full btn-secondary text-sm h-9"
                              onClick={() => handleAddToCart(product.name)}
                            >
                              <ShoppingCart className="w-4 h-4 mr-2" />
                              Add to Cart
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Carousel Navigation Buttons */}
                <Button
                  size="icon"
                  variant="ghost"
                  // ============== CHANGE 3: ARROWS SHIFTED ==============
                  className="absolute top-1/2 left-[-42px] transform -translate-y-1/2 text-charcoal hover:text-forest bg-background/50 hover:bg-background/80 rounded-full transition-all duration-300 z-20"
                  onClick={handlePrev}
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  // ============== CHANGE 3: ARROWS SHIFTED ==============
                  className="absolute top-1/2 right-[-42px] transform -translate-y-1/2 text-charcoal hover:text-forest bg-background/50 hover:bg-background/80 rounded-full transition-all duration-300 z-20"
                  onClick={handleNext}
                >
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>

              <div className="text-center pt-1">
                <Button variant="ghost" className="text-forest hover:text-forest/80 text-sm">
                  View All  →
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;