import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Eye,
  Plus,
  ArrowRight,
  Calendar,
  Clock,
  Star,
  Leaf,
  Award,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';

const VendorDashboardPage = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('7d');

  // Mock data - in real app this would come from API
  const stats = {
    totalRevenue: 125430,
    totalOrders: 342,
    totalProducts: 28,
    conversionRate: 3.2,
    revenueChange: 12.5,
    ordersChange: -2.1,
    productsChange: 8.3,
    conversionChange: 0.8
  };

  const recentOrders = [
    {
      id: 'ORD-001',
      customer: 'John Smith',
      product: 'Organic Cotton T-Shirt',
      amount: 29.99,
      status: 'completed',
      date: '2024-01-15',
      time: '10:30 AM'
    },
    {
      id: 'ORD-002',
      customer: 'Sarah Johnson',
      product: 'Bamboo Water Bottle',
      amount: 24.99,
      status: 'processing',
      date: '2024-01-15',
      time: '09:15 AM'
    },
    {
      id: 'ORD-003',
      customer: 'Mike Wilson',
      product: 'Eco-Friendly Skincare Set',
      amount: 89.99,
      status: 'shipped',
      date: '2024-01-14',
      time: '2:45 PM'
    },
    {
      id: 'ORD-004',
      customer: 'Emma Davis',
      product: 'Recycled Paper Notebook',
      amount: 12.99,
      status: 'pending',
      date: '2024-01-14',
      time: '11:20 AM'
    }
  ];

  const topProducts = [
    {
      name: 'Organic Cotton T-Shirt',
      sales: 45,
      revenue: 1349.55,
      growth: 15.2,
      image: '/api/placeholder/60/60'
    },
    {
      name: 'Bamboo Water Bottle',
      sales: 32,
      revenue: 799.68,
      growth: 8.7,
      image: '/api/placeholder/60/60'
    },
    {
      name: 'Eco-Friendly Skincare Set',
      sales: 18,
      revenue: 1619.82,
      growth: -3.1,
      image: '/api/placeholder/60/60'
    }
  ];

  const sustainabilityMetrics = {
    carbonOffset: 1250,
    treesPlanted: 45,
    plasticSaved: 320,
    waterSaved: 1800
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-forest text-white';
      case 'processing': return 'bg-amber-500 text-white';
      case 'shipped': return 'bg-blue-500 text-white';
      case 'pending': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'processing': return <Clock className="w-4 h-4" />;
      case 'shipped': return <Package className="w-4 h-4" />;
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      default: return <XCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage/5 via-background to-moss/5 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-headline font-bold text-charcoal">Dashboard</h1>
            <p className="text-charcoal/70">Welcome back! Here's what's happening with your store.</p>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border-2 border-forest/20 rounded-xl bg-white focus:border-forest focus:ring-4 focus:ring-forest/20"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <Button 
              onClick={() => navigate('/vendor/products')}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-charcoal/70">Total Revenue</p>
                  <p className="text-2xl font-bold text-charcoal">${stats.totalRevenue.toLocaleString()}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="w-4 h-4 text-forest" />
                    <span className="text-sm text-forest font-medium">+{stats.revenueChange}%</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-forest/10 to-forest/20 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-forest" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-charcoal/70">Total Orders</p>
                  <p className="text-2xl font-bold text-charcoal">{stats.totalOrders}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingDown className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-red-500 font-medium">{stats.ordersChange}%</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-sage/20 to-sage/30 rounded-full flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-sage" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-charcoal/70">Total Products</p>
                  <p className="text-2xl font-bold text-charcoal">{stats.totalProducts}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="w-4 h-4 text-forest" />
                    <span className="text-sm text-forest font-medium">+{stats.productsChange}%</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-moss/20 to-moss/30 rounded-full flex items-center justify-center">
                  <Package className="w-6 h-6 text-moss" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-charcoal/70">Conversion Rate</p>
                  <p className="text-2xl font-bold text-charcoal">{stats.conversionRate}%</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="w-4 h-4 text-forest" />
                    <span className="text-sm text-forest font-medium">+{stats.conversionChange}%</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-clay/20 to-clay/30 rounded-full flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-clay" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <Card className="lg:col-span-2 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-charcoal">
                  <ShoppingCart className="w-5 h-5 text-forest" />
                  Recent Orders
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/vendor/orders')}
                  className="border-forest/20 hover:border-forest hover:bg-forest/5 text-forest"
                >
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border-2 border-forest/10 rounded-xl hover:border-forest/20 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-forest/10 to-forest/20 rounded-full flex items-center justify-center">
                        {getStatusIcon(order.status)}
                      </div>
                      <div>
                        <p className="font-medium text-charcoal">{order.customer}</p>
                        <p className="text-sm text-charcoal/70">{order.product}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-charcoal/60">{order.date}</span>
                          <span className="text-xs text-charcoal/60">•</span>
                          <span className="text-xs text-charcoal/60">{order.time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-charcoal">${order.amount}</p>
                      <Badge className={`text-xs ${getStatusColor(order.status)}`}>
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-charcoal">
                <Package className="w-5 h-5 text-forest" />
                Top Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border-2 border-forest/10 rounded-xl">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-charcoal text-sm line-clamp-1">{product.name}</p>
                      <p className="text-xs text-charcoal/70">{product.sales} sales</p>
                      <div className="flex items-center gap-1 mt-1">
                        {product.growth > 0 ? (
                          <TrendingUp className="w-3 h-3 text-forest" />
                        ) : (
                          <TrendingDown className="w-3 h-3 text-red-500" />
                        )}
                        <span className={`text-xs font-medium ${product.growth > 0 ? 'text-forest' : 'text-red-500'}`}>
                          {product.growth > 0 ? '+' : ''}{product.growth}%
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-charcoal text-sm">${product.revenue.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sustainability Impact */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-forest/5 to-moss/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-charcoal">
              <Leaf className="w-5 h-5 text-forest" />
              Sustainability Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-forest/10 to-forest/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Leaf className="w-8 h-8 text-forest" />
                </div>
                <p className="text-2xl font-bold text-charcoal">{sustainabilityMetrics.carbonOffset}kg</p>
                <p className="text-sm text-charcoal/70">CO₂ Offset</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-moss/20 to-moss/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="w-8 h-8 text-moss" />
                </div>
                <p className="text-2xl font-bold text-charcoal">{sustainabilityMetrics.treesPlanted}</p>
                <p className="text-sm text-charcoal/70">Trees Planted</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-sage/20 to-sage/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Package className="w-8 h-8 text-sage" />
                </div>
                <p className="text-2xl font-bold text-charcoal">{sustainabilityMetrics.plasticSaved}g</p>
                <p className="text-sm text-charcoal/70">Plastic Saved</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-clay/20 to-clay/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BarChart3 className="w-8 h-8 text-clay" />
                </div>
                <p className="text-2xl font-bold text-charcoal">{sustainabilityMetrics.waterSaved}L</p>
                <p className="text-sm text-charcoal/70">Water Saved</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-charcoal">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button 
                onClick={() => navigate('/vendor/products')}
                className="h-20 flex flex-col items-center gap-2 border-2 border-forest/20 hover:border-forest hover:bg-forest/5 text-forest"
                variant="outline"
              >
                <Package className="w-6 h-6" />
                <span className="text-sm font-medium">Manage Products</span>
              </Button>
              <Button 
                onClick={() => navigate('/vendor/orders')}
                className="h-20 flex flex-col items-center gap-2 border-2 border-forest/20 hover:border-forest hover:bg-forest/5 text-forest"
                variant="outline"
              >
                <ShoppingCart className="w-6 h-6" />
                <span className="text-sm font-medium">View Orders</span>
              </Button>
              <Button 
                onClick={() => navigate('/vendor/analytics')}
                className="h-20 flex flex-col items-center gap-2 border-2 border-forest/20 hover:border-forest hover:bg-forest/5 text-forest"
                variant="outline"
              >
                <BarChart3 className="w-6 h-6" />
                <span className="text-sm font-medium">Analytics</span>
              </Button>
              <Button 
                onClick={() => navigate('/vendor/settings')}
                className="h-20 flex flex-col items-center gap-2 border-2 border-forest/20 hover:border-forest hover:bg-forest/5 text-forest"
                variant="outline"
              >
                <Users className="w-6 h-6" />
                <span className="text-sm font-medium">Settings</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VendorDashboardPage;
