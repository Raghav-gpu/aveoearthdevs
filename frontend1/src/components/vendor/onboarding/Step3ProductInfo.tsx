import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  Upload, 
  CheckCircle,
  AlertCircle,
  Loader2,
  X,
  Plus,
  DollarSign,
  Tag,
  Image as ImageIcon,
  BarChart3
} from 'lucide-react';

interface Step3ProductInfoProps {
  formData: any;
  handleChange: (field: string, value: any) => void;
  onSkip: () => void;
}

const Step3ProductInfo: React.FC<Step3ProductInfoProps> = ({ 
  formData, 
  handleChange, 
  onSkip 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tags, setTags] = useState<string[]>(formData.tags || []);
  const [newTag, setNewTag] = useState('');

  const categories = [
    'Electronics',
    'Clothing & Accessories',
    'Home & Garden',
    'Health & Beauty',
    'Sports & Outdoors',
    'Books & Media',
    'Food & Beverages',
    'Automotive',
    'Toys & Games',
    'Other'
  ];

  const brands = [
    'Apple',
    'Samsung',
    'Nike',
    'Adidas',
    'Sony',
    'Microsoft',
    'Google',
    'Amazon',
    'Tesla',
    'Other'
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.category_id) {
      newErrors.category_id = 'Category is required';
    }

    if (!formData.sku?.trim()) {
      newErrors.sku = 'SKU is required';
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Valid price is required';
    }

    if (uploadedImages.length === 0) {
      newErrors.images = 'At least one product image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;
    
    const newImages = Array.from(files);
    const updatedImages = [...uploadedImages, ...newImages].slice(0, 5); // Max 5 images
    setUploadedImages(updatedImages);
    handleChange('images', updatedImages);
  };

  const removeImage = (index: number) => {
    const updatedImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(updatedImages);
    handleChange('images', updatedImages);
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      const updatedTags = [...tags, newTag.trim()];
      setTags(updatedTags);
      handleChange('tags', updatedTags);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    const updatedTags = tags.filter(tag => tag !== tagToRemove);
    setTags(updatedTags);
    handleChange('tags', updatedTags);
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Move to next step
    } catch (error) {
      console.error('Failed to create product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-forest/10 to-moss/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Package className="w-8 h-8 text-forest" />
        </div>
        <h3 className="text-2xl font-headline font-bold text-charcoal mb-2">
          Add Your First Product
        </h3>
        <p className="text-charcoal/70">
          Create your first product listing to get started on AveoEarth
        </p>
      </div>

      {/* Basic Product Information */}
      <Card className="border-2 border-forest/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-charcoal">
            <Package className="w-5 h-5 text-forest" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-charcoal font-medium">
              Product Name *
            </Label>
            <Input
              id="name"
              value={formData.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
              className={`h-12 border-2 ${
                errors.name 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                  : 'border-forest/20 focus:border-forest focus:ring-forest/20'
              } rounded-xl`}
              placeholder="Enter product name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.name}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="category_id" className="text-charcoal font-medium">
                Category *
              </Label>
              <Select 
                value={formData.category_id || ''} 
                onValueChange={(value) => handleChange('category_id', value)}
              >
                <SelectTrigger className={`h-12 border-2 ${
                  errors.category_id 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                    : 'border-forest/20 focus:border-forest focus:ring-forest/20'
                } rounded-xl`}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category_id && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.category_id}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand_id" className="text-charcoal font-medium">
                Brand (Optional)
              </Label>
              <Select 
                value={formData.brand_id || ''} 
                onValueChange={(value) => handleChange('brand_id', value)}
              >
                <SelectTrigger className="h-12 border-2 border-forest/20 focus:border-forest focus:ring-forest/20 rounded-xl">
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((brand) => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sku" className="text-charcoal font-medium">
              SKU (Stock Keeping Unit) *
            </Label>
            <Input
              id="sku"
              value={formData.sku || ''}
              onChange={(e) => handleChange('sku', e.target.value)}
              className={`h-12 border-2 ${
                errors.sku 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                  : 'border-forest/20 focus:border-forest focus:ring-forest/20'
              } rounded-xl`}
              placeholder="Enter unique SKU"
            />
            {errors.sku && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.sku}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="short_description" className="text-charcoal font-medium">
              Short Description
            </Label>
            <Input
              id="short_description"
              value={formData.short_description || ''}
              onChange={(e) => handleChange('short_description', e.target.value)}
              className="h-12 border-2 border-forest/20 focus:border-forest focus:ring-forest/20 rounded-xl"
              placeholder="Brief product description (max 100 characters)"
              maxLength={100}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-charcoal font-medium">
              Detailed Description
            </Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              className="min-h-[120px] border-2 border-forest/20 focus:border-forest focus:ring-forest/20 rounded-xl"
              placeholder="Detailed product description..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Pricing Information */}
      <Card className="border-2 border-forest/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-charcoal">
            <DollarSign className="w-5 h-5 text-forest" />
            Pricing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="price" className="text-charcoal font-medium">
                Selling Price *
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-charcoal/40 w-4 h-4" />
                <Input
                  id="price"
                  type="number"
                  value={formData.price || ''}
                  onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
                  className={`pl-10 h-12 border-2 ${
                    errors.price 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                      : 'border-forest/20 focus:border-forest focus:ring-forest/20'
                  } rounded-xl`}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
              {errors.price && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.price}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="compare_at_price" className="text-charcoal font-medium">
                Compare at Price
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-charcoal/40 w-4 h-4" />
                <Input
                  id="compare_at_price"
                  type="number"
                  value={formData.compare_at_price || ''}
                  onChange={(e) => handleChange('compare_at_price', parseFloat(e.target.value) || 0)}
                  className="pl-10 h-12 border-2 border-forest/20 focus:border-forest focus:ring-forest/20 rounded-xl"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cost_per_item" className="text-charcoal font-medium">
                Cost per Item
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-charcoal/40 w-4 h-4" />
                <Input
                  id="cost_per_item"
                  type="number"
                  value={formData.cost_per_item || ''}
                  onChange={(e) => handleChange('cost_per_item', parseFloat(e.target.value) || 0)}
                  className="pl-10 h-12 border-2 border-forest/20 focus:border-forest focus:ring-forest/20 rounded-xl"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Product Images */}
      <Card className="border-2 border-forest/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-charcoal">
            <ImageIcon className="w-5 h-5 text-forest" />
            Product Images
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="text-charcoal font-medium">
              Upload Images *
            </Label>
            <div className="border-2 border-dashed border-forest/30 rounded-xl p-6 text-center hover:border-forest/50 transition-colors">
              <input
                type="file"
                id="images"
                accept="image/*"
                multiple
                onChange={(e) => handleImageUpload(e.target.files)}
                className="hidden"
              />
              <label htmlFor="images" className="cursor-pointer">
                <Upload className="w-8 h-8 text-forest/50 mx-auto mb-2" />
                <p className="text-sm text-charcoal/70 mb-1">Click to upload images</p>
                <p className="text-xs text-charcoal/50">PNG, JPG, JPEG (max 5 images, 5MB each)</p>
              </label>
            </div>
            {errors.images && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.images}
              </p>
            )}
          </div>

          {uploadedImages.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {uploadedImages.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Product ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border-2 border-forest/20"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tags */}
      <Card className="border-2 border-forest/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-charcoal">
            <Tag className="w-5 h-5 text-forest" />
            Product Tags
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add a tag"
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            />
            <Button onClick={addTag} variant="outline" className="border-forest/20 hover:border-forest hover:bg-forest/5 text-forest">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-forest/10 text-forest hover:bg-forest/20 cursor-pointer"
                  onClick={() => removeTag(tag)}
                >
                  {tag}
                  <X className="w-3 h-3 ml-1" />
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button
          onClick={onSkip}
          variant="outline"
          className="border-2 border-forest/20 hover:border-forest hover:bg-forest/5 text-forest px-8 py-3"
        >
          Skip for Now
        </Button>
        <Button
          onClick={handleSave}
          disabled={isSubmitting}
          className="btn-primary px-8 py-3"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Creating Product...
            </>
          ) : (
            'Create Product'
          )}
        </Button>
      </div>
    </div>
  );
};

export default Step3ProductInfo;
