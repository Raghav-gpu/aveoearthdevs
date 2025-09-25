import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Shirt, 
  Recycle, 
  Sparkles, 
  Zap,
  ArrowRight
} from 'lucide-react';

const categories = [
  {
    id: 'zero-waste',
    title: 'Zero-Waste Home',
    description: 'Refillables, compostables, plastic-free daily goods',
    icon: Home,
    color: 'bg-moss/20',
    products: [
      { name: 'Bamboo Toothbrush Set', price: '₹299' },
      { name: 'Glass Storage Jars', price: '₹899' },
      { name: 'Compostable Plates', price: '₹199' }
    ]
  },
  {
    id: 'fashion',
    title: 'Sustainable Fashion',
    description: 'Ethically made wardrobe staples, repair kits',
    icon: Shirt,
    color: 'bg-clay/20',
    products: [
      { name: 'Organic Cotton T-Shirt', price: '₹1,299' },
      { name: 'Hemp Jeans', price: '₹2,999' },
      { name: 'Repair Kit Bundle', price: '₹699' }
    ]
  },
  {
    id: 'upcycled',
    title: 'Upcycled & Handmade',
    description: 'Artisan goods made from reclaimed materials',
    icon: Recycle,
    color: 'bg-forest/20',
    products: [
      { name: 'Reclaimed Wood Shelf', price: '₹3,499' },
      { name: 'Upcycled Bag Collection', price: '₹1,899' },
      { name: 'Handwoven Baskets', price: '₹1,199' }
    ]
  },
  {
    id: 'beauty',
    title: 'Clean Beauty & Self-Care',
    description: 'Cruelty-free, minimal packaging skincare',
    icon: Sparkles,
    color: 'bg-secondary/20',
    products: [
      { name: 'Natural Face Serum', price: '₹1,699' },
      { name: 'Solid Shampoo Bar', price: '₹399' },
      { name: 'Bamboo Brush Set', price: '₹799' }
    ]
  },
  {
    id: 'tech',
    title: 'Green Tech & Tools',
    description: 'Energy-saving gadgets, solar accessories, durable gear',
    icon: Zap,
    color: 'bg-accent/20',
    products: [
      { name: 'Solar Power Bank', price: '₹2,999' },
      { name: 'Energy Monitor', price: '₹1,499' },
      { name: 'Eco Phone Case', price: '₹699' }
    ]
  }
];

const CategoryBubbles = () => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  return (
    <section className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-headline font-bold text-charcoal mb-4">
            Shop by Category
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover sustainable products across all aspects of your life
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => {
            const IconComponent = category.icon;
            const isHovered = hoveredCategory === category.id;
            
            return (
              <div
                key={category.id}
                className="category-bubble group"
                onMouseEnter={() => setHoveredCategory(category.id)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <div className={`${category.color} p-8 h-full rounded-3xl border border-border/10`}>
                  <div className="space-y-6">
                    {/* Category Header */}
                    <div className="space-y-3">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-soft">
                        <IconComponent className="w-8 h-8 text-forest" />
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-headline font-bold text-charcoal mb-2">
                          {category.title}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          {category.description}
                        </p>
                      </div>
                    </div>

                    {/* Product Previews */}
                    <div 
                      className={`space-y-3 transition-all duration-500 ${
                        isHovered ? 'opacity-100 max-h-48' : 'opacity-0 max-h-0'
                      } overflow-hidden`}
                    >
                      {category.products.map((product, index) => (
                        <div 
                          key={index}
                          className="bg-white/80 backdrop-blur-sm rounded-xl p-3 flex justify-between items-center"
                          style={{ 
                            transform: isHovered ? 'translateY(0)' : 'translateY(20px)',
                            transition: `all 0.3s ease ${index * 0.1}s`
                          }}
                        >
                          <span className="text-sm font-medium text-charcoal">
                            {product.name}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {product.price}
                          </Badge>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <div className="pt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-forest">
                          Explore Collection
                        </span>
                        <ArrowRight 
                          className={`w-5 h-5 text-forest transition-transform duration-300 ${
                            isHovered ? 'translate-x-1' : ''
                          }`} 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Categories */}
        <div className="text-center mt-12">
          <Badge className="eco-badge text-sm px-4 py-2">
            🌱 New categories added monthly
          </Badge>
        </div>
      </div>
    </section>
  );
};

export default CategoryBubbles;