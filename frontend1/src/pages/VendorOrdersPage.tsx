import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  Search, 
  Filter, 
  MoreVertical,
  Eye,
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  DollarSign,
  Calendar,
  User,
  Phone,
  Mail,
  MapPin,
  ArrowRight
} from 'lucide-react';

const VendorOrdersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  // Mock data - in real app this would come from API
  const orders = [
    {
      id: 'ORD-001',
      customer: {
        name: 'John Smith',
        email: 'john.smith@email.com',
        phone: '+1 (555) 123-4567',
        address: '123 Main St, New York, NY 10001'
      },
      items: [
        { name: 'Organic Cotton T-Shirt', quantity: 2, price: 29.99 },
        { name: 'Bamboo Water Bottle', quantity: 1, price: 24.99 }
      ],
      total: 84.97,
      status: 'completed',
      paymentStatus: 'paid',
      shippingStatus: 'delivered',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-16T14:20:00Z',
      trackingNumber: 'TRK123456789',
      notes: 'Customer requested express delivery'
    },
    {
      id: 'ORD-002',
      customer: {
        name: 'Sarah Johnson',
        email: 'sarah.j@email.com',
        phone: '+1 (555) 987-6543',
        address: '456 Oak Ave, Los Angeles, CA 90210'
      },
      items: [
        { name: 'Eco-Friendly Skincare Set', quantity: 1, price: 89.99 }
      ],
      total: 89.99,
      status: 'processing',
      paymentStatus: 'paid',
      shippingStatus: 'preparing',
      createdAt: '2024-01-15T09:15:00Z',
      updatedAt: '2024-01-15T11:45:00Z',
      trackingNumber: null,
      notes: ''
    },
    {
      id: 'ORD-003',
      customer: {
        name: 'Mike Wilson',
        email: 'mike.wilson@email.com',
        phone: '+1 (555) 456-7890',
        address: '789 Pine St, Chicago, IL 60601'
      },
      items: [
        { name: 'Recycled Paper Notebook', quantity: 3, price: 12.99 },
        { name: 'Solar-Powered Phone Charger', quantity: 1, price: 49.99 }
      ],
      total: 88.96,
      status: 'shipped',
      paymentStatus: 'paid',
      shippingStatus: 'in-transit',
      createdAt: '2024-01-14T14:45:00Z',
      updatedAt: '2024-01-15T08:30:00Z',
      trackingNumber: 'TRK987654321',
      notes: 'Fragile items - handle with care'
    },
    {
      id: 'ORD-004',
      customer: {
        name: 'Emma Davis',
        email: 'emma.davis@email.com',
        phone: '+1 (555) 321-0987',
        address: '321 Elm St, Miami, FL 33101'
      },
      items: [
        { name: 'Organic Cotton T-Shirt', quantity: 1, price: 29.99 }
      ],
      total: 29.99,
      status: 'pending',
      paymentStatus: 'pending',
      shippingStatus: 'not-shipped',
      createdAt: '2024-01-14T11:20:00Z',
      updatedAt: '2024-01-14T11:20:00Z',
      trackingNumber: null,
      notes: 'Payment verification required'
    },
    {
      id: 'ORD-005',
      customer: {
        name: 'David Brown',
        email: 'david.brown@email.com',
        phone: '+1 (555) 654-3210',
        address: '654 Maple Dr, Seattle, WA 98101'
      },
      items: [
        { name: 'Bamboo Water Bottle', quantity: 2, price: 24.99 },
        { name: 'Eco-Friendly Skincare Set', quantity: 1, price: 89.99 }
      ],
      total: 139.97,
      status: 'cancelled',
      paymentStatus: 'refunded',
      shippingStatus: 'cancelled',
      createdAt: '2024-01-13T16:30:00Z',
      updatedAt: '2024-01-14T09:15:00Z',
      trackingNumber: null,
      notes: 'Customer requested cancellation'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-forest text-white';
      case 'processing': return 'bg-amber-500 text-white';
      case 'shipped': return 'bg-blue-500 text-white';
      case 'pending': return 'bg-gray-500 text-white';
      case 'cancelled': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'processing': return <Clock className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-forest text-white';
      case 'pending': return 'bg-amber-500 text-white';
      case 'refunded': return 'bg-blue-500 text-white';
      case 'failed': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage/5 via-background to-moss/5 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-headline font-bold text-charcoal">Orders</h1>
            <p className="text-charcoal/70">Manage and track your customer orders</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="border-2 border-forest/20 hover:border-forest hover:bg-forest/5 text-forest">
              <Package className="w-4 h-4 mr-2" />
              Bulk Actions
            </Button>
            <Button className="btn-primary">
              Export Orders
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-charcoal/70">Total Orders</p>
                  <p className="text-2xl font-bold text-charcoal">{orders.length}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-forest/10 to-forest/20 rounded-full flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-forest" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-charcoal/70">Completed</p>
                  <p className="text-2xl font-bold text-charcoal">{orders.filter(o => o.status === 'completed').length}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-sage/20 to-sage/30 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-sage" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-charcoal/70">Processing</p>
                  <p className="text-2xl font-bold text-charcoal">{orders.filter(o => o.status === 'processing').length}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-charcoal/70">Total Revenue</p>
                  <p className="text-2xl font-bold text-charcoal">${orders.reduce((sum, o) => sum + o.total, 0).toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-moss/20 to-moss/30 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-moss" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-charcoal/40 w-4 h-4" />
                  <Input
                    placeholder="Search orders by ID, customer name, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 border-2 border-forest/20 focus:border-forest focus:ring-4 focus:ring-forest/20 rounded-xl"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border-2 border-forest/20 rounded-xl bg-white focus:border-forest focus:ring-4 focus:ring-forest/20"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border-2 border-forest/20 rounded-xl bg-white focus:border-forest focus:ring-4 focus:ring-forest/20"
                >
                  <option value="date">Sort by Date</option>
                  <option value="total">Sort by Total</option>
                  <option value="status">Sort by Status</option>
                  <option value="customer">Sort by Customer</option>
                </select>
                <Button variant="outline" className="border-2 border-forest/20 hover:border-forest hover:bg-forest/5 text-forest">
                  <Filter className="w-4 h-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-charcoal">
              <ShoppingCart className="w-5 h-5 text-forest" />
              Orders ({filteredOrders.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div key={order.id} className="border-2 border-forest/10 rounded-xl p-6 hover:border-forest/20 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-forest/10 to-forest/20 rounded-full flex items-center justify-center">
                        {getStatusIcon(order.status)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-charcoal text-lg">{order.id}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={`text-xs ${getStatusColor(order.status)}`}>
                            {order.status}
                          </Badge>
                          <Badge className={`text-xs ${getPaymentStatusColor(order.paymentStatus)}`}>
                            {order.paymentStatus}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-charcoal">${order.total.toFixed(2)}</p>
                      <p className="text-sm text-charcoal/70">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div>
                      <h4 className="font-medium text-charcoal mb-2 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Customer
                      </h4>
                      <div className="space-y-1 text-sm text-charcoal/70">
                        <p className="font-medium text-charcoal">{order.customer.name}</p>
                        <div className="flex items-center gap-2">
                          <Mail className="w-3 h-3" />
                          <span>{order.customer.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-3 h-3" />
                          <span>{order.customer.phone}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin className="w-3 h-3 mt-0.5" />
                          <span>{order.customer.address}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-charcoal mb-2 flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        Items ({order.items.length})
                      </h4>
                      <div className="space-y-1">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span className="text-charcoal/70">{item.name}</span>
                            <div className="text-right">
                              <span className="text-charcoal/70">Qty: {item.quantity}</span>
                              <span className="ml-2 font-medium text-charcoal">${item.price.toFixed(2)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {order.trackingNumber && (
                    <div className="mb-4 p-3 bg-forest/5 border border-forest/20 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-forest" />
                        <span className="text-sm font-medium text-charcoal">Tracking Number:</span>
                        <span className="text-sm text-forest font-mono">{order.trackingNumber}</span>
                      </div>
                    </div>
                  )}

                  {order.notes && (
                    <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5" />
                        <div>
                          <span className="text-sm font-medium text-amber-800">Notes:</span>
                          <p className="text-sm text-amber-700 mt-1">{order.notes}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="border-2 border-forest/20 hover:border-forest hover:bg-forest/5 text-forest">
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                      {order.status === 'processing' && (
                        <Button size="sm" className="btn-primary">
                          <Truck className="w-4 h-4 mr-1" />
                          Ship Order
                        </Button>
                      )}
                      {order.status === 'pending' && (
                        <Button size="sm" className="btn-primary">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Process Order
                        </Button>
                      )}
                    </div>
                    <div className="text-sm text-charcoal/60">
                      Updated: {formatDate(order.updatedAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VendorOrdersPage;
