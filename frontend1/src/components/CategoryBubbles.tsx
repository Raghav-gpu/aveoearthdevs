import { useState } from "react";
import { Home, Shirt, Palette, Sparkles, Cpu } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// 1. 🖼️ CORRECT IMAGE IMPORTS (using relative paths)
import zeroWasteImage from "../assets/category-zero-waste(1).jpg"; 
import fashionImage from "../assets/category-zero-waste(2).jpg";   
import beautyImage from "../assets/category-zero-waste(3).jpg";
import upcycledImage from "../assets/category-zero-waste(4).jpg";
import greenTechImage from "../assets/category-zero-waste(5).jpg";


// --- Custom Tailwind Colors (Simulated for Cohesion) ---
const customColors = {
    'moss-accent': { text: 'text-green-700', bgLight: 'bg-green-100', border: 'border-green-300' },
    'clay-accent': { text: 'text-orange-700', bgLight: 'bg-orange-100', border: 'border-orange-300' },
    'forest-deep': { text: 'text-gray-800', bgLight: 'bg-gray-200', border: 'border-gray-400' },
    'sage': { text: 'text-cyan-700', bgLight: 'bg-cyan-100', border: 'border-cyan-300' },
    'default': { text: 'text-green-700', bgLight: 'bg-green-100', border: 'border-green-300' }, 
};

// --- Category Data (Using imported variables) ---
const categories = [
    {
        id: "zero-waste",
        name: "Zero-Waste Home",
        description: "Refillables, compostables, plastic-free daily goods",
        icon: Home,
        image: zeroWasteImage, 
        colorKey: "moss-accent",
        products: [
            { name: "Bamboo Brush Set", price: "₹299", eco: "Biodegradable" },
            { name: "Glass Jars", price: "₹899", eco: "Reusable" },
            { name: "Beeswax Wraps", price: "₹549", eco: "Compostable" }
        ]
    },
    {
        id: "fashion",
        name: "Sustainable Fashion",
        description: "Ethically made wardrobe staples, repair kits",
        icon: Shirt,
        image: fashionImage,
        colorKey: "clay-accent",
        products: [
            { name: "Organic Tees", price: "₹1,299", eco: "Organic" },
            { name: "Hemp Jacket", price: "₹3,499", eco: "Sustainable" },
            { name: "Repair Kit", price: "₹699", eco: "Circular" }
        ]
    },
    {
        id: "upcycled",
        name: "Upcycled & Handmade",
        description: "Artisan goods made from reclaimed materials",
        icon: Palette,
        image: upcycledImage,
        colorKey: "forest-deep",
        products: [
            { name: "Reclaimed Shelf", price: "₹2,899", eco: "Upcycled" },
            { name: "Handwoven Basket", price: "₹899", eco: "Handmade" },
            { name: "Clay Pottery", price: "₹1,599", eco: "Artisan" }
        ]
    },
    {
        id: "beauty",
        name: "Clean Beauty",
        description: "Cruelty-free, minimal packaging skincare",
        icon: Sparkles,
        image: beautyImage,
        colorKey: "sage",
        products: [
            { name: "Natural Serum", price: "₹1,899", eco: "Cruelty-Free" },
            { name: "Bamboo Skincare", price: "₹2,499", eco: "Zero-Waste" },
            { name: "Face Roller", price: "₹799", eco: "Natural" }
        ]
    },
    {
        id: "green-tech",
        name: "Green Tech & Tools",
        description: "Energy-saving gadgets, solar accessories, durable gear",
        icon: Cpu,
        image: greenTechImage,
        colorKey: "moss-accent",
        products: [
            { name: "Solar Power Bank", price: "₹2,299", eco: "Solar Powered" },
            { name: "Bamboo Phone Case", price: "₹699", eco: "Biodegradable" },
            { name: "Energy Monitor", price: "₹1,599", eco: "Energy Saving" }
        ]
    }
];

// --- Categories Component ---

const CategoriesGrid = () => {
    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

    // Fixed width for the hover bubble container
    const bubbleWidth = 200; 
    
    // To achieve the 55% overlap:
    const overlapMargin = -(bubbleWidth * 0.55); // -110

    // Adjusted height to 212px for 10px padding top/bottom (192px image + 20px)
    const newHeight = 212; 

    return (
        <>
            {/* Animation CSS */}
            <style>{`
                @keyframes bubble-emerge {
                    from { opacity: 0; transform: scale(0.8) translateY(10px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                .bubble-emerge {
                    animation: bubble-emerge 300ms cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                    opacity: 0; 
                }
            `}</style>

            <section className="py-20 bg-background/90">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
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
                                        className={`group cursor-pointer overflow-hidden bg-card/80 backdrop-blur-sm border border-border shadow-lg transition-all duration-300 hover:shadow-xl hover:border-${colors.border}`}
                                    >
                                        {/* Category Image Area */}
                                        <div className="relative h-48 overflow-hidden">
                                            <img
                                                src={category.image} 
                                                alt={category.name}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                            {/* Image Overlay and Text... (unchanged) */}
                                            <div className="absolute inset-0 bg-charcoal/60 group-hover:bg-charcoal/40 transition-colors duration-300" />
                                            
                                            <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
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

                                    {/* Product Bubbles - VERTICALLY CENTERED */}
                                    {isHovered && (
                                        <div 
                                            // 1. Removed top-[-10px]
                                            // 2. Added items-center for vertical centering
                                            className="absolute top-0 left-[100%] z-20 flex flex-col items-center justify-center space-y-3 pointer-events-none"
                                            style={{ 
                                                // Setting height equal to the image + 20px buffer
                                                height: `${newHeight}px`, 
                                                width: `${bubbleWidth}px`, 
                                                marginLeft: `${overlapMargin}px` 
                                            }} 
                                        >
                                            <div className="space-y-3">
                                                {/* Increased space-y to 3 for visual separation */}
                                                {category.products.map((product, index) => (
                                                    <div
                                                        key={product.name}
                                                        className={`bubble-emerge bg-white border border-border rounded-lg p-3 shadow-xl w-full transform translate-x-0 pointer-events-auto`}
                                                        style={{
                                                            animationDelay: `${index * 80}ms`,
                                                        }}
                                                    >
                                                        <div className="space-y-1">
                                                            <h4 className="font-medium text-sm text-charcoal truncate">{product.name}</h4>
                                                            <div className="flex items-center justify-between">
                                                                <span className="font-semibold text-base text-forest">{product.price}</span>
                                                                <Badge className={`text-xs px-1.5 py-0.5 ${colors.bgLight} ${colors.text} border border-transparent`}>
                                                                    {product.eco}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Main CTA */}
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