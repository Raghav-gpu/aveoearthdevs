import { useState } from "react";
import { Home, Shirt, Palette, Sparkles, Cpu, ArrowRight } from "lucide-react";
// Assuming Card, Badge, and utility components are correctly imported
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// --- Custom Tailwind Styles (Simulated for Cohesion) ---
// Note: You must define these color classes in your tailwind.config.js
const customColors = {
    'moss-accent': { text: 'text-green-700', bgLight: 'bg-green-100', border: 'border-green-300' },
    'clay-accent': { text: 'text-orange-700', bgLight: 'bg-orange-100', border: 'border-orange-300' },
    'forest-deep': { text: 'text-charcoal', bgLight: 'bg-forest/10', border: 'border-forest/50' },
    'sage': { text: 'text-cyan-700', bgLight: 'bg-cyan-100', border: 'border-cyan-300' },
    // Re-using moss-accent for the 5th item for simplicity
    'default': { text: 'text-green-700', bgLight: 'bg-green-100', border: 'border-green-300' }, 
};

// --- Category Data (Updated to use a common accent color name for code clarity) ---
const categories = [
    {
        id: "zero-waste",
        name: "Zero-Waste Home",
        description: "Refillables, compostables, plastic-free daily goods",
        icon: Home,
        image: "path/to/category-zero-waste.jpg", // Placeholder for imported image
        colorKey: "moss-accent",
        products: [
            { name: "Bamboo Toothbrush Set", price: "₹299", eco: "Biodegradable" },
            { name: "Glass Storage Jars", price: "₹899", eco: "Reusable" },
            { name: "Beeswax Food Wraps", price: "₹549", eco: "Compostable" }
        ]
    },
    {
        id: "fashion",
        name: "Sustainable Fashion",
        description: "Ethically made wardrobe staples, repair kits",
        icon: Shirt,
        image: "path/to/category-fashion.jpg",
        colorKey: "clay-accent",
        products: [
            { name: "Organic Cotton Basics", price: "₹1,299", eco: "Organic" },
            { name: "Hemp Jacket", price: "₹3,499", eco: "Sustainable" },
            { name: "Repair Kit", price: "₹699", eco: "Circular" }
        ]
    },
    {
        id: "upcycled",
        name: "Upcycled & Handmade",
        description: "Artisan goods made from reclaimed materials",
        icon: Palette,
        image: "path/to/category-upcycled.jpg",
        colorKey: "forest-deep",
        products: [
            { name: "Reclaimed Wood Shelf", price: "₹2,899", eco: "Upcycled" },
            { name: "Handwoven Basket", price: "₹899", eco: "Handmade" },
            { name: "Clay Pottery Set", price: "₹1,599", eco: "Artisan" }
        ]
    },
    {
        id: "beauty",
        name: "Clean Beauty",
        description: "Cruelty-free, minimal packaging skincare",
        icon: Sparkles,
        image: "path/to/category-beauty.jpg",
        colorKey: "sage",
        products: [
            { name: "Natural Face Serum", price: "₹1,899", eco: "Cruelty-Free" },
            { name: "Bamboo Skincare Set", price: "₹2,499", eco: "Zero-Waste" },
            { name: "Crystal Face Roller", price: "₹799", eco: "Natural" }
        ]
    },
    {
        id: "green-tech",
        name: "Green Tech & Tools",
        description: "Energy-saving gadgets, solar accessories, durable gear",
        icon: Cpu,
        image: "path/to/category-green-tech.jpg",
        colorKey: "moss-accent",
        products: [
            { name: "Solar Power Bank", price: "₹2,299", eco: "Solar Powered" },
            { name: "Bamboo Phone Case", price: "₹699", eco: "Biodegradable" },
            { name: "Energy Monitor", price: "₹1,599", eco: "Energy Saving" }
        ]
    }
];

// Re-defining Categories component to use the Hero's aesthetic
const CategoriesGrid = () => {
    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

    return (
        <>
            {/* 1. External CSS for non-glitchy bubble animation. 
                You should move this to a global CSS file (e.g., globals.css)
            */}
            <style>{`
                @keyframes bubble-emerge {
                    from {
                        opacity: 0;
                        transform: scale(0.8) translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }
                .bubble-emerge {
                    animation: bubble-emerge 300ms cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                    opacity: 0; /* Start hidden */
                }
                /* Assuming 'font-headline' and 'charcoal' are defined by your global styles */
            `}</style>

            <section className="py-20 bg-background/90">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header: Uses Hero's font-headline and main colors */}
                    <div className="text-center mb-16">
                        <h2 className="text-4xl lg:text-5xl font-headline font-bold text-charcoal mb-4">
                            Explore Our <span className="text-forest">Categories</span>
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Curated collections for a sustainable lifestyle. Hover to see featured products.
                        </p>
                    </div>

                    {/* Categories Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {categories.map((category) => {
                            const IconComponent = category.icon;
                            const isHovered = hoveredCategory === category.id;
                            const colors = customColors[category.colorKey as keyof typeof customColors] || customColors.default;

                            return (
                                <div 
                                    key={category.id} 
                                    className="relative transition-all duration-300"
                                    onMouseEnter={() => setHoveredCategory(category.id)}
                                    onMouseLeave={() => setHoveredCategory(null)}
                                >
                                    <Card
                                        // Card styling: Matches Hero's product cards (bg-card, border, subtle shadow)
                                        className={`group cursor-pointer overflow-hidden bg-card/80 backdrop-blur-sm border border-border shadow-lg transition-all duration-300 hover:shadow-xl hover:border-${colors.border}`}
                                    >
                                        {/* Category Image Area */}
                                        <div className="relative h-48 overflow-hidden">
                                            <img
                                                // Using the imported image from the user's data
                                                src={category.image} 
                                                alt={category.name}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                            {/* Image Overlay (Darkened to improve text contrast) */}
                                            <div className="absolute inset-0 bg-charcoal/60 group-hover:bg-charcoal/40 transition-colors duration-300" />
                                            
                                            {/* Icon and Title Overlay */}
                                            <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                                                {/* Icon with white/translucent background for visual weight */}
                                                <div className="absolute top-4 left-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                                                    <IconComponent className={`h-6 w-6 ${colors.text}`} />
                                                </div>

                                                <h3 className="text-xl font-headline font-bold drop-shadow-md">
                                                    {category.name}
                                                </h3>
                                                <p className="text-sm opacity-90">
                                                    {category.description}
                                                </p>
                                            </div>
                                        </div>
                                    </Card>

                                    {/* Product Bubbles - Show on Hover (Positioned outside the card) */}
                                    {isHovered && (
                                        <div className="absolute -top-4 -right-4 z-20 space-y-2 pointer-events-none">
                                            {category.products.map((product, index) => (
                                                <div
                                                    key={product.name}
                                                    // Use the CSS keyframe class for smooth emergence
                                                    className={`bubble-emerge bg-background border border-border rounded-lg p-3 shadow-xl max-w-56 transform translate-x-2 pointer-events-auto`}
                                                    style={{
                                                        animationDelay: `${index * 100}ms`,
                                                    }}
                                                >
                                                    <div className="space-y-1">
                                                        {/* Text colors match Hero's charcoal/forest scheme */}
                                                        <h4 className="font-medium text-sm text-charcoal">{product.name}</h4>
                                                        <div className="flex items-center justify-between">
                                                            <span className="font-semibold text-forest">{product.price}</span>
                                                            <Badge className={`text-xs ${colors.bgLight} ${colors.text} border border-transparent`}>
                                                                {product.eco}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            {/* Link to category at the bottom of the bubbles */}
                                            <a 
                                                href={`/categories/${category.id}`} 
                                                className="block text-center pt-2 text-sm font-semibold text-forest hover:text-forest/80 pointer-events-auto"
                                            >
                                                View All →
                                            </a>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Main CTA - Matches the Hero's primary button style */}
                    <div className="text-center mt-16">
                        <button className="bg-forest hover:bg-forest/90 text-white px-10 py-3 rounded-full font-semibold text-lg transition-colors duration-200 shadow-xl shadow-green-200/50">
                            View All Collections
                        </button>
                    </div>
                </div>
            </section>
        </>
    );
};

export default CategoriesGrid;