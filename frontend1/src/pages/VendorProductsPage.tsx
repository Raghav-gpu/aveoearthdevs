import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Copy,
  Star,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  BarChart3
} from 'lucide-react';

const VendorProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  // Mock data - in real app this would come from API
  const products = [
    {
      id: 1,
      name: 'Organic Cotton T-Shirt',
      sku: 'TSH-001',
      price: 29.99,
      comparePrice: 39.99,
      stock: 45,
      status: 'active',
      category: 'Clothing',
      sales: 125,
      revenue: 3748.75,
      growth: 15.2,
      rating: 4.8,
      reviews: 23,
      image: '/api/placeholder/80/80',
      sustainability: 95,
      createdAt: '2024-01-10',
      updatedAt: '2024-01-15'
    },
    {
      id: 2,
      name: 'Bamboo Water Bottle',
      sku: 'BWB-002',
      price: 24.99,
      comparePrice: 34.99,
      stock: 32,
      status: 'active',
      category: 'Accessories',
      sales: 89,
      revenue: 2224.11,
      growth: 8.7,
      rating: 4.6,
      reviews: 18,
      image: '/api/placeholder/80/80',
      sustainability: 98,
      createdAt: '2024-01-08',
      updatedAt: '2024-01-14'
    },
    {
      id: 3,
      name: 'Eco-Friendly Skincare Set',
      sku: 'SKS-003',
      price: 89.99,
      comparePrice: 119.99,
      stock: 12,
      status: 'low-stock',
      category: 'Beauty',
      sales: 45,
      revenue: 4049.55,
      growth: -3.1,
      rating: 4.9,
      reviews: 31,
      image: '/api/placeholder/80/80',
      sustainability: 92,
      createdAt: '2024-01-05',
      updatedAt: '2024-01-12'
    },
    {
      id: 4,
      name: 'Recycled Paper Notebook',
      sku: 'RPN-004',
      price: 12.99,
      comparePrice: 16.99,
      stock: 0,
      status: 'out-of-stock',
      category: 'Stationery',
      sales: 78,
      revenue: 1013.22,
      growth: 22.4,
      rating: 4.4,
      reviews: 12,
      image: '/api/placeholder/80/80',
      sustainability: 88,
      createdAt: '2024-01-03',
      updatedAt: '2024-01-10'
    },
    {
      id: 5,
      name: 'Solar-Powered Phone Charger',
      sku: 'SPC-005',
      price: 49.99,
      comparePrice: 69.99,
      stock: 28,
      status: 'draft',
      category: 'Electronics',
      sales: 0,
      revenue: 0,
      growth: 0,
      rating: 0,
      reviews: 0,
      image: '/api/placeholder/80/80',
      sustainability: 96,
      createdAt: '2024-01-20',
      updatedAt: '2024-01-20'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-forest text-white';
      case 'low-stock': return 'bg-amber-500 text-white';
      case 'out-of-stock': return 'bg-red-500 text-white';
      case 'draft': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'low-stock': return <AlertCircle className="w-4 h-4" />;
      case 'out-of-stock': return <AlertCircle className="w-4 h-4" />;
      case 'draft': return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || product.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage/5 via-background to-moss/5 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-headline font-bold text-charcoal">Products</h1>
            <p className="text-charcoal/70">Manage your product catalog and inventory</p>
          </div>
          <Button className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Product
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-charcoal/70">Total Products</p>
                  <p className="text-2xl font-bold text-charcoal">{products.length}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-forest/10 to-forest/20 rounded-full flex items-center justify-center">
                  <Package className="w-6 h-6 text-forest" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-charcoal/70">Active Products</p>
                  <p className="text-2xl font-bold text-charcoal">{products.filter(p => p.status === 'active').length}</p>
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
                  <p className="text-sm font-medium text-charcoal/70">Low Stock</p>
                  <p className="text-2xl font-bold text-charcoal">{products.filter(p => p.status === 'low-stock').length}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-charcoal/70">Total Revenue</p>
                  <p className="text-2xl font-bold text-charcoal">${products.reduce((sum, p) => sum + p.revenue, 0).toLocaleString()}</p>
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
                    placeholder="Search products by name or SKU..."
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
                  <option value="active">Active</option>
                  <option value="low-stock">Low Stock</option>
                  <option value="out-of-stock">Out of Stock</option>
                  <option value="draft">Draft</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border-2 border-forest/20 rounded-xl bg-white focus:border-forest focus:ring-4 focus:ring-forest/20"
                >
                  <option value="name">Sort by Name</option>
                  <option value="price">Sort by Price</option>
                  <option value="sales">Sort by Sales</option>
                  <option value="created">Sort by Created</option>
                </select>
                <Button variant="outline" className="border-2 border-forest/20 hover:border-forest hover:bg-forest/5 text-forest">
                  <Filter className="w-4 h-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-charcoal">
              <Package className="w-5 h-5 text-forest" />
              Products ({filteredProducts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-4 border-2 border-forest/10 rounded-xl hover:border-forest/20 transition-colors">
                  <div className="flex items-center gap-4">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-charcoal">{product.name}</h3>
                        <Badge className={`text-xs ${getStatusColor(product.status)}`}>
                          {getStatusIcon(product.status)}
                          <span className="ml-1 capitalize">{product.status.replace('-', ' ')}</span>
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-charcoal/70">
                        <span>SKU: {product.sku}</span>
                        <span>•</span>
                        <span>{product.category}</span>
                        <span>•</span>
                        <span>Stock: {product.stock}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span>{product.rating}</span>
                          <span>({product.reviews})</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-charcoal">${product.price}</span>
                        {product.comparePrice && (
                          <span className="text-sm text-charcoal/50 line-through">${product.comparePrice}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-charcoal/70">{product.sales} sales</span>
                        <div className="flex items-center gap-1">
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
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="text-charcoal/70 hover:text-charcoal">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-charcoal/70 hover:text-charcoal">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-charcoal/70 hover:text-charcoal">
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
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

export default VendorProductsPage;
