"use client";

import { forwardRef } from "react";

const Button = forwardRef(({ 
  children, 
  variant = "primary", 
  size = "md", 
  className = "", 
  disabled = false,
  type = "button",
  as: Component = "button",
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center justify-center font-poppins font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "glass-green border-2 border-[var(--color-eco-accent)] text-[var(--color-eco-primary)] hover-glow",
    secondary: "bg-[var(--color-eco-primary)] text-white hover:bg-[var(--color-eco-primary)]/90 shadow-eco",
    outline: "border-2 border-[var(--color-eco-primary)] text-[var(--color-eco-primary)] hover:bg-[var(--color-eco-primary)] hover:text-white",
    ghost: "text-[var(--color-eco-primary)] hover:bg-[var(--color-eco-accent)]/20",
    danger: "bg-red-600 text-white hover:bg-red-700 shadow-lg",
    success: "bg-green-600 text-white hover:bg-green-700 shadow-lg"
  };
  
  const sizes = {
    sm: "px-4 py-2 text-sm rounded-lg",
    md: "px-6 py-3 text-base rounded-xl",
    lg: "px-8 py-4 text-lg rounded-2xl",
    xl: "px-10 py-5 text-xl rounded-3xl"
  };
  
  const variantClasses = variants[variant] || variants.primary;
  const sizeClasses = sizes[size] || sizes.md;
  
  return (
    <Component
      ref={ref}
      type={Component === "button" ? type : undefined}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
});

Button.displayName = "Button";

export default Button;