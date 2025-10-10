import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useVendorAuth } from '@/hooks/useVendorAuth';
import { 
  Search, 
  Filter, 
  Eye,
  Package,
  ShoppingCart,
  BarChart3,
  ArrowLeft,
  Calendar,
  User,
  MapPin,
  Phone,
  Mail,
  LogOut
} from 'lucide-react';

const VendorOrders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const { vendor, loading, signOut, isAuthenticated } = useVendorAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated()) {
      navigate('/vendor');
    }
  }, [loading, isAuthenticated, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-forest/5 via-moss/10 to-clay/5 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-forest rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <ShoppingCart className="w-8 h-8 text-white" />
          </div>
          <p className="text-forest text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated()) {
    return null;
  }

  // Mock orders data
  const orders = [
    {
      id: 'ORD-001',
      customer: {
        name: 'Sarah Johnson',
        email: 'sarah.j@email.com',
        phone: '+1 (555) 123-4567',
        address: '123 Green Street, Eco City, EC 12345'
      },
      products: [
        { name: 'Organic Bamboo Sheets', quantity: 2, price: 2499 },
        { name: 'Eco Water Bottle', quantity: 1, price: 1299 }
      ],
      total: 6297,
      status: 'completed',
      date: '2024-01-15',
      paymentMethod: 'Credit Card',
      shippingAddress: '123 Green Street, Eco City, EC 12345'
    },
    {
      id: 'ORD-002',
      customer: {
        name: 'Mike Chen',
        email: 'mike.chen@email.com',
        phone: '+1 (555) 987-6543',
        address: '456 Sustainable Ave, Green Town, GT 67890'
      },
      products: [
        { name: 'Eco Water Bottle', quantity: 1, price: 1299 }
      ],
      total: 1299,
      status: 'pending',
      date: '2024-01-14',
      paymentMethod: 'PayPal',
      shippingAddress: '456 Sustainable Ave, Green Town, GT 67890'
    },
    {
      id: 'ORD-003',
      customer: {
        name: 'Emma Wilson',
        email: 'emma.w@email.com',
        phone: '+1 (555) 456-7890',
        address: '789 Eco Lane, Nature City, NC 54321'
      },
      products: [
        { name: 'Sustainable Tote Bag', quantity: 3, price: 799 }
      ],
      total: 2397,
      status: 'shipped',
      date: '2024-01-13',
      paymentMethod: 'Bank Transfer',
      shippingAddress: '789 Eco Lane, Nature City, NC 54321'
    },
    {
      id: 'ORD-004',
      customer: {
        name: 'David Brown',
        email: 'david.b@email.com',
        phone: '+1 (555) 321-0987',
        address: '321 Green Valley, Eco Park, EP 98765'
      },
      products: [
        { name: 'Bamboo Cutlery Set', quantity: 2, price: 899 },
        { name: 'Natural Loofah Sponge', quantity: 5, price: 399 }
      ],
      total: 3793,
      status: 'processing',
      date: '2024-01-12',
      paymentMethod: 'Credit Card',
      shippingAddress: '321 Green Valley, Eco Park, EP 98765'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-purple-100 text-purple-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'pending': return 'Pending';
      case 'shipped': return 'Shipped';
      case 'processing': return 'Processing';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest/5 via-moss/10 to-clay/5">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-screen w-64 bg-white/95 backdrop-blur-md border-r border-forest/30 shadow-2xl z-[100] flex flex-col pb-20">
        {/* Logo Section */}
        <div className="flex items-center gap-3 px-6 py-6">
          <div className="w-10 h-10 bg-forest rounded-2xl flex items-center justify-center">
            <ShoppingCart className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="font-bold text-xl text-forest">AveoEarth</span>
            <span className="text-sm text-moss ml-2 font-medium">Vendor Portal</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-4">
          <nav className="space-y-2">
            <Link to="/vendor/dashboard" className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-forest hover:bg-forest/10 hover:text-moss transition-all duration-300">
              <BarChart3 className="w-5 h-5" />
              <span className="font-semibold">Dashboard</span>
            </Link>
            <Link to="/vendor/products" className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-forest hover:bg-forest/10 hover:text-moss transition-all duration-300">
              <Package className="w-5 h-5" />
              <span className="font-semibold">Products</span>
            </Link>
            <Link to="/vendor/orders" className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-forest text-white shadow-lg">
              <ShoppingCart className="w-5 h-5" />
              <span className="font-semibold">Orders</span>
            </Link>
            <Link to="/vendor/analytics" className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-forest hover:bg-forest/10 hover:text-moss transition-all duration-300">
              <BarChart3 className="w-5 h-5" />
              <span className="font-semibold">Analytics</span>
            </Link>
          </nav>
        </div>

        {/* User Section */}
        <div className="p-4 border-t border-forest/20">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-forest/10">
            <div className="w-10 h-10 bg-forest rounded-full flex items-center justify-center">
              <span className="text-white font-bold">{vendor?.businessName?.charAt(0) || 'V'}</span>
            </div>
            <div className="flex-1">
              <div className="font-semibold text-forest">{vendor?.businessName || 'Vendor'}</div>
              <div className="text-sm text-muted-foreground">{vendor?.email || 'vendor@example.com'}</div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={signOut}
              className="text-forest hover:text-moss hover:bg-forest/20 p-2"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-forest hover:text-moss">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-forest mb-2">Order Management</h1>
              <p className="text-muted-foreground text-lg">Track and manage customer orders</p>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <Card className="bg-white/90 backdrop-blur-sm border-forest/20 shadow-lg mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-forest/20 focus:border-forest focus:ring-forest/20"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-forest/20 rounded-2xl focus:border-forest focus:ring-forest/20 bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <Button variant="outline" className="border-forest text-forest hover:bg-forest hover:text-white">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="bg-white/90 backdrop-blur-sm border-forest/20 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-forest">{order.id}</h3>
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusLabel(order.status)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{order.date}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-forest">{formatCurrency(order.total)}</p>
                    <p className="text-sm text-muted-foreground">{order.paymentMethod}</p>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <h4 className="font-semibold text-forest mb-2 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Customer Information
                    </h4>
                    <div className="space-y-1 text-sm">
                      <p className="font-medium">{order.customer.name}</p>
                      <p className="text-muted-foreground flex items-center gap-2">
                        <Mail className="w-3 h-3" />
                        {order.customer.email}
                      </p>
                      <p className="text-muted-foreground flex items-center gap-2">
                        <Phone className="w-3 h-3" />
                        {order.customer.phone}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-forest mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Shipping Address
                    </h4>
                    <p className="text-sm text-muted-foreground">{order.shippingAddress}</p>
                  </div>
                </div>

                {/* Products */}
                <div className="mb-4">
                  <h4 className="font-semibold text-forest mb-2">Products Ordered</h4>
                  <div className="space-y-2">
                    {order.products.map((product, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-2xl bg-forest/5">
                        <div>
                          <p className="font-medium text-forest">{product.name}</p>
                          <p className="text-sm text-muted-foreground">Qty: {product.quantity}</p>
                        </div>
                        <p className="font-semibold text-forest">{formatCurrency(product.price)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-forest/20">
                  <Button size="sm" variant="outline" className="border-forest text-forest hover:bg-forest hover:text-white">
                    <Eye className="w-4 h-4 mr-1" />
                    View Details
                  </Button>
                  <Button size="sm" variant="outline" className="border-forest text-forest hover:bg-forest hover:text-white">
                    Update Status
                  </Button>
                  <Button size="sm" variant="outline" className="border-forest text-forest hover:bg-forest hover:text-white">
                    Print Invoice
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <Card className="bg-white/90 backdrop-blur-sm border-forest/20 shadow-lg">
            <CardContent className="p-12 text-center">
              <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-forest mb-2">No orders found</h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm ? 'Try adjusting your search terms' : 'No orders have been placed yet'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default VendorOrders;
