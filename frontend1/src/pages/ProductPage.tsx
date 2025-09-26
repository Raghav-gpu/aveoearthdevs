import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Star, 
  Heart, 
  ShoppingCart, 
  Leaf, 
  Share2,
  Minus,
  Plus,
  Shield,
  Truck,
  RotateCcw,
  Award,
  ChevronLeft,
  ChevronRight,
  TreePine,
  Recycle
} from 'lucide-react';

// Mock product data
const mockProduct = {
  id: 1,
  name: "Eco Bamboo Kitchen Utensil Set",
  price: "₹1,299",
  originalPrice: "₹1,899",
  discount: "32% OFF",
  images: [
    "/api/placeholder/600/600",
    "/api/placeholder/600/600",
    "/api/placeholder/600/600",
    "/api/placeholder/600/600"
  ],
  rating: 4.8,
  reviews: 234,
  ecoScore: "95%",
  badges: ["Zero Waste", "Renewable", "Durable"],
  inStock: true,
  stockCount: 23,
  category: "eco-home",
  brand: "EcoKitchen",
  description: "Transform your kitchen with our premium bamboo utensil set. Crafted from sustainable bamboo, these utensils are naturally antibacterial, durable, and gentle on your cookware. Each piece is hand-finished for a smooth, comfortable grip.",
  features: [
    "Made from 100% sustainable bamboo",
    "Naturally antibacterial and safe",
    "Heat resistant up to 200°C",
    "Gentle on non-stick surfaces",
    "Hand-finished for comfort",
    "Includes: Spoon, spatula, ladle, tongs, slotted spoon"
  ],
  ecoImpact: {
    carbonFootprint: "75% less than plastic alternatives",
    treesPlanted: "1 tree planted per purchase",
    recycledMaterial: "100% renewable bamboo",
    packaging: "Plastic-free packaging"
  },
  specifications: {
    material: "Premium Bamboo",
    dimensions: "30cm x 15cm x 5cm",
    weight: "250g",
    care: "Hand wash recommended",
    warranty: "2 years"
  }
};

const reviews = [
  {
    id: 1,
    user: "Priya M.",
    rating: 5,
    date: "2 weeks ago",
    comment: "Amazing quality! These bamboo utensils are so much better than plastic ones. Love the smooth finish.",
    verified: true
  },
  {
    id: 2,
    user: "Raj K.",
    rating: 4,
    date: "1 month ago",
    comment: "Great product for eco-conscious cooking. The tongs are particularly well-made.",
    verified: true
  },
  {
    id: 3,
    user: "Sarah L.",
    rating: 5,
    date: "3 weeks ago",
    comment: "Perfect for my non-stick pans. Very durable and comfortable to use.",
    verified: false
  }
];

const relatedProducts = [
  {
    id: 2,
    name: "Bamboo Cutting Board Set",
    price: "₹899",
    originalPrice: "₹1,299",
    image: "/api/placeholder/300/300",
    rating: 4.7,
    ecoScore: "92%"
  },
  {
    id: 3,
    name: "Organic Cotton Kitchen Towels",
    price: "₹649",
    originalPrice: "₹899",
    image: "/api/placeholder/300/300",
    rating: 4.6,
    ecoScore: "89%"
  },
  {
    id: 4,
    name: "Glass Food Storage Containers",
    price: "₹1,599",
    originalPrice: "₹2,199",
    image: "/api/placeholder/300/300",
    rating: 4.8,
    ecoScore: "96%"
  }
];

const ProductPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % mockProduct.images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + mockProduct.images.length) % mockProduct.images.length);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-forest">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/products" className="hover:text-forest">Products</Link>
          <span className="mx-2">/</span>
          <Link to={`/category/${mockProduct.category}`} className="hover:text-forest">
            {mockProduct.category}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-charcoal">{mockProduct.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative group">
              <img 
                src={mockProduct.images[selectedImage]}
                alt={mockProduct.name}
                className="w-full aspect-square object-cover rounded-2xl"
              />
              
              {/* Image Navigation */}
              <Button
                variant="ghost"
                size="sm"
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                <Badge className="eco-badge bg-forest text-white">
                  {mockProduct.ecoScore}
                </Badge>
                <Badge className="eco-badge bg-clay text-white">
                  {mockProduct.discount}
                </Badge>
              </div>
            </div>

            {/* Thumbnail Images */}
            <div className="flex gap-2 overflow-x-auto">
              {mockProduct.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? 'border-forest' : 'border-border'
                  }`}
                >
                  <img 
                    src={image}
                    alt={`${mockProduct.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <span>{mockProduct.brand}</span>
                <span>•</span>
                <span>SKU: ECO-{mockProduct.id}</span>
              </div>
              
              <h1 className="text-3xl lg:text-4xl font-headline font-bold text-charcoal mb-4">
                {mockProduct.name}
              </h1>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-5 h-5 ${
                        i < Math.floor(mockProduct.rating) 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'text-gray-300'
                      }`} 
                    />
                  ))}
                  <span className="font-medium ml-1">{mockProduct.rating}</span>
                </div>
                <span className="text-muted-foreground">({mockProduct.reviews} reviews)</span>
              </div>

              {/* Badges */}
              <div className="flex gap-2 mb-6">
                {mockProduct.badges.map((badge) => (
                  <Badge key={badge} className="eco-badge">
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-forest">{mockProduct.price}</span>
                <span className="text-xl text-muted-foreground line-through">
                  {mockProduct.originalPrice}
                </span>
                <Badge className="eco-badge bg-clay text-white">
                  {mockProduct.discount}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">Inclusive of all taxes</p>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${mockProduct.inStock ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className={`font-medium ${mockProduct.inStock ? 'text-green-600' : 'text-red-600'}`}>
                {mockProduct.inStock ? `In Stock (${mockProduct.stockCount} left)` : 'Out of Stock'}
              </span>
            </div>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed">
              {mockProduct.description}
            </p>

            {/* Quantity & Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-medium">Quantity:</span>
                <div className="flex items-center border border-border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={quantity >= mockProduct.stockCount}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-4">
                <Button className="btn-hero flex-1" disabled={!mockProduct.inStock}>
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`${isWishlisted ? 'text-red-500 border-red-500' : ''}`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </Button>
                <Button variant="outline">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-2xl">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-forest" />
                <span className="text-sm">2 Year Warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-forest" />
                <span className="text-sm">Free Shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-forest" />
                <span className="text-sm">Easy Returns</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-forest" />
                <span className="text-sm">Certified Eco</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="eco-impact">Eco Impact</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({mockProduct.reviews})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Product Description</h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {mockProduct.description}
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Specifications</h4>
                      <dl className="space-y-2">
                        {Object.entries(mockProduct.specifications).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <dt className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1')}</dt>
                            <dd className="font-medium">{value}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-3">Care Instructions</h4>
                      <ul className="space-y-2 text-muted-foreground">
                        <li>• Hand wash with mild soap</li>
                        <li>• Air dry completely</li>
                        <li>• Apply food-grade oil monthly</li>
                        <li>• Avoid soaking in water</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="features" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Key Features</h3>
                  <div className="grid gap-4">
                    {mockProduct.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-forest rounded-full" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="eco-impact" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-6">Environmental Impact</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <TreePine className="w-6 h-6 text-forest" />
                        <div>
                          <h4 className="font-semibold">Carbon Footprint</h4>
                          <p className="text-muted-foreground">{mockProduct.ecoImpact.carbonFootprint}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Leaf className="w-6 h-6 text-forest" />
                        <div>
                          <h4 className="font-semibold">Trees Planted</h4>
                          <p className="text-muted-foreground">{mockProduct.ecoImpact.treesPlanted}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Recycle className="w-6 h-6 text-forest" />
                        <div>
                          <h4 className="font-semibold">Material</h4>
                          <p className="text-muted-foreground">{mockProduct.ecoImpact.recycledMaterial}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Shield className="w-6 h-6 text-forest" />
                        <div>
                          <h4 className="font-semibold">Packaging</h4>
                          <p className="text-muted-foreground">{mockProduct.ecoImpact.packaging}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold">Customer Reviews</h3>
                    <Button variant="outline">Write Review</Button>
                  </div>
                  
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b border-border pb-6 last:border-b-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{review.user}</span>
                            {review.verified && (
                              <Badge className="eco-badge bg-green-100 text-green-800 text-xs">
                                Verified Purchase
                              </Badge>
                            )}
                          </div>
                          <span className="text-sm text-muted-foreground">{review.date}</span>
                        </div>
                        
                        <div className="flex items-center gap-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${
                                i < review.rating 
                                  ? 'fill-yellow-400 text-yellow-400' 
                                  : 'text-gray-300'
                              }`} 
                            />
                          ))}
                        </div>
                        
                        <p className="text-muted-foreground">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        <section className="mt-16">
          <h2 className="text-2xl font-headline font-bold text-charcoal mb-8">
            You might also like
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {relatedProducts.map((product) => (
              <Link key={product.id} to={`/product/${product.id}`}>
                <Card className="product-card group cursor-pointer">
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden rounded-t-2xl">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <Badge className="absolute top-2 left-2 eco-badge bg-forest text-white">
                        {product.ecoScore}
                      </Badge>
                    </div>
                    
                    <div className="p-4 space-y-3">
                      <h3 className="font-semibold text-charcoal group-hover:text-forest transition-colors">
                        {product.name}
                      </h3>
                      
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{product.rating}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-forest">{product.price}</span>
                        <span className="text-sm text-muted-foreground line-through">
                          {product.originalPrice}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProductPage;