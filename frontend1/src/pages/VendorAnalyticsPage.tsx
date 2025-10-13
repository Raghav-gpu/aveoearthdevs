import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Eye,
  Star,
  Package,
  Calendar,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';

const VendorAnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data - in real app this would come from API
  const overviewStats = {
    totalRevenue: 125430,
    totalOrders: 342,
    totalCustomers: 189,
    conversionRate: 3.2,
    averageOrderValue: 366.75,
    revenueChange: 12.5,
    ordersChange: -2.1,
    customersChange: 8.3,
    conversionChange: 0.8
  };

  const salesData = [
    { month: 'Jan', revenue: 8500, orders: 45 },
    { month: 'Feb', revenue: 9200, orders: 52 },
    { month: 'Mar', revenue: 10800, orders: 61 },
    { month: 'Apr', revenue: 12500, orders: 68 },
    { month: 'May', revenue: 14200, orders: 78 },
    { month: 'Jun', revenue: 15800, orders: 89 },
    { month: 'Jul', revenue: 17200, orders: 95 },
    { month: 'Aug', revenue: 18900, orders: 102 },
    { month: 'Sep', revenue: 20100, orders: 108 },
    { month: 'Oct', revenue: 22500, orders: 115 },
    { month: 'Nov', revenue: 24800, orders: 125 },
    { month: 'Dec', revenue: 27200, orders: 135 }
  ];

  const topProducts = [
    {
      name: 'Organic Cotton T-Shirt',
      sales: 125,
      revenue: 3748.75,
      growth: 15.2,
      rating: 4.8,
      reviews: 23,
      sustainability: 95
    },
    {
      name: 'Bamboo Water Bottle',
      sales: 89,
      revenue: 2224.11,
      growth: 8.7,
      rating: 4.6,
      reviews: 18,
      sustainability: 98
    },
    {
      name: 'Eco-Friendly Skincare Set',
      sales: 45,
      revenue: 4049.55,
      growth: -3.1,
      rating: 4.9,
      reviews: 31,
      sustainability: 92
    },
    {
      name: 'Recycled Paper Notebook',
      sales: 78,
      revenue: 1013.22,
      growth: 22.4,
      rating: 4.4,
      reviews: 12,
      sustainability: 88
    },
    {
      name: 'Solar-Powered Phone Charger',
      sales: 32,
      revenue: 1599.68,
      growth: 45.6,
      rating: 4.7,
      reviews: 15,
      sustainability: 96
    }
  ];

  const customerInsights = {
    newCustomers: 45,
    returningCustomers: 144,
    customerRetention: 76.2,
    averageLifetimeValue: 663.12,
    topCustomerSegments: [
      { segment: 'Eco-Conscious Millennials', percentage: 35, revenue: 43900 },
      { segment: 'Sustainable Families', percentage: 28, revenue: 35120 },
      { segment: 'Green Professionals', percentage: 22, revenue: 27595 },
      { segment: 'Environmental Students', percentage: 15, revenue: 18815 }
    ]
  };

  const sustainabilityMetrics = {
    carbonOffset: 1250,
    treesPlanted: 45,
    plasticSaved: 320,
    waterSaved: 1800,
    sustainableProducts: 28,
    ecoCertifications: 5
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'sales', label: 'Sales', icon: DollarSign },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'sustainability', label: 'Sustainability', icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage/5 via-background to-moss/5 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-headline font-bold text-charcoal">Analytics</h1>
            <p className="text-charcoal/70">Track your performance and business insights</p>
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
            <Button variant="outline" className="border-2 border-forest/20 hover:border-forest hover:bg-forest/5 text-forest">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" className="border-2 border-forest/20 hover:border-forest hover:bg-forest/5 text-forest">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-2">
            <div className="flex space-x-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? 'default' : 'ghost'}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 ${
                      activeTab === tab.id 
                        ? 'bg-forest text-white' 
                        : 'text-charcoal/70 hover:text-charcoal hover:bg-forest/5'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-charcoal/70">Total Revenue</p>
                      <p className="text-2xl font-bold text-charcoal">${overviewStats.totalRevenue.toLocaleString()}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingUp className="w-4 h-4 text-forest" />
                        <span className="text-sm text-forest font-medium">+{overviewStats.revenueChange}%</span>
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
                      <p className="text-2xl font-bold text-charcoal">{overviewStats.totalOrders}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingDown className="w-4 h-4 text-red-500" />
                        <span className="text-sm text-red-500 font-medium">{overviewStats.ordersChange}%</span>
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
                      <p className="text-sm font-medium text-charcoal/70">Total Customers</p>
                      <p className="text-2xl font-bold text-charcoal">{overviewStats.totalCustomers}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingUp className="w-4 h-4 text-forest" />
                        <span className="text-sm text-forest font-medium">+{overviewStats.customersChange}%</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-moss/20 to-moss/30 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-moss" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-charcoal/70">Conversion Rate</p>
                      <p className="text-2xl font-bold text-charcoal">{overviewStats.conversionRate}%</p>
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingUp className="w-4 h-4 text-forest" />
                        <span className="text-sm text-forest font-medium">+{overviewStats.conversionChange}%</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-clay/20 to-clay/30 rounded-full flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-clay" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Revenue Chart */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-charcoal">
                  <BarChart3 className="w-5 h-5 text-forest" />
                  Revenue Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between gap-2">
                  {salesData.map((data, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-gradient-to-t from-forest to-moss rounded-t-lg min-h-[20px]"
                        style={{ height: `${(data.revenue / 30000) * 200}px` }}
                      />
                      <span className="text-xs text-charcoal/70 mt-2">{data.month}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-charcoal">
                <Package className="w-5 h-5 text-forest" />
                Top Performing Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border-2 border-forest/10 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-forest/10 to-forest/20 rounded-full flex items-center justify-center">
                        <span className="font-bold text-forest">{index + 1}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-charcoal">{product.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-charcoal/70">
                          <span>{product.sales} sales</span>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span>{product.rating}</span>
                            <span>({product.reviews})</span>
                          </div>
                          <span>•</span>
                          <span>{product.sustainability}% sustainable</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-charcoal">${product.revenue.toFixed(2)}</p>
                      <div className="flex items-center gap-1">
                        {product.growth > 0 ? (
                          <TrendingUp className="w-4 h-4 text-forest" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-500" />
                        )}
                        <span className={`text-sm font-medium ${product.growth > 0 ? 'text-forest' : 'text-red-500'}`}>
                          {product.growth > 0 ? '+' : ''}{product.growth}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Customers Tab */}
        {activeTab === 'customers' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-charcoal">
                  <Users className="w-5 h-5 text-forest" />
                  Customer Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-forest/5 rounded-xl">
                    <div>
                      <p className="text-sm font-medium text-charcoal/70">New Customers</p>
                      <p className="text-2xl font-bold text-charcoal">{customerInsights.newCustomers}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-forest/10 to-forest/20 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-forest" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-sage/5 rounded-xl">
                    <div>
                      <p className="text-sm font-medium text-charcoal/70">Returning Customers</p>
                      <p className="text-2xl font-bold text-charcoal">{customerInsights.returningCustomers}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-sage/20 to-sage/30 rounded-full flex items-center justify-center">
                      <RefreshCw className="w-6 h-6 text-sage" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-moss/5 rounded-xl">
                    <div>
                      <p className="text-sm font-medium text-charcoal/70">Retention Rate</p>
                      <p className="text-2xl font-bold text-charcoal">{customerInsights.customerRetention}%</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-moss/20 to-moss/30 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-moss" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-charcoal">
                  <BarChart3 className="w-5 h-5 text-forest" />
                  Customer Segments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customerInsights.topCustomerSegments.map((segment, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-charcoal">{segment.segment}</span>
                        <span className="text-sm text-charcoal/70">{segment.percentage}%</span>
                      </div>
                      <div className="w-full bg-forest/10 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-forest to-moss h-2 rounded-full"
                          style={{ width: `${segment.percentage}%` }}
                        />
                      </div>
                      <p className="text-xs text-charcoal/60">${segment.revenue.toLocaleString()} revenue</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Sustainability Tab */}
        {activeTab === 'sustainability' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-forest/5 to-moss/5">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-forest/10 to-forest/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-forest" />
                </div>
                <p className="text-3xl font-bold text-charcoal">{sustainabilityMetrics.carbonOffset}kg</p>
                <p className="text-sm text-charcoal/70">CO₂ Offset</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-sage/5 to-sage/10">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-sage/20 to-sage/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-sage" />
                </div>
                <p className="text-3xl font-bold text-charcoal">{sustainabilityMetrics.treesPlanted}</p>
                <p className="text-sm text-charcoal/70">Trees Planted</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-moss/5 to-moss/10">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-moss/20 to-moss/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-moss" />
                </div>
                <p className="text-3xl font-bold text-charcoal">{sustainabilityMetrics.plasticSaved}g</p>
                <p className="text-sm text-charcoal/70">Plastic Saved</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-clay/5 to-clay/10">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-clay/20 to-clay/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-clay" />
                </div>
                <p className="text-3xl font-bold text-charcoal">{sustainabilityMetrics.waterSaved}L</p>
                <p className="text-sm text-charcoal/70">Water Saved</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-forest/5 to-forest/10">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-forest/10 to-forest/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-forest" />
                </div>
                <p className="text-3xl font-bold text-charcoal">{sustainabilityMetrics.sustainableProducts}</p>
                <p className="text-sm text-charcoal/70">Sustainable Products</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-sage/5 to-sage/10">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-sage/20 to-sage/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-sage" />
                </div>
                <p className="text-3xl font-bold text-charcoal">{sustainabilityMetrics.ecoCertifications}</p>
                <p className="text-sm text-charcoal/70">Eco Certifications</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorAnalyticsPage;
