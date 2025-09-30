import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from "react-router-dom"; 
import { 
  Search, 
  ShoppingCart, 
  User, 
  Heart,
  Menu,
  Leaf,
  TreePine,
  Recycle,
  X
} from 'lucide-react';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Categories', href: '/category' },
    { label: 'New Arrivals', href: '/products' },
    { label: 'Best Sellers', href: '/products' },
    { label: 'Community', href: '/community' },
    { label: 'About Us', href: '/about' },
    
  ];

  return (
    <>
      {/* Impact Banner */}
      <div className="bg-forest text-primary-foreground py-2 px-4 text-center text-sm">
        <div className="flex items-center justify-center gap-4 max-w-4xl mx-auto">
          <div className="flex items-center gap-1">
            <TreePine className="w-4 h-4" />
            <span>2,847 trees planted this month</span>
          </div>
          <div className="hidden md:flex items-center gap-1">
            <Recycle className="w-4 h-4" />
            <span>15.2T CO₂ offset</span>
          </div>
          <div className="hidden lg:flex items-center gap-1">
            <Leaf className="w-4 h-4" />
            <span>500K+ plastic items saved</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-moss rounded-xl flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-headline font-bold text-charcoal">
                  AveoEarth
                </h1>
                <div className="text-xs text-moss">Sustainable Marketplace</div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="text-muted-foreground hover:text-forest transition-colors duration-200 font-medium"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Search Bar */}
            <div className="hidden md:flex items-center max-w-md flex-1 mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search sustainable products..."
                  className="w-full pl-10 pr-4 py-2 rounded-2xl border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest transition-all duration-200"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Mobile Search */}
              <Button variant="ghost" size="sm" className="md:hidden text-muted-foreground hover:text-forest">
                <Search className="w-5 h-5" />
              </Button>

              {/* Wishlist */}
              <Button asChild variant="ghost" size="sm" className="hidden md:flex text-muted-foreground hover:text-forest relative">
                <Link to="/wishlist">
                  <Heart className="w-5 h-5" />
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-clay text-white text-xs p-0 flex items-center justify-center">3</Badge>
                </Link>
              </Button>

              {/* Cart */}
              <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-forest relative">
                <Link to="/cart">
                  <ShoppingCart className="w-5 h-5" />
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-forest text-white text-xs p-0 flex items-center justify-center">2</Badge>
                </Link>
              </Button>

              {/* User Account */}
              <Button asChild variant="ghost" size="sm" className="hidden md:flex text-muted-foreground hover:text-forest">
                <Link to="/profile">
                  <User className="w-5 h-5" />
                </Link>
              </Button>

              {/* Become Partner */}
              <Button className="hidden lg:flex btn-secondary text-sm">Become a Partner</Button>

              {/* Mobile Menu */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden text-muted-foreground hover:text-forest"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-border/20 bg-background">
            <div className="container mx-auto px-4 py-4 space-y-4">
              {/* Mobile Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search sustainable products..."
                  className="w-full pl-10 pr-4 py-2 rounded-2xl border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
                />
              </div>

              {/* Mobile Navigation */}
              <nav className="space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    to={item.href}
                    className="block py-2 text-muted-foreground hover:text-forest transition-colors duration-200 font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              {/* Mobile Actions */}
              <div className="flex items-center gap-4 pt-4 border-t border-border/20">
                <Button asChild variant="ghost" className="flex-1 justify-start">
                  <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                    <User className="w-4 h-4 mr-2" /> Account
                  </Link>
                </Button>
                <Button asChild variant="ghost" className="flex-1 justify-start">
                  <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)}>
                    <Heart className="w-4 h-4 mr-2" /> Wishlist
                  </Link>
                </Button>
              </div>

              <Button className="w-full btn-secondary">Become a Partner</Button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
