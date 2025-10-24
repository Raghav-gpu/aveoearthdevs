import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Search, 
  Package, 
  Truck, 
  CheckCircle, 
  XCircle,
  Clock,
  MapPin,
  Calendar,
  ArrowLeft,
  RefreshCw,
  Leaf
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface TrackingInfo {
  orderId: string;
  orderNumber: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  statusText: string;
  trackingNumber: string;
  carrier: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  currentLocation?: string;
  timeline: {
    status: string;
    timestamp: string;
    location?: string;
    description: string;
  }[];
  items: {
    id: string;
    name: string;
    quantity: number;
    price: string;
    image: string;
  }[];
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

const TrackOrderPage = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Mock tracking data for demonstration
  const mockTrackingData: Record<string, TrackingInfo> = {
    'AVEO847291': {
      orderId: 'ORD-2024-001',
      orderNumber: 'AVEO847291',
      status: 'delivered',
      statusText: 'Delivered',
      trackingNumber: 'AVEO847291',
      carrier: 'EcoShip',
      estimatedDelivery: '2024-01-18',
      actualDelivery: '2024-01-17',
      currentLocation: 'Delivered to recipient',
      timeline: [
        {
          status: 'delivered',
          timestamp: '2024-01-17 14:30',
          location: 'Customer Address',
          description: 'Package delivered successfully'
        },
        {
          status: 'out_for_delivery',
          timestamp: '2024-01-17 08:15',
          location: 'Local Distribution Center',
          description: 'Out for delivery'
        },
        {
          status: 'in_transit',
          timestamp: '2024-01-16 22:45',
          location: 'Regional Hub',
          description: 'Package in transit'
        },
        {
          status: 'processing',
          timestamp: '2024-01-15 10:20',
          location: 'Warehouse',
          description: 'Order processed and packed'
        },
        {
          status: 'confirmed',
          timestamp: '2024-01-15 09:00',
          location: 'Order Center',
          description: 'Order confirmed'
        }
      ],
      items: [
        {
          id: '1',
          name: 'Eco Bamboo Kitchen Utensil Set',
          quantity: 2,
          price: '₹1,299',
          image: '/api/placeholder/80/80'
        },
        {
          id: '2',
          name: 'Organic Cotton Bags',
          quantity: 1,
          price: '₹549',
          image: '/api/placeholder/80/80'
        }
      ],
      shippingAddress: {
        name: 'John Doe',
        address: '123 Green Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400001',
        country: 'India'
      }
    },
    'AVEO847292': {
      orderId: 'ORD-2024-002',
      orderNumber: 'AVEO847292',
      status: 'shipped',
      statusText: 'Shipped',
      trackingNumber: 'AVEO847292',
      carrier: 'GreenLogistics',
      estimatedDelivery: '2024-01-20',
      currentLocation: 'In Transit - Mumbai Hub',
      timeline: [
        {
          status: 'shipped',
          timestamp: '2024-01-18 16:20',
          location: 'Origin Warehouse',
          description: 'Package shipped'
        },
        {
          status: 'processing',
          timestamp: '2024-01-18 14:30',
          location: 'Warehouse',
          description: 'Order processed and packed'
        },
        {
          status: 'confirmed',
          timestamp: '2024-01-18 12:00',
          location: 'Order Center',
          description: 'Order confirmed'
        }
      ],
      items: [
        {
          id: '3',
          name: 'Sustainable Water Bottle',
          quantity: 1,
          price: '₹899',
          image: '/api/placeholder/80/80'
        }
      ],
      shippingAddress: {
        name: 'Jane Smith',
        address: '456 Eco Avenue',
        city: 'Delhi',
        state: 'Delhi',
        postalCode: '110001',
        country: 'India'
      }
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'shipped':
      case 'out_for_delivery':
        return <Truck className="w-5 h-5 text-blue-600" />;
      case 'processing':
        return <Package className="w-5 h-5 text-yellow-600" />;
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
      case 'out_for_delivery':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleTrackOrder = async () => {
    if (!trackingNumber.trim() && !orderNumber.trim()) {
      setError('Please enter either a tracking number or order number');
      return;
    }

    setIsLoading(true);
    setError(null);

    // Simulate API call
    setTimeout(() => {
      const searchKey = trackingNumber.trim() || orderNumber.trim();
      const found = mockTrackingData[searchKey];
      
      if (found) {
        setTrackingInfo(found);
      } else {
        setError('Order not found. Please check your tracking number or order number.');
      }
      
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-green-600 hover:text-green-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              <Leaf className="w-8 h-8 inline-block mr-2 text-green-600" />
              Track Your Order
            </h1>
            <p className="text-gray-600">
              Enter your tracking number or order number to see the status of your eco-friendly purchase
            </p>
          </div>
        </div>

        {/* Tracking Form */}
        <Card className="max-w-2xl mx-auto mb-8">
          <CardHeader>
            <CardTitle className="text-center">Order Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="tracking-number">Tracking Number</Label>
                <Input
                  id="tracking-number"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter tracking number (e.g., AVEO847291)"
                  className="mt-1"
                />
              </div>
              
              <div className="text-center text-gray-500">OR</div>
              
              <div>
                <Label htmlFor="order-number">Order Number</Label>
                <Input
                  id="order-number"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="Enter order number"
                  className="mt-1"
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                onClick={handleTrackOrder}
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Tracking...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Track Order
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tracking Results */}
        {trackingInfo && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Order #{trackingInfo.orderNumber}</CardTitle>
                    <p className="text-gray-600">Tracking: {trackingInfo.trackingNumber}</p>
                  </div>
                  <Badge className={getStatusColor(trackingInfo.status)}>
                    {getStatusIcon(trackingInfo.status)}
                    <span className="ml-2">{trackingInfo.statusText}</span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Truck className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Carrier</p>
                      <p className="text-gray-600">{trackingInfo.carrier}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium">Estimated Delivery</p>
                      <p className="text-gray-600">{trackingInfo.estimatedDelivery}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="font-medium">Current Location</p>
                      <p className="text-gray-600">{trackingInfo.currentLocation}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Shipping Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trackingInfo.timeline.map((event, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        {getStatusIcon(event.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-gray-900">{event.description}</p>
                          <p className="text-sm text-gray-500">{event.timestamp}</p>
                        </div>
                        {event.location && (
                          <p className="text-sm text-gray-600 mt-1">
                            <MapPin className="w-4 h-4 inline mr-1" />
                            {event.location}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trackingInfo.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-gray-600">Quantity: {item.quantity}</p>
                        <p className="text-green-600 font-medium">{item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">{trackingInfo.shippingAddress.name}</p>
                  <p>{trackingInfo.shippingAddress.address}</p>
                  <p>
                    {trackingInfo.shippingAddress.city}, {trackingInfo.shippingAddress.state} {trackingInfo.shippingAddress.postalCode}
                  </p>
                  <p>{trackingInfo.shippingAddress.country}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Help Section */}
        <Card className="max-w-2xl mx-auto mt-8">
          <CardHeader>
            <CardTitle className="text-center">Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <p className="text-gray-600">
                Can't find your order? Contact our customer support team.
              </p>
              <div className="flex justify-center space-x-4">
                <Button variant="outline" asChild>
                  <Link to="/contact">Contact Support</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/orders">View All Orders</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TrackOrderPage;
