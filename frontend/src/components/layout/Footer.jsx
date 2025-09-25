export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#1a3d0a] via-[#2d5016] to-[#1a3d0a] w-full relative overflow-hidden">
      {/* Subtle earth texture overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(139,69,19,0.1)] to-[rgba(101,67,33,0.15)] pointer-events-none"></div>
      <div className="max-w-[1200px] mx-auto px-6 pt-[45px] pb-0 relative z-10">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-8 lg:gap-12 mb-[45px]">
          
          {/* Company Info */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            {/* Logo */}
            <div className="flex items-center gap-[6px] mb-2">
              <div className="w-[26px] h-[24px] flex items-center justify-center">
                <img 
                  src="/logo.png" 
                  alt="AveoEarth Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-poppins font-medium text-white text-[26px] tracking-[-0.72px] leading-[30px]">
                AveoEarth
              </span>
            </div>
            
            {/* Company Description */}
            <p className="font-poppins text-[#d4e6c7] text-[12px] leading-[1.5] max-w-[280px]">
              The world's largest sustainability-focused marketplace. Connecting eco-conscious consumers with verified sustainable vendors worldwide.
            </p>
          </div>
          
          {/* My Account Column */}
          <div className="flex flex-col gap-[15px]">
            <h3 className="font-poppins font-medium text-white text-[14px] leading-[1.5]">
              My Account
            </h3>
            <div className="flex flex-col gap-[9px]">
              <a href="#" className="font-poppins text-[#d4e6c7] text-[12px] leading-[1.5] hover:text-[#a8d5a8] transition-colors cursor-pointer">
                My Account
              </a>
              <a href="#" className="font-poppins text-[#d4e6c7] text-[12px] leading-[1.5] hover:text-[#a8d5a8] transition-colors cursor-pointer">
                Order History
              </a>
              <a href="#" className="font-poppins text-[#d4e6c7] text-[12px] leading-[1.5] hover:text-[#a8d5a8] transition-colors cursor-pointer">
                Shopping Cart
              </a>
              <a href="#" className="font-poppins text-[#d4e6c7] text-[12px] leading-[1.5] hover:text-[#a8d5a8] transition-colors cursor-pointer">
                Wishlist
              </a>
            </div>
          </div>
          
          {/* Support Column */}
          <div className="flex flex-col gap-[15px]">
            <h3 className="font-poppins font-medium text-white text-[14px] leading-[1.5]">
              Support
            </h3>
            <div className="flex flex-col gap-[9px]">
              <a href="#" className="font-poppins text-[#d4e6c7] text-[12px] leading-[1.5] hover:text-[#a8d5a8] transition-colors cursor-pointer">
                Track Order
              </a>
              <a href="#" className="font-poppins text-[#d4e6c7] text-[12px] leading-[1.5] hover:text-[#a8d5a8] transition-colors cursor-pointer">
                Shop
              </a>
              <a href="#" className="font-poppins text-[#d4e6c7] text-[12px] leading-[1.5] hover:text-[#a8d5a8] transition-colors cursor-pointer">
                Product
              </a>
              <a href="#" className="font-poppins text-[#d4e6c7] text-[12px] leading-[1.5] hover:text-[#a8d5a8] transition-colors cursor-pointer">
                Contact
              </a>
            </div>
          </div>
          
          {/* About Us Column */}
          <div className="flex flex-col gap-[15px]">
            <h3 className="font-poppins font-medium text-white text-[14px] leading-[1.5]">
              About Us
            </h3>
            <div className="flex flex-col gap-[9px]">
              <a href="#" className="font-poppins text-[#d4e6c7] text-[12px] leading-[1.5] hover:text-[#a8d5a8] transition-colors cursor-pointer">
                Journey so far
              </a>
              <a href="#" className="font-poppins text-[#d4e6c7] text-[12px] leading-[1.5] hover:text-[#a8d5a8] transition-colors cursor-pointer">
                Shop
              </a>
              <a href="#" className="font-poppins text-[#d4e6c7] text-[12px] leading-[1.5] hover:text-[#a8d5a8] transition-colors cursor-pointer">
                Product
              </a>
              <a href="#" className="font-poppins text-[#d4e6c7] text-[12px] leading-[1.5] hover:text-[#a8d5a8] transition-colors cursor-pointer">
                Track Order
              </a>
            </div>
          </div>
          
          {/* Sustainability Column */}
          <div className="flex flex-col gap-[15px]">
            <h3 className="font-poppins font-medium text-white text-[14px] leading-[1.5]">
              Sustainability
            </h3>
            <div className="flex flex-col gap-[9px]">
              <a href="#" className="font-poppins text-[#d4e6c7] text-[12px] leading-[1.5] hover:text-[#a8d5a8] transition-colors cursor-pointer">
                ESG Verification
              </a>
              <a href="#" className="font-poppins text-[#d4e6c7] text-[12px] leading-[1.5] hover:text-[#a8d5a8] transition-colors cursor-pointer">
                Carbon Footprint
              </a>
              <a href="#" className="font-poppins text-[#d4e6c7] text-[12px] leading-[1.5] hover:text-[#a8d5a8] transition-colors cursor-pointer">
                Impact Reports
              </a>
              <a href="#" className="font-poppins text-[#d4e6c7] text-[12px] leading-[1.5] hover:text-[#a8d5a8] transition-colors cursor-pointer">
                Become Vendor
              </a>
            </div>
          </div>
        </div>
        
        {/* Footer Bottom - Copyright and Payment Methods */}
        <div className="flex flex-col md:flex-row items-center justify-between py-[18px] border-t border-[#4a7c28] gap-4">
          
          {/* Copyright */}
          <p className="font-poppins text-[#d4e6c7] text-[10.5px] leading-[1.5]">
            AveoEarth © 2025. All Rights Reserved
          </p>
          
          {/* Payment Methods */}
          <div className="flex gap-[5px] items-center">
            
            {/* UPI */}
            <div className="bg-gradient-to-br from-[#d4e6c7] to-[#a8d5a8] h-6 w-[35px] rounded-[5px] flex items-center justify-center overflow-hidden border border-[#4a7c28]">
              <span className="text-[8px] font-bold text-[#1a3d0a]">UPI</span>
            </div>
            
            {/* Visa */}
            <div className="bg-gradient-to-br from-[#d4e6c7] to-[#a8d5a8] h-6 w-[35px] rounded-[5px] flex items-center justify-center overflow-hidden border border-[#4a7c28]">
              <span className="text-[8px] font-bold text-[#1a3d0a]">VISA</span>
            </div>
            
            {/* Mastercard */}
            <div className="bg-gradient-to-br from-[#d4e6c7] to-[#a8d5a8] h-6 w-[35px] rounded-[5px] flex items-center justify-center overflow-hidden border border-[#4a7c28]">
              <div className="flex">
                <div className="w-2 h-2 bg-[#8b4513] rounded-full"></div>
                <div className="w-2 h-2 bg-[#a0522d] rounded-full -ml-1"></div>
              </div>
            </div>
            
            {/* American Express */}
            <div className="bg-gradient-to-br from-[#d4e6c7] to-[#a8d5a8] h-6 w-[35px] rounded-[5px] flex items-center justify-center overflow-hidden border border-[#4a7c28]">
              <span className="text-[7px] font-bold text-[#1a3d0a]">AMEX</span>
            </div>
            
            {/* RuPay */}
            <div className="bg-gradient-to-br from-[#d4e6c7] to-[#a8d5a8] h-6 w-[35px] rounded-[5px] flex items-center justify-center overflow-hidden border border-[#4a7c28]">
              <span className="text-[7px] font-bold text-[#1a3d0a]">RuPay</span>
            </div>
            
            {/* Diners Club */}
            <div className="bg-gradient-to-br from-[#d4e6c7] to-[#a8d5a8] h-6 w-[35px] rounded-[5px] flex items-center justify-center overflow-hidden border border-[#4a7c28]">
              <span className="text-[7px] font-bold text-[#1a3d0a]">Diners</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
