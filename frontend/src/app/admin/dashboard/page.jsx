"use client";

import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
import DashboardScreen from "@/components/admin/screens/DashboardScreen";
import SuppliersScreen from "@/components/admin/screens/SuppliersScreen";
import ProductsScreen from "@/components/admin/screens/ProductsScreen";
import OrdersScreen from "@/components/admin/screens/OrdersScreen";
import UsersScreen from "@/components/admin/screens/UsersScreen";
import AnalyticsScreen from "@/components/admin/screens/AnalyticsScreen";
import SettingsScreen from "@/components/admin/screens/SettingsScreen";

export default function AdminDashboard() {
  const [activeScreen, setActiveScreen] = useState("dashboard");

  const renderScreen = () => {
    switch (activeScreen) {
      case "dashboard":
        return <DashboardScreen />;
      case "suppliers":
        return <SuppliersScreen />;
      case "products":
        return <ProductsScreen />;
      case "orders":
        return <OrdersScreen />;
      case "users":
        return <UsersScreen />;
      case "analytics":
        return <AnalyticsScreen />;
      case "settings":
        return <SettingsScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar 
        activeScreen={activeScreen} 
        onScreenChange={setActiveScreen} 
      />
      
      {/* Main Content */}
      <div className="ml-60">
        {/* Top Bar */}
        <AdminTopbar />
        
        {/* Page Content */}
        <main className="p-6">
          {renderScreen()}
        </main>
      </div>
    </div>
  );
}
