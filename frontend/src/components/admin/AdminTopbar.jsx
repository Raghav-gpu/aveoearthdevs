"use client";

import { 
  MagnifyingGlassIcon, 
  BellIcon, 
  ChevronDownIcon,
  Bars3Icon 
} from "@heroicons/react/24/outline";

export default function AdminTopbar() {
  return (
    <div className="fixed top-0 left-60 right-0 h-16 bg-white border-b border-gray-300 flex items-center px-6 z-10">
      {/* Mobile menu button */}
      <button className="lg:hidden mr-4">
        <Bars3Icon className="h-6 w-6 text-gray-600" />
      </button>
      
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4032] focus:border-transparent"
          />
        </div>
      </div>
      
      {/* Right side */}
      <div className="flex items-center gap-6 ml-6">
        {/* Language selector */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-4 bg-gray-200 rounded-sm flex items-center justify-center">
            <span className="text-xs">🇬🇧</span>
          </div>
          <span className="text-sm font-semibold text-gray-600">English</span>
          <ChevronDownIcon className="h-4 w-4 text-gray-600" />
        </div>
        
        {/* Notifications */}
        <div className="relative">
          <BellIcon className="h-6 w-6 text-gray-600" />
          <div className="absolute -top-1 -right-1 h-5 w-5 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-white">6</span>
          </div>
        </div>
        
        {/* Profile */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold text-gray-600">JO</span>
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-bold text-gray-700">John Organic</div>
            <div className="text-xs font-semibold text-gray-500">Admin</div>
          </div>
          <ChevronDownIcon className="h-4 w-4 text-gray-600" />
        </div>
      </div>
    </div>
  );
}
