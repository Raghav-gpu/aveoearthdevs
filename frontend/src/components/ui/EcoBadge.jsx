"use client";

const EcoBadge = ({ 
  type = "certified", 
  size = "sm", 
  className = "" 
}) => {
  const badges = {
    certified: {
      icon: "🌱",
      text: "Eco Certified",
      bgColor: "bg-eco-subtle",
      textColor: "text-eco-primary",
      borderColor: "border-eco-accent"
    },
    organic: {
      icon: "🌿",
      text: "Organic",
      bgColor: "bg-green-50",
      textColor: "text-organic",
      borderColor: "border-organic"
    },
    carbonNeutral: {
      icon: "🌍",
      text: "Carbon Neutral",
      bgColor: "bg-blue-50",
      textColor: "text-carbon-neutral",
      borderColor: "border-carbon-neutral"
    },
    renewable: {
      icon: "♻️",
      text: "Renewable",
      bgColor: "bg-green-50",
      textColor: "text-renewable",
      borderColor: "border-renewable"
    },
    verified: {
      icon: "✓",
      text: "Verified Vendor",
      bgColor: "bg-eco-subtle",
      textColor: "text-eco-primary",
      borderColor: "border-eco-accent"
    },
    local: {
      icon: "📍",
      text: "Local Source",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-700",
      borderColor: "border-yellow-300"
    },
    plastic_free: {
      icon: "🚫",
      text: "Plastic Free",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
      borderColor: "border-blue-300"
    }
  };

  const badge = badges[type] || badges.certified;
  
  const sizes = {
    xs: "px-1.5 py-0.5 text-xs",
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base"
  };

  return (
    <span 
      className={`
        inline-flex items-center gap-1 rounded-full border font-medium
        ${badge.bgColor} ${badge.textColor} ${badge.borderColor}
        ${sizes[size]}
        ${className}
      `}
    >
      <span className="leading-none">{badge.icon}</span>
      <span>{badge.text}</span>
    </span>
  );
};

export default EcoBadge;



