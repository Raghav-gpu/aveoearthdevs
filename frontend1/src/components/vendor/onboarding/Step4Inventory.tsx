import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Package, 
  Plus,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  Weight,
  Ruler,
  MapPin,
  Factory
} from 'lucide-react';

interface Step4InventoryProps {
  formData: any;
  handleChange: (field: string, value: any) => void;
}

const Step4Inventory: React.FC<Step4InventoryProps> = ({ 
  formData, 
  handleChange 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [variants, setVariants] = useState(formData.productVariants || [
    { name: '', price: '', stockQuantity: '', sku: '', isDefault: false }
  ]);

  const addVariant = () => {
    const newVariants = [...variants, { name: '', price: '', stockQuantity: '', sku: '', isDefault: false }];
    setVariants(newVariants);
    handleChange('productVariants', newVariants);
  };

  const removeVariant = (index: number) => {
    if (variants.length > 1) {
      const newVariants = variants.filter((_, i) => i !== index);
      setVariants(newVariants);
      handleChange('productVariants', newVariants);
    }
  };

  const updateVariant = (index: number, field: string, value: any) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
    handleChange('productVariants', newVariants);
  };

  const setDefaultVariant = (index: number) => {
    const newVariants = variants.map((variant, i) => ({
      ...variant,
      isDefault: i === index
    }));
    setVariants(newVariants);
    handleChange('productVariants', newVariants);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.weight || formData.weight <= 0) {
      newErrors.weight = 'Weight is required';
    }

    if (!formData.origin_country?.trim()) {
      newErrors.origin_country = 'Origin country is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Move to next step
    } catch (error) {
      console.error('Failed to save inventory:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-forest/10 to-moss/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <BarChart3 className="w-8 h-8 text-forest" />
        </div>
        <h3 className="text-2xl font-headline font-bold text-charcoal mb-2">
          Inventory Management
        </h3>
        <p className="text-charcoal/70">
          Set up your inventory tracking and product variants
        </p>
      </div>

      {/* Physical Properties */}
      <Card className="border-2 border-forest/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-charcoal">
            <Weight className="w-5 h-5 text-forest" />
            Physical Properties
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="weight" className="text-charcoal font-medium">
                Weight (kg) *
              </Label>
              <div className="relative">
                <Weight className="absolute left-3 top-1/2 transform -translate-y-1/2 text-charcoal/40 w-4 h-4" />
                <Input
                  id="weight"
                  type="number"
                  value={formData.weight || ''}
                  onChange={(e) => handleChange('weight', parseFloat(e.target.value) || 0)}
                  className={`pl-10 h-12 border-2 ${
                    errors.weight 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                      : 'border-forest/20 focus:border-forest focus:ring-forest/20'
                  } rounded-xl`}
                  placeholder="0.0"
                  min="0"
                  step="0.1"
                />
              </div>
              {errors.weight && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.weight}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="origin_country" className="text-charcoal font-medium">
                Origin Country *
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-charcoal/40 w-4 h-4" />
                <Input
                  id="origin_country"
                  value={formData.origin_country || ''}
                  onChange={(e) => handleChange('origin_country', e.target.value)}
                  className={`pl-10 h-12 border-2 ${
                    errors.origin_country 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                      : 'border-forest/20 focus:border-forest focus:ring-forest/20'
                  } rounded-xl`}
                  placeholder="e.g., India, USA, China"
                />
              </div>
              {errors.origin_country && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.origin_country}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="materials" className="text-charcoal font-medium">
              Materials Used
            </Label>
            <Textarea
              id="materials"
              value={Array.isArray(formData.materials) ? formData.materials.join(', ') : ''}
              onChange={(e) => handleChange('materials', e.target.value.split(',').map(m => m.trim()).filter(m => m))}
              className="min-h-[80px] border-2 border-forest/20 focus:border-forest focus:ring-forest/20 rounded-xl"
              placeholder="e.g., Organic Cotton, Recycled Plastic, Bamboo"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="care_instructions" className="text-charcoal font-medium">
              Care Instructions
            </Label>
            <Textarea
              id="care_instructions"
              value={formData.care_instructions || ''}
              onChange={(e) => handleChange('care_instructions', e.target.value)}
              className="min-h-[80px] border-2 border-forest/20 focus:border-forest focus:ring-forest/20 rounded-xl"
              placeholder="e.g., Machine wash cold, Air dry, Do not bleach"
            />
          </div>
        </CardContent>
      </Card>

      {/* Product Variants */}
      <Card className="border-2 border-forest/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-charcoal">
            <Package className="w-5 h-5 text-forest" />
            Product Variants
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {variants.map((variant, index) => (
              <div key={index} className="border-2 border-forest/10 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-charcoal">Variant {index + 1}</h4>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`default-${index}`}
                      checked={variant.isDefault}
                      onCheckedChange={() => setDefaultVariant(index)}
                    />
                    <Label htmlFor={`default-${index}`} className="text-sm text-charcoal/70">
                      Default
                    </Label>
                    {variants.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeVariant(index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-charcoal font-medium">Variant Name</Label>
                    <Input
                      value={variant.name}
                      onChange={(e) => updateVariant(index, 'name', e.target.value)}
                      placeholder="e.g., Small, Red, Size 10"
                      className="h-10 border-2 border-forest/20 focus:border-forest focus:ring-forest/20 rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-charcoal font-medium">SKU</Label>
                    <Input
                      value={variant.sku}
                      onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                      placeholder="e.g., PROD-SM-RED"
                      className="h-10 border-2 border-forest/20 focus:border-forest focus:ring-forest/20 rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-charcoal font-medium">Price</Label>
                    <Input
                      type="number"
                      value={variant.price}
                      onChange={(e) => updateVariant(index, 'price', e.target.value)}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className="h-10 border-2 border-forest/20 focus:border-forest focus:ring-forest/20 rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-charcoal font-medium">Stock Quantity</Label>
                    <Input
                      type="number"
                      value={variant.stockQuantity}
                      onChange={(e) => updateVariant(index, 'stockQuantity', e.target.value)}
                      placeholder="0"
                      min="0"
                      className="h-10 border-2 border-forest/20 focus:border-forest focus:ring-forest/20 rounded-xl"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button
            onClick={addVariant}
            variant="outline"
            className="w-full border-2 border-forest/20 hover:border-forest hover:bg-forest/5 text-forest"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Variant
          </Button>
        </CardContent>
      </Card>

      {/* Inventory Settings */}
      <Card className="border-2 border-forest/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-charcoal">
            <Factory className="w-5 h-5 text-forest" />
            Inventory Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="track_quantity"
                checked={formData.track_quantity !== false}
                onCheckedChange={(checked) => handleChange('track_quantity', checked)}
              />
              <div>
                <Label htmlFor="track_quantity" className="text-charcoal font-medium">
                  Track Quantity
                </Label>
                <p className="text-sm text-charcoal/70">
                  Automatically track inventory levels and prevent overselling
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="continue_selling"
                checked={formData.continue_selling !== false}
                onCheckedChange={(checked) => handleChange('continue_selling', checked)}
              />
              <div>
                <Label htmlFor="continue_selling" className="text-charcoal font-medium">
                  Continue Selling When Out of Stock
                </Label>
                <p className="text-sm text-charcoal/70">
                  Allow customers to purchase even when inventory is zero
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center">
        <Button
          onClick={handleSave}
          disabled={isSubmitting}
          className="btn-primary px-8 py-3 text-lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Saving Inventory...
            </>
          ) : (
            'Save & Continue'
          )}
        </Button>
      </div>
    </div>
  );
};

export default Step4Inventory;
