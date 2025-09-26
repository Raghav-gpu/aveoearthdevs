import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CategoryPage from "./pages/CategoryPage";
import AllProductsPage from "./pages/AllProductsPage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import OrdersPage from "./pages/OrdersPage";
import WishlistPage from "./pages/WishlistPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="frontend1\src\pages\CategoryPage.tsx" element={<CategoryPage />} />
          <Route path="frontend1\src\pages\AllProductsPage.tsx" element={<AllProductsPage />} />
          <Route path="frontend1\src\pages\ProductPage.tsx" element={<ProductPage />} />
          <Route path="frontend1\src\pages\CartPage.tsx" element={<CartPage />} />
          <Route path="frontend1\src\pages\ProfilePage.tsx" element={<ProfilePage />} />
          <Route path="frontend1\src\pages\LoginPage.tsx" element={<LoginPage />} />
          <Route path="frontend1\src\pages\OrdersPage.tsx" element={<OrdersPage />} />
          <Route path="frontend1\src\pages\WishlistPage.tsx" element={<WishlistPage />} />
          <Route path="frontend1\src\pages\AboutPage.tsx" element={<AboutPage />} />
          <Route path="frontend1\src\pages\ContactPage.tsx" element={<ContactPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
