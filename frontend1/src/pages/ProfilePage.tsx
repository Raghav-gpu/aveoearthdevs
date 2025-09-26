import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Settings,
  Shield,
  Heart,
  Package,
  Leaf,
  Edit,
  Camera,
  TreePine,
  Award,
  Star,
  Save
} from 'lucide-react';

// Mock user data
const mockUser = {
  id: 1,
  name: "Priya Sharma",
  email: "priya.sharma@email.com",
  phone: "+91 98765 43210",
  avatar: "/api/placeholder/120/120",
  joinDate: "March 2023",
  addresses: [
    {
      id: 1,
      type: "Home",
      isDefault: true,
      name: "Priya Sharma",
      address: "123, Green Valley Apartments",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      phone: "+91 98765 43210"
    },
    {
      id: 2,
      type: "Office",
      isDefault: false,
      name: "Priya Sharma",
      address: "456, Eco Business Park",
      city: "Mumbai",
      state: "Maharashtra", 
      pincode: "400020",
      phone: "+91 98765 43210"
    }
  ],
  ecoImpact: {
    totalOrders: 47,
    treesPlanted: 23,
    carbonSaved: "157kg",
    plasticSaved: "2.4kg",
    ecoScore: 92,
    rank: "Eco Champion"
  },
  preferences: {
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    newsletter: true,
    productUpdates: true,
    orderUpdates: true
  }
};

const recentOrders = [
  {
    id: "ORD-2024-001",
    date: "2024-01-15",
    status: "Delivered",
    total: "₹2,847",
    items: 3,
    ecoImpact: "0.8kg CO₂ saved"
  },
  {
    id: "ORD-2024-002", 
    date: "2024-01-10",
    status: "Delivered",
    total: "₹1,299",
    items: 1,
    ecoImpact: "0.3kg CO₂ saved"
  },
  {
    id: "ORD-2024-003",
    date: "2024-01-05",
    status: "In Transit",
    total: "₹899",
    items: 2,
    ecoImpact: "0.2kg CO₂ saved"
  }
];

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(mockUser);

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to backend
  };

  const AddressCard = ({ address }: { address: typeof mockUser.addresses[0] }) => (
    <Card className={`${address.isDefault ? 'ring-2 ring-forest' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold">{address.type}</h4>
            {address.isDefault && (
              <Badge className="eco-badge bg-forest text-white text-xs">Default</Badge>
            )}
          </div>
          <Button variant="ghost" size="sm">
            <Edit className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="space-y-1 text-sm text-muted-foreground">
          <p className="font-medium text-charcoal">{address.name}</p>
          <p>{address.address}</p>
          <p>{address.city}, {address.state} - {address.pincode}</p>
          <p>{address.phone}</p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="relative">
                  <img 
                    src={editedUser.avatar}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute bottom-0 right-0 rounded-full bg-white shadow-md"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-2xl font-headline font-bold text-charcoal">
                        {editedUser.name}
                      </h1>
                      <p className="text-muted-foreground">Member since {editedUser.joinDate}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      {isEditing ? (
                        <>
                          <Button variant="outline" onClick={() => setIsEditing(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleSave}>
                            <Save className="w-4 h-4 mr-2" />
                            Save
                          </Button>
                        </>
                      ) : (
                        <Button variant="outline" onClick={() => setIsEditing(true)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Profile
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{editedUser.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{editedUser.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-forest" />
                      <span className="text-sm font-medium text-forest">
                        {editedUser.ecoImpact.rank}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Eco Impact Overview */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-moss text-white">
            <CardContent className="p-4 text-center">
              <TreePine className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{mockUser.ecoImpact.treesPlanted}</div>
              <div className="text-sm opacity-90">Trees Planted</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-earth text-white">
            <CardContent className="p-4 text-center">
              <Leaf className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{mockUser.ecoImpact.carbonSaved}</div>
              <div className="text-sm opacity-90">CO₂ Saved</div>
            </CardContent>
          </Card>
          
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-4 text-center">
              <Package className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{mockUser.ecoImpact.totalOrders}</div>
              <div className="text-sm opacity-90">Orders</div>
            </CardContent>
          </Card>
          
          <Card className="bg-accent text-accent-foreground">
            <CardContent className="p-4 text-center">
              <Star className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{mockUser.ecoImpact.ecoScore}</div>
              <div className="text-sm opacity-90">Eco Score</div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Tabs */}
        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="addresses">Addresses</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="impact">Eco Impact</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Personal Information */}
          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={editedUser.name}
                      onChange={(e) => setEditedUser({...editedUser, name: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={editedUser.email}
                      onChange={(e) => setEditedUser({...editedUser, email: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={editedUser.phone}
                      onChange={(e) => setEditedUser({...editedUser, phone: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="birthdate">Birth Date</Label>
                    <Input
                      id="birthdate"
                      type="date"
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <textarea
                    id="bio"
                    className="w-full p-3 border border-border rounded-lg bg-background disabled:opacity-50"
                    rows={3}
                    placeholder="Tell us about yourself and your eco journey..."
                    disabled={!isEditing}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Addresses */}
          <TabsContent value="addresses">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Saved Addresses</h2>
                <Button>
                  <MapPin className="w-4 h-4 mr-2" />
                  Add New Address
                </Button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                {mockUser.addresses.map((address) => (
                  <AddressCard key={address.id} address={address} />
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Recent Orders */}
          <TabsContent value="orders">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Orders</CardTitle>
                <Button variant="outline" asChild>
                  <a href="/orders">View All Orders</a>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <span className="font-medium">#{order.id}</span>
                          <Badge 
                            className={`text-xs ${
                              order.status === 'Delivered' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {order.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {order.date} • {order.items} items • {order.ecoImpact}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{order.total}</div>
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Eco Impact */}
          <TabsContent value="impact">
            <div className="space-y-6">
              <Card className="bg-gradient-hero">
                <CardContent className="p-6 text-center">
                  <Leaf className="w-12 h-12 text-forest mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-charcoal mb-2">
                    {mockUser.ecoImpact.rank}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    You're in the top 15% of eco-conscious shoppers!
                  </p>
                  <div className="w-full bg-muted rounded-full h-3 mb-2">
                    <div 
                      className="bg-forest h-3 rounded-full" 
                      style={{ width: `${mockUser.ecoImpact.ecoScore}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Eco Score: {mockUser.ecoImpact.ecoScore}/100
                  </span>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TreePine className="w-5 h-5 text-forest" />
                      Environmental Impact
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Trees Planted</span>
                      <span className="font-bold text-forest">{mockUser.ecoImpact.treesPlanted}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Carbon Footprint Reduced</span>
                      <span className="font-bold text-forest">{mockUser.ecoImpact.carbonSaved}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Plastic Waste Avoided</span>
                      <span className="font-bold text-forest">{mockUser.ecoImpact.plasticSaved}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-clay" />
                      Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-forest rounded-full flex items-center justify-center">
                        <TreePine className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-medium">Tree Hugger</div>
                        <div className="text-sm text-muted-foreground">Planted 20+ trees</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-clay rounded-full flex items-center justify-center">
                        <Package className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-medium">Loyal Customer</div>
                        <div className="text-sm text-muted-foreground">40+ orders placed</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-moss rounded-full flex items-center justify-center">
                        <Heart className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-medium">Eco Champion</div>
                        <div className="text-sm text-muted-foreground">Top 15% impact</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Notification Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Email Notifications</div>
                      <div className="text-sm text-muted-foreground">
                        Receive order updates and promotions via email
                      </div>
                    </div>
                    <input type="checkbox" defaultChecked={mockUser.preferences.emailNotifications} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">SMS Notifications</div>
                      <div className="text-sm text-muted-foreground">
                        Get important order updates via SMS
                      </div>
                    </div>
                    <input type="checkbox" defaultChecked={mockUser.preferences.smsNotifications} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Newsletter</div>
                      <div className="text-sm text-muted-foreground">
                        Weekly eco-tips and sustainable product updates
                      </div>
                    </div>
                    <input type="checkbox" defaultChecked={mockUser.preferences.newsletter} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Privacy & Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    Change Password
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Two-Factor Authentication
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Download My Data
                  </Button>
                  <Button variant="destructive" className="w-full justify-start">
                    Delete Account
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfilePage;