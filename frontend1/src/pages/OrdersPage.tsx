import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Package, 
  Truck, 
  CheckCircle, 
  XCircle,
  RotateCcw,
  Eye,
  Download,
  Star,
  Calendar,
  Filter,
  Leaf,
  ArrowRight
} from 'lucide-react';

// Mock orders data
const mockOrders = [
  {
    id: "ORD-2024-001",
    date: "2024-01-15",
    status: "delivered",
    statusText: "Delivered",
    total: "₹2,847",
    items: [
      {
        id: 1,
        name: "Eco Bamboo Kitchen Utensil Set",
        quantity: 2,
        price: "₹1,299",
        image: "/api/placeholder/80/80"
      },
      {
        id: 2,
        name: "Organic Cotton Bags",
        quantity: 1,
        price: "₹549",
        image: "/api/placeholder/80/80"
      }
    ],
    trackingId: "AVEO847291",
    estimatedDelivery: "2024-01-18",
    actualDelivery: "2024-01-17",
    ecoImpact: {
      carbonSaved: "0.8kg",
      treesPlanted: 2,
      plasticSaved: "150g"
    },
    canReturn: true,
    canReview: true
  },
  {
    id: "ORD-2024-002",
    date: "2024-01-10",
    status: "in-transit",
    statusText: "In Transit",
    total: "₹1,299",
    items: [
      {
        id: 3,
        name: "Natural Face Serum",
        quantity: 1,
        price: "₹1,299",
        image: "/api/placeholder/80/80"
      }
    ],
    trackingId: "AVEO847292",
    estimatedDelivery: "2024-01-25",
    ecoImpact: {
      carbonSaved: "0.3kg",
      treesPlanted: 1,
      plasticSaved: "50g"
    },
    canReturn: false,
    canReview: false
  },
  {
    id: "ORD-2024-003",
    date: "2024-01-05",
    status: "processing",
    statusText: "Processing",
    total: "₹899",
    items: [
      {
        id: 4,
        name: "Hemp Yoga Mat",
        quantity: 1,
        price: "₹899",
        image: "/api/placeholder/80/80"
      }
    ],
    trackingId: "AVEO847293",
    estimatedDelivery: "2024-01-30",
    ecoImpact: {
      carbonSaved: "0.5kg",
      treesPlanted: 1,
      plasticSaved: "200g"
    },
    canReturn: false,
    canReview: false
  },
  {
    id: "ORD-2023-045",
    date: "2023-12-20",
    status: "cancelled",
    statusText: "Cancelled",
    total: "₹1,599",
    items: [
      {
        id: 5,
        name: "Solar Power Bank",
        quantity: 1,
        price: "₹1,599",
        image: "/api/placeholder/80/80"
      }
    ],
    trackingId: "AVEO847294",
    cancelReason: "Out of stock",
    refundStatus: "Refunded",
    canReturn: false,
    canReview: false
  }
];

const OrdersPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const statusColors = {
    processing: 'bg-blue-100 text-blue-800',
    'in-transit': 'bg-yellow-100 text-yellow-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    returned: 'bg-gray-100 text-gray-800'
  };

  const statusIcons = {
    processing: Package,
    'in-transit': Truck,
    delivered: CheckCircle,
    cancelled: XCircle,
    returned: RotateCcw
  };

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const ordersByStatus = {
    all: mockOrders,
    processing: mockOrders.filter(order => order.status === 'processing'),
    'in-transit': mockOrders.filter(order => order.status === 'in-transit'),
    delivered: mockOrders.filter(order => order.status === 'delivered'),
    cancelled: mockOrders.filter(order => order.status === 'cancelled')
  };

  const OrderCard = ({ order }: { order: typeof mockOrders[0] }) => {
    const StatusIcon = statusIcons[order.status as keyof typeof statusIcons];
    
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Order Header */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-lg">#{order.id}</h3>
                  <Badge className={`${statusColors[order.status as keyof typeof statusColors]} text-xs`}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {order.statusText}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Ordered on {order.date}
                  </span>
                  <span>{order.total}</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-1" />
                  Invoice
                </Button>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <img 
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{item.name}</h4>
                    <div className="text-sm text-muted-foreground">
                      Qty: {item.quantity} • {item.price}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Status & Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="space-y-1">
                {order.status === 'processing' && (
                  <p className="text-sm text-muted-foreground">
                    Expected delivery: {order.estimatedDelivery}
                  </p>
                )}
                {order.status === 'in-transit' && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Tracking ID: {order.trackingId}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Expected delivery: {order.estimatedDelivery}
                    </p>
                  </div>
                )}
                {order.status === 'delivered' && (
                  <p className="text-sm text-green-600">
                    Delivered on {order.actualDelivery}
                  </p>
                )}
                {order.status === 'cancelled' && (
                  <div className="space-y-1">
                    <p className="text-sm text-red-600">
                      Reason: {order.cancelReason}
                    </p>
                    <p className="text-sm text-green-600">
                      Status: {order.refundStatus}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                {order.status === 'in-transit' && (
                  <Button variant="outline" size="sm">
                    Track Order
                  </Button>
                )}
                {order.canReturn && (
                  <Button variant="outline" size="sm">
                    Return/Exchange
                  </Button>
                )}
                {order.canReview && (
                  <Button variant="outline" size="sm">
                    <Star className="w-4 h-4 mr-1" />
                    Review
                  </Button>
                )}
                {order.status === 'delivered' && (
                  <Button size="sm" className="btn-secondary">
                    Buy Again
                  </Button>
                )}
              </div>
            </div>

            {/* Eco Impact */}
            {order.ecoImpact && (
              <Card className="bg-gradient-moss text-white border-0">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Leaf className="w-4 h-4" />
                    <span className="font-medium text-sm">Your Eco Impact</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-xs">
                    <div className="text-center">
                      <div className="font-bold">{order.ecoImpact.carbonSaved}</div>
                      <div className="opacity-90">CO₂ Saved</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold">{order.ecoImpact.treesPlanted}</div>
                      <div className="opacity-90">Trees Planted</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold">{order.ecoImpact.plasticSaved}</div>
                      <div className="opacity-90">Plastic Saved</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-headline font-bold text-charcoal mb-2">
            My Orders
          </h1>
          <p className="text-muted-foreground">
            Track and manage your sustainable purchases
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search orders by ID or product name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <select 
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-4 py-2 border border-border rounded-lg bg-background"
                >
                  <option value="all">All Orders</option>
                  <option value="processing">Processing</option>
                  <option value="in-transit">In Transit</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <Package className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{ordersByStatus.processing.length}</div>
              <div className="text-sm text-muted-foreground">Processing</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Truck className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{ordersByStatus['in-transit'].length}</div>
              <div className="text-sm text-muted-foreground">In Transit</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{ordersByStatus.delivered.length}</div>
              <div className="text-sm text-muted-foreground">Delivered</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <XCircle className="w-6 h-6 text-red-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{ordersByStatus.cancelled.length}</div>
              <div className="text-sm text-muted-foreground">Cancelled</div>
            </CardContent>
          </Card>
        </div>

        {/* Orders List */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="processing">Processing</TabsTrigger>
            <TabsTrigger value="in-transit">In Transit</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>

          {Object.entries(ordersByStatus).map(([status, orders]) => (
            <TabsContent key={status} value={status} className="space-y-4">
              {orders.length > 0 ? (
                orders.map((order) => <OrderCard key={order.id} order={order} />)
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-charcoal mb-2">
                      No {status === 'all' ? '' : status} orders found
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {status === 'all' 
                        ? "You haven't placed any orders yet." 
                        : `You don't have any ${status} orders.`
                      }
                    </p>
                    <Button asChild className="btn-hero">
                      <Link to="/products">
                        Start Shopping
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          ))}
        </Tabs>

        {/* Help Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-auto p-4 flex-col space-y-2">
                <Package className="w-6 h-6" />
                <span>Track an Order</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex-col space-y-2">
                <RotateCcw className="w-6 h-6" />
                <span>Return/Exchange</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex-col space-y-2" asChild>
                <Link to="/contact">
                  <div className="w-6 h-6 rounded-full bg-forest text-white flex items-center justify-center">
                    ?
                  </div>
                  <span>Contact Support</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrdersPage;