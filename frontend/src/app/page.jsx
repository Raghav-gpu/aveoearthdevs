import Image from "next/image";
import Link from "next/link";
import ProductCard from "../components/ui/ProductCard";
import HotDealsSection from "../components/esg/HotDealsSection";
import TopCategoriesSection from "../components/esg/TopCategoriesSection";
import BestSellersSection from "../components/esg/BestSellersSection";
import ProductRecommendations from "../components/search/ProductRecommendations";
import Footer from "../components/layout/Footer";
import Button from "../components/ui/Button";

export const metadata = {
  title: "AveoEarth - Sustainable Marketplace for Eco-Conscious Living",
  description: "Join the largest sustainability-focused marketplace. Discover verified eco-friendly products from conscious vendors. Every purchase makes an impact.",
};

// Category Navigation Component
function CategoryNavigation() {
  return (
    <div className="content-stretch flex gap-[55.778px] sm:gap-4 md:gap-8 lg:gap-[55.778px] items-center justify-center relative w-full py-6 overflow-x-auto" style={{ background: 'var(--color-surface-eco)' }} data-node-id="93:5379">
      <Link href="/explore?category=home-living" className="content-stretch flex gap-[7.968px] sm:gap-2 items-center justify-start relative shrink-0 hover:opacity-80 transition-opacity cursor-pointer min-w-max" data-name="text w icon" data-node-id="93:5380">
        <div className="relative shrink-0 size-[23.905px] sm:size-5" data-name="icons" data-node-id="93:5381">
          <div className="absolute inset-0 w-full h-full flex items-center justify-center" data-name="Color Fill">
            <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.5 0.5L17 5.5V16.5H11V10.5H6V16.5H0V5.5L8.5 0.5Z" fill="currentColor"/>
            </svg>
          </div>
        </div>
        <div className="flex flex-col font-reem font-medium justify-center leading-[0] relative shrink-0 text-[var(--color-eco-primary)] text-[19.921px] sm:text-sm md:text-base lg:text-[19.921px] text-nowrap" data-node-id="93:5382">
          <p className="leading-[normal] whitespace-pre">Home & Living</p>
        </div>
      </Link>
      
      <Link href="/explore?category=fashion" className="content-stretch flex gap-[7.968px] sm:gap-2 items-center justify-start relative shrink-0 hover:opacity-80 transition-opacity cursor-pointer min-w-max" data-name="text w icon" data-node-id="93:5383">
        <div className="relative shrink-0 size-[23.905px] sm:size-5" data-name="icons" data-node-id="93:5384">
          <div className="w-full h-full flex items-center justify-center text-[#52494a]">
            <svg width="20" height="18" viewBox="0 0 25 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.1425 3.23573L15.2371 3.22876L15.3487 3.23274L15.4612 3.24967L15.5738 3.27955L21.55 5.27163C21.7296 5.33152 21.8885 5.44138 22.0079 5.58833C22.1273 5.73528 22.2024 5.91323 22.2243 6.10133L22.2313 6.21687V11.197C22.2312 11.441 22.1417 11.6765 21.9796 11.8588C21.8175 12.0411 21.5941 12.1576 21.3518 12.1861L21.2352 12.1931H19.2432V19.1653C19.2433 19.6679 19.0535 20.152 18.7118 20.5205C18.3701 20.889 17.9017 21.1147 17.4005 21.1524L17.2511 21.1574H7.29073C6.78815 21.1576 6.30409 20.9678 5.93557 20.626C5.56706 20.2843 5.34133 19.8159 5.30364 19.3147L5.29866 19.1653V12.1931H3.30658C3.06262 12.1931 2.82715 12.1035 2.64484 11.9414C2.46254 11.7793 2.34606 11.5559 2.31752 11.3136L2.31055 11.197V6.21687C2.31048 6.02747 2.36442 5.84197 2.46604 5.68214C2.56765 5.52231 2.71273 5.39476 2.88426 5.31446L2.99184 5.27163L8.96806 3.27955C9.11779 3.22968 9.27724 3.2161 9.43325 3.23994C9.58926 3.26378 9.73738 3.32435 9.86539 3.41667C9.9934 3.50898 10.0976 3.63039 10.1695 3.77089C10.2414 3.91139 10.2789 4.06697 10.2788 4.22479C10.2765 4.74172 10.4752 5.2393 10.833 5.61242C11.1908 5.98554 11.6796 6.20498 12.1962 6.22438C12.7127 6.24377 13.2166 6.06161 13.6013 5.71637C13.9861 5.37112 14.2216 4.88984 14.258 4.3742L14.267 4.13515L14.2839 4.0226L14.3208 3.88913L14.3646 3.78654L14.4144 3.6949L14.4821 3.60227L14.5508 3.52259C14.606 3.46946 14.6641 3.42298 14.7251 3.38314L14.8208 3.33035L14.9234 3.28653L15.0309 3.25465L15.1425 3.23573Z" fill="#52494A"/>
            </svg>
          </div>
        </div>
        <div className="flex flex-col font-reem font-medium justify-center leading-[0] relative shrink-0 text-[var(--color-eco-primary)] text-[19.921px] sm:text-sm md:text-base lg:text-[19.921px] text-nowrap" data-node-id="93:5385">
          <p className="leading-[normal] whitespace-pre">Fashion</p>
        </div>
      </Link>
      
      <Link href="/explore?category=food-beverage" className="content-stretch flex gap-[7.968px] sm:gap-2 items-center justify-start relative shrink-0 hover:opacity-80 transition-opacity cursor-pointer min-w-max" data-name="text w icon" data-node-id="93:5386">
        <div className="h-[20.917px] sm:h-4 relative shrink-0 w-[19.423px] sm:w-4 flex items-center justify-center text-[#52494a]" data-name="Vector" data-node-id="93:5387">
          <svg width="19" height="21" viewBox="0 0 19 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.5 0C11.7 0 13.5 1.8 13.5 4C13.5 6.2 11.7 8 9.5 8C7.3 8 5.5 6.2 5.5 4C5.5 1.8 7.3 0 9.5 0ZM9.5 10C14.2 10 18 11.9 18 14.5V17C18 18.1 17.1 19 16 19H3C1.9 19 1 18.1 1 17V14.5C1 11.9 4.8 10 9.5 10Z" fill="currentColor"/>
          </svg>
        </div>
        <div className="flex flex-col font-reem font-medium justify-center leading-[0] relative shrink-0 text-[var(--color-eco-primary)] text-[19.921px] sm:text-sm md:text-base lg:text-[19.921px] text-nowrap" data-node-id="93:5388">
          <p className="leading-[normal] whitespace-pre">Food & Beverage</p>
        </div>
      </Link>
      
      <Link href="/explore?category=beauty-personal-care" className="content-stretch flex gap-[7.968px] sm:gap-2 items-center justify-start relative shrink-0 hover:opacity-80 transition-opacity cursor-pointer min-w-max" data-name="text w icon" data-node-id="93:5389">
        <div className="h-[15.836px] sm:h-4 relative shrink-0 w-[18.405px] sm:w-4 flex items-center justify-center text-[#52494a]" data-name="Vector" data-node-id="93:5390">
          <svg width="18" height="16" viewBox="0 0 19 16" fill="none" xmlns="http://www.w3.org/2000/svg">
           <path fillRule="evenodd" clipRule="evenodd" d="M1.59921 1.99719C2.53314 1.06355 3.79964 0.539062 5.1202 0.539062C6.44077 0.539062 7.70727 1.06355 8.64119 1.99719C8.8238 2.17914 9.05886 2.40557 9.34639 2.67649C9.63325 2.40557 9.86798 2.17914 10.0506 1.99719C10.9806 1.07155 12.2383 0.550334 13.5505 0.54682C14.8626 0.543306 16.1231 1.05778 17.0581 1.97843C17.993 2.89908 18.5269 4.15151 18.5436 5.46355C18.5603 6.77559 18.0585 8.04122 17.1473 8.98539L10.0496 16.0831C9.8628 16.2699 9.6095 16.3748 9.34539 16.3748C9.08128 16.3748 8.82798 16.2699 8.64119 16.0831L1.54344 8.98638C0.633098 8.04752 0.128575 6.78826 0.138825 5.48056C0.149075 4.17287 0.674271 2.92167 1.59921 1.99719Z" fill="#52494A"/>
          </svg>
        </div>
        <div className="flex flex-col font-reem font-medium justify-center leading-[0] relative shrink-0 text-[var(--color-eco-primary)] text-[19.921px] sm:text-sm md:text-base lg:text-[19.921px] text-nowrap" data-node-id="93:5391">
          <p className="leading-[normal] whitespace-pre">Beauty & Personal Care</p>
        </div>
      </Link>
      
      <Link href="/explore?category=pets" className="content-stretch flex gap-[7.968px] sm:gap-2 items-center justify-start relative shrink-0 hover:opacity-80 transition-opacity cursor-pointer min-w-max" data-name="text w icon" data-node-id="93:5392">
        <div className="relative shrink-0 size-[23.905px] sm:size-5" data-name="icons" data-node-id="93:5393">
          <div className="absolute inset-0 w-full h-full flex items-center justify-center" data-name="Color Fill">
            <svg viewBox="0 0 64 64" width="24" height="24" fill="currentColor" aria-hidden="true">
              <circle cx="18" cy="22" r="6"/>
              <circle cx="28" cy="14" r="6"/>
              <circle cx="36" cy="14" r="6"/>
              <circle cx="46" cy="22" r="6"/>
              <ellipse cx="32" cy="44" rx="16" ry="13"/>
            </svg>

          </div>
        </div>
        <div className="flex flex-col font-reem font-medium justify-center leading-[0] relative shrink-0 text-[var(--color-eco-primary)] text-[19.921px] sm:text-sm md:text-base lg:text-[19.921px] text-nowrap" data-node-id="93:5394">
          <p className="leading-[normal] whitespace-pre">Pets</p>
        </div>
      </Link>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-hero-gradient relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-eco-gradient opacity-20 rounded-full animate-blob"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-eco-gradient opacity-15 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-eco-gradient opacity-10 rounded-full animate-blob" style={{ animationDelay: '4s' }}></div>
        <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-eco-gradient opacity-25 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Hero Section - Enhanced Modern Design */}
      <div className="relative z-10 min-h-screen flex items-center justify-center py-16 lg:py-20">
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-4 sm:left-10 w-32 h-32 bg-eco-gradient opacity-20 rounded-full animate-blob"></div>
          <div className="absolute top-40 right-4 sm:right-20 w-24 h-24 bg-eco-gradient opacity-15 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-eco-gradient opacity-10 rounded-full animate-blob" style={{ animationDelay: '4s' }}></div>
          <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-eco-gradient opacity-25 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        </div>
        
        {/* Main Hero Content - Enhanced Layout */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">
          
            {/* Left Side - Enhanced Hero Content */}
            <div className="text-center lg:text-left space-y-8">
              
              {/* Enhanced Main Heading */}
              <div className="space-y-6">
                <div className="relative">
                  <h1 className="text-5xl sm:text-6xl lg:text-7xl font-reem font-bold leading-tight">
                    <span className="text-[var(--color-eco-primary)] block animate-slide-in-up">
                    🌱 Eco-Conscious
                    </span>
                    <span className="text-black block font-inter font-bold tracking-tight animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
                    Marketplace
                    </span>
                  </h1>
                  <div className="w-24 h-1 bg-eco-gradient rounded-full mx-auto lg:mx-0 mt-6 animate-shimmer"></div>
                </div>
                
                {/* Enhanced Subtitle */}
                <div className="space-y-6 animate-slide-in-up" style={{ animationDelay: '0.4s' }}>
                  <p className="text-lg sm:text-xl text-[var(--color-eco-secondary)] font-poppins leading-relaxed max-w-2xl mx-auto lg:mx-0">
                    Connect with verified sustainable vendors and create positive impact with every purchase
                  </p>
                  
                  {/* Enhanced Feature Points */}
                  <div className="space-y-4 text-base sm:text-lg text-[var(--color-eco-secondary)] font-poppins">
                    <div className="flex items-center justify-center lg:justify-start gap-4 group">
                      <div className="w-12 h-12 bg-eco-gradient/20 rounded-full flex items-center justify-center group-hover:bg-eco-gradient/30 transition-colors">
                        <span className="text-2xl">🌍</span>
                  </div>
                      <span>Connect with <span className="text-[var(--color-eco-primary)] font-semibold">verified sustainable vendors</span></span>
                    </div>
                    <div className="flex items-center justify-center lg:justify-start gap-4 group">
                      <div className="w-12 h-12 bg-eco-gradient/20 rounded-full flex items-center justify-center group-hover:bg-eco-gradient/30 transition-colors">
                        <span className="text-2xl">✨</span>
                      </div>
                      <span>Every purchase creates <span className="text-[var(--color-eco-primary)] font-semibold">positive impact</span></span>
                    </div>
                    <div className="flex items-center justify-center lg:justify-start gap-4 group">
                      <div className="w-12 h-12 bg-eco-gradient/20 rounded-full flex items-center justify-center group-hover:bg-eco-gradient/30 transition-colors">
                        <span className="text-2xl">🚀</span>
                  </div>
                      <span>Join the <span className="text-[var(--color-eco-primary)] font-semibold">green revolution</span> today</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Enhanced CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4 animate-slide-in-up" style={{ animationDelay: '0.6s' }}>
                <Button
                  as={Link}
                  href="/explore"
                  variant="primary"
                  size="lg"
                  className="h-14 w-48 sm:w-52 rounded-full gap-3 group hover:scale-105 transition-transform"
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform">🛍️</span>
                  <span>Let's Shop</span>
                </Button>
                
                <Button
                  as={Link}
                  href="/vendor"
                  variant="primary"
                  size="lg"
                  className="h-14 w-48 sm:w-52 rounded-full gap-3 group hover:scale-105 transition-transform"
                >
                  <span className="text-xl group-hover:scale-110 transition-transform">🌱</span>
                  <span>Become Vendor</span>
                </Button>
            </div>
          </div>
          
            {/* Right Side - Compact Product Showcase */}
            <div className="flex justify-center lg:justify-end">
              <div className="flex flex-col sm:flex-row gap-2 lg:gap-3 w-full max-w-3xl">
                
                {/* Left Product Card */}
                <div className="flex-1 min-w-0 max-w-[200px] mx-auto sm:mx-0">
                  <div className="glass-green rounded-2xl p-1.5 shadow-eco-lg hover-lift animate-float group">
                    <div className="absolute inset-0 bg-eco-gradient/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <ProductCard 
                      imageUrl="/hero1.png"
                      category="Home & Kitchen"
                      title="Bamboo Kitchen Essentials"
                      description="Complete sustainable Kitchen starter set"
                      price={89}
                      originalPrice={120}
                      rating={4.9}
                      reviews={524}
                      variant="default"
                      size="small"
                    />
                  </div>
                </div>
                
                {/* Center Featured Product Card */}
                <div className="flex-1 min-w-0 max-w-[240px] mx-auto sm:mx-0">
                  <div className="glass-green rounded-2xl p-2 shadow-eco-lg hover-lift relative overflow-hidden animate-float group" style={{ animationDelay: '0.5s' }}>
                    <div className="absolute top-0 right-0 w-16 h-16 bg-eco-gradient opacity-20 rounded-full animate-blob"></div>
                    <div className="absolute inset-0 bg-eco-gradient/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <ProductCard 
                      imageUrl="/hero1.png"
                      category="Home & Kitchen"
                      title="Bamboo Kitchen Essentials"
                      description="Complete sustainable Kitchen starter set"
                      price={89}
                      originalPrice={120}
                      rating={4.9}
                      reviews={524}
                      variant="featured"
                      size="small"
                    />
                  </div>
                </div>
                
                {/* Right Product Card */}
                <div className="flex-1 min-w-0 max-w-[200px] mx-auto sm:mx-0">
                  <div className="glass-green rounded-2xl p-1.5 shadow-eco-lg hover-lift animate-float group" style={{ animationDelay: '1s' }}>
                    <div className="absolute inset-0 bg-eco-gradient/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <ProductCard 
                      imageUrl="/hero1.png"
                      category="Home & Kitchen"
                      title="Bamboo Kitchen Essentials"
                      description="Complete sustainable Kitchen starter set"
                      price={89}
                      originalPrice={120}
                      rating={4.9}
                      reviews={524}
                      variant="default"
                      size="small"
                    />
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>

      {/* Hot Deals Section */}
      <HotDealsSection />

      {/* Top Categories Section */}
      <TopCategoriesSection />

      {/* Best Sellers Section */}
      <BestSellersSection />


      {/* Product Recommendations - Showcasing Featured Eco Products */}
      <div className="container mx-auto px-4 py-8 sm:py-16 space-y-8 sm:space-y-16">
        <ProductRecommendations 
          type="trending" 
          limit={8}
          title="🌿 Trending Eco Products"
          className="mb-8 sm:mb-16"
        />
        
        <ProductRecommendations 
          type="new-arrivals" 
          limit={8}
          title="🆕 New Sustainable Arrivals"
          className="mb-8 sm:mb-16"
        />
        
        <ProductRecommendations 
          type="top-rated" 
          limit={8}
          title="⭐ Top Rated Green Products"
          className="mb-8 sm:mb-16"
        />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
