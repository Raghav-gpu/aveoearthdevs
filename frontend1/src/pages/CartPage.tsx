import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingCart,
  Leaf,
  Shield,
  Truck,
  Tag,
  ArrowRight,
  Heart,
  Lock,
} from "lucide-react";

// Mock cart data
const mockCartItems = [
  {
    id: 1,
    name: "Eco Bamboo Kitchen Utensil Set",
    price: 1299,
    originalPrice: 1899,
    image: "/api/placeholder/200/200",
    quantity: 2,
    ecoScore: "95%",
    badges: ["Zero Waste", "Renewable"],
    inStock: true,
    savings: 600,
  },
  {
    id: 2,
    name: "Organic Cotton T-Shirt",
    price: 899,
    originalPrice: 1299,
    image: "/api/placeholder/200/200",
    quantity: 1,
    ecoScore: "89%",
    badges: ["Organic", "Fair Trade"],
    inStock: true,
    savings: 400,
  },
  {
    id: 3,
    name: "Natural Face Serum",
    price: 1599,
    originalPrice: 2199,
    image: "/api/placeholder/200/200",
    quantity: 1,
    ecoScore: "96%",
    badges: ["Cruelty-Free", "Vegan"],
    inStock: false,
    savings: 600,
  },
];

const recommendedItems = [
  {
    id: 4,
    name: "Bamboo Toothbrush Set",
    price: "₹299",
    originalPrice: "₹449",
    image: "/api/placeholder/150/150",
    ecoScore: "92%",
  },
  {
    id: 5,
    name: "Reusable Food Wraps",
    price: "₹549",
    originalPrice: "₹799",
    image: "/api/placeholder/150/150",
    ecoScore: "88%",
  },
];

const CartPage = () => {
  const [cartItems, setCartItems] = useState(mockCartItems);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity === 0) {
      removeItem(id);
      return;
    }

    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const moveToWishlist = (id: number) => {
    removeItem(id);
  };

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "eco10") {
      setAppliedPromo("ECO10");
      setPromoCode("");
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const totalSavings = cartItems.reduce(
    (sum, item) => sum + item.savings * item.quantity,
    0
  );
  const promoDiscount = appliedPromo ? Math.floor(subtotal * 0.1) : 0;
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal - promoDiscount + shipping;

  const outOfStockItems = cartItems.filter((item) => !item.inStock);
  const inStockItems = cartItems.filter((item) => item.inStock);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-16">
        <div className="text-center space-y-6 max-w-md">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-3xl font-headline font-bold text-charcoal">
            Your cart is empty
          </h1>
          <p className="text-muted-foreground">
            Start shopping for sustainable products that make a difference.
          </p>
          <Button
            asChild
            className="btn-hero bg-gradient-to-r from-forest to-clay text-white"
          >
            <Link to="/products">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Start Shopping
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-10 text-center lg:text-left">
          <h1 className="text-3xl lg:text-4xl font-headline font-bold text-charcoal mb-2">
            Shopping Cart
          </h1>
          <p className="text-muted-foreground">
            {cartItems.length} item{cartItems.length !== 1 ? "s" : ""} in your
            cart
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-8">
            {/* Out of Stock Items */}
            {outOfStockItems.length > 0 && (
              <Card className="border-destructive/20">
                <CardHeader>
                  <CardTitle className="text-destructive text-lg">
                    Out of Stock Items
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {outOfStockItems.map((item) => (
                    <div key={item.id} className="flex gap-4 opacity-70">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg shadow-sm"
                      />
                      <div className="flex-1 space-y-2">
                        <h3 className="font-semibold text-charcoal">
                          {item.name}
                        </h3>
                        <div className="flex gap-2">
                          {item.badges.slice(0, 2).map((badge) => (
                            <Badge
                              key={badge}
                              className="bg-muted/30 text-xs rounded-md"
                            >
                              {badge}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-destructive font-medium">
                            Out of Stock
                          </span>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => moveToWishlist(item.id)}
                            >
                              <Heart className="w-4 h-4 mr-1" />
                              Save for later
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* In Stock Items */}
            <Card>
              <CardContent className="p-8 space-y-8">
                {inStockItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-6 border-b border-border pb-6 last:border-0"
                  >
                    <Link to={`/product/${item.id}`}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-xl shadow-sm hover:scale-105 transition-transform"
                      />
                    </Link>

                    <div className="flex-1 space-y-3">
                      <div className="space-y-2">
                        <Link
                          to={`/product/${item.id}`}
                          className="font-semibold text-charcoal hover:text-forest transition-colors"
                        >
                          {item.name}
                        </Link>

                        <div className="flex gap-2">
                          <Badge className="bg-forest/10 text-forest font-medium text-xs px-2 py-1 rounded-md">
                            {item.ecoScore}
                          </Badge>
                          {item.badges.slice(0, 2).map((badge) => (
                            <Badge
                              key={badge}
                              className="bg-muted/30 text-xs rounded-md"
                            >
                              {badge}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-forest">
                            ₹{item.price}
                          </span>
                          <span className="text-sm text-muted-foreground line-through">
                            ₹{item.originalPrice}
                          </span>
                          <Badge className="bg-clay text-white text-xs px-2 py-1 rounded-md">
                            Save ₹{item.savings}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-border rounded-lg">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="px-4 py-2 font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveToWishlist(item.id)}
                          >
                            <Heart className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recommended Items */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">You might also like</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {recommendedItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 p-4 bg-muted/30 rounded-xl hover:shadow-lg transition-shadow"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1 space-y-1">
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-bold text-forest">
                            {item.price}
                          </span>
                          <span className="text-xs text-muted-foreground line-through">
                            {item.originalPrice}
                          </span>
                        </div>
                        <Badge className="bg-forest/10 text-forest text-xs px-2 py-1 rounded-md">
                          {item.ecoScore}
                        </Badge>
                        <Button size="sm" className="w-full mt-2">
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-8">
            {/* Promo Code */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  Promo Code
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    className="rounded-lg focus:ring-2 focus:ring-forest/50"
                    placeholder="Enter promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                  <Button
                    variant="outline"
                    onClick={applyPromoCode}
                    disabled={!promoCode.trim()}
                  >
                    Apply
                  </Button>
                </div>

                {appliedPromo && (
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium text-green-700">
                      {appliedPromo} applied!
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setAppliedPromo(null)}
                    >
                      Remove
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>
                      Subtotal (
                      {inStockItems.reduce(
                        (sum, item) => sum + item.quantity,
                        0
                      )}{" "}
                      items)
                    </span>
                    <span>₹{subtotal}</span>
                  </div>

                  <div className="flex justify-between text-green-600">
                    <span>You're saving</span>
                    <span>-₹{totalSavings}</span>
                  </div>

                  {appliedPromo && (
                    <div className="flex justify-between text-green-600">
                      <span>Promo discount ({appliedPromo})</span>
                      <span>-₹{promoDiscount}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
                  </div>

                  {shipping > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Add ₹{1000 - subtotal} more for free shipping
                    </p>
                  )}
                </div>

                <hr className="border-border" />

                <div className="flex justify-between font-bold text-lg bg-forest/10 p-4 rounded-lg">
                  <span>Total</span>
                  <span className="text-forest">₹{total}</span>
                </div>

                <Button
                  className="w-full btn-hero"
                  disabled={inStockItems.length === 0}
                  asChild
                >
                  <Link to="/checkout">
                    <Lock className="w-4 h-4 mr-2" />
                    Proceed to Checkout
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-border">
                  <div className="text-center">
                    <Shield className="w-5 h-5 text-forest mx-auto mb-1" />
                    <span className="text-xs text-muted-foreground">
                      Secure
                    </span>
                  </div>
                  <div className="text-center">
                    <Truck className="w-5 h-5 text-forest mx-auto mb-1" />
                    <span className="text-xs text-muted-foreground">
                      Fast Ship
                    </span>
                  </div>
                  <div className="text-center">
                    <Leaf className="w-5 h-5 text-forest mx-auto mb-1" />
                    <span className="text-xs text-muted-foreground">
                      Eco-friendly
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Eco Impact */}
            <Card className="bg-gradient-to-r from-forest to-moss text-white">
              <CardContent className="p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Your Eco Impact</h3>
                <p className="text-sm opacity-90">
                  This order will save approximately{" "}
                  <strong>2.3kg CO₂</strong> and plant <strong>3 trees</strong>!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
