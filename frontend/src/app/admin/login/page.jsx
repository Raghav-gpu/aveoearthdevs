"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/api";
import { tokens } from "@/lib/api";

export default function AdminLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    
    try {
      // Call the auth API with correct parameters
      const response = await auth.login(formData.email, formData.password);
      
      // Check if user has admin role
      if (response.user.user_type !== 'admin') {
        setErrors({ submit: "Access denied. Admin privileges required." });
        return;
      }
      
      // Store tokens
      tokens.set({
        access_token: response.tokens.access_token,
        refresh_token: response.tokens.refresh_token
      });
      
      // Store user info in localStorage for admin dashboard
      localStorage.setItem('adminUser', JSON.stringify({
        id: response.user.id,
        email: response.user.email,
        first_name: response.user.first_name,
        last_name: response.user.last_name,
        user_type: response.user.user_type
      }));
      
      // Redirect to admin dashboard
      router.push("/admin/dashboard");
      
    } catch (error) {
      console.error("Admin login error:", error);
      setErrors({ 
        submit: error.message || "Invalid email or password. Please try again." 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <img
              src="/logo.png"
              alt="AveoEarth Logo"
              className="h-[42px] w-[44px] mr-2"
            />
            <h1 className="font-reem font-normal text-[48px] leading-normal text-black">
              AveoEarth
            </h1>
          </div>
          <p className="font-poppins font-normal text-[24px] leading-normal text-black">
            Conscious commerce, frictionless for you
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-[#f8f8f8] border border-[#666666] rounded-[20px] p-12 mt-16 max-w-[785px] mx-auto">
          <div className="text-center mb-8">
            <h2 className="font-reem font-medium text-[16px] leading-[24px] text-[#1a4032]">
              Admin Login
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="flex items-center px-4 py-0">
                <span className="font-poppins font-semibold text-[16px] leading-[24px] text-[#09101d] opacity-80">
                  Email
                </span>
                <span className="font-poppins font-semibold text-[13px] leading-[20px] text-[#da1414] opacity-80 ml-1">
                  *
                </span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter admin email"
                  className={`w-full px-4 py-3 bg-[#f9fbe7] border rounded-[8px] font-poppins font-semibold text-[16px] leading-[24px] text-[#1a4032] placeholder-[#1a4032] placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-[#1a4032] focus:border-transparent transition-colors ${
                    errors.email ? 'border-[#da1414]' : 'border-[#858c94]'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-[#da1414] text-sm mt-1 px-4">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="flex items-center px-4 py-0">
                <span className="font-poppins font-semibold text-[16px] leading-[24px] text-[#09101d] opacity-80">
                  Password
                </span>
                <span className="font-poppins font-semibold text-[13px] leading-[20px] text-[#da1414] opacity-80 ml-1">
                  *
                </span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className={`w-full px-4 py-3 bg-[#f9fbe7] border rounded-[8px] font-poppins font-semibold text-[16px] leading-[24px] text-[#1a4032] placeholder-[#1a4032] placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-[#1a4032] focus:border-transparent transition-colors ${
                    errors.password ? 'border-[#da1414]' : 'border-[#858c94]'
                  }`}
                />
              </div>
              {errors.password && (
                <p className="text-[#da1414] text-sm mt-1 px-4">{errors.password}</p>
              )}
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="text-center">
                <p className="text-[#da1414] text-sm">{errors.submit}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#1a4032] hover:bg-[#0f2319] disabled:opacity-50 disabled:cursor-not-allowed text-white font-poppins font-medium text-[16px] px-[54px] py-4 rounded-[62px] transition-colors duration-200 max-w-[426px] mx-auto block"
              >
                {isLoading ? "Logging in..." : "Log in"}
              </button>
            </div>
          </form>
        </div>

        {/* Back to site link */}
        <div className="text-center">
          <Link 
            href="/" 
            className="font-poppins text-[#1a4032] hover:text-[#0f2319] underline transition-colors duration-200"
          >
            ← Back to main site
          </Link>
        </div>
      </div>
    </div>
  );
}
