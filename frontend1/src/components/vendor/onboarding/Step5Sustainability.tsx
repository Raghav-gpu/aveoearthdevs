import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  Leaf, 
  Upload, 
  CheckCircle,
  AlertCircle,
  Loader2,
  Award,
  Recycle,
  Sun,
  Droplets,
  Wind,
  TreePine,
  Shield
} from 'lucide-react';

interface Step5SustainabilityProps {
  formData: any;
  handleChange: (field: string, value: any) => void;
}

const Step5Sustainability: React.FC<Step5SustainabilityProps> = ({ 
  formData, 
  handleChange 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedCertificate, setUploadedCertificate] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedPractices, setSelectedPractices] = useState<string[]>([]);

  const sustainabilityPractices = [
    { id: 'organic', label: 'Organic Production', icon: Leaf, description: 'Products made with organic materials' },
    { id: 'recycled', label: 'Recycled Materials', icon: Recycle, description: 'Made from recycled or upcycled materials' },
    { id: 'renewable', label: 'Renewable Energy', icon: Sun, description: 'Manufactured using renewable energy sources' },
    { id: 'water', label: 'Water Conservation', icon: Droplets, description: 'Water-efficient production processes' },
    { id: 'carbon', label: 'Carbon Neutral', icon: Wind, description: 'Carbon-neutral or carbon-negative operations' },
    { id: 'biodiversity', label: 'Biodiversity Protection', icon: TreePine, description: 'Supports biodiversity conservation' },
    { id: 'fair', label: 'Fair Trade', icon: Shield, description: 'Fair trade certified practices' },
    { id: 'local', label: 'Local Sourcing', icon: Award, description: 'Locally sourced materials and labor' }
  ];

  const certifications = [
    'USDA Organic',
    'Fair Trade Certified',
    'FSC (Forest Stewardship Council)',
    'GOTS (Global Organic Textile Standard)',
    'OEKO-TEX Standard 100',
    'Cradle to Cradle',
    'B Corp Certified',
    'ISO 14001',
    'Carbon Trust',
    'Other'
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.sustainability_practices?.trim()) {
      newErrors.sustainability_practices = 'Please describe your sustainability practices';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePracticeToggle = (practiceId: string) => {
    const newPractices = selectedPractices.includes(practiceId)
      ? selectedPractices.filter(id => id !== practiceId)
      : [...selectedPractices, practiceId];
    setSelectedPractices(newPractices);
    
    const practiceLabels = newPractices.map(id => 
      sustainabilityPractices.find(p => p.id === id)?.label
    ).filter(Boolean);
    
    handleChange('sustainability_practices', practiceLabels.join(', '));
  };

  const handleCertificateUpload = (file: File) => {
    setUploadedCertificate(file);
    handleChange('sustainability_certificate', file);
  };

  const removeCertificate = () => {
    setUploadedCertificate(null);
    handleChange('sustainability_certificate', null);
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Move to next step or complete onboarding
    } catch (error) {
      console.error('Failed to save sustainability profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-forest/10 to-moss/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Leaf className="w-8 h-8 text-forest" />
        </div>
        <h3 className="text-2xl font-headline font-bold text-charcoal mb-2">
          Sustainability Practices
        </h3>
        <p className="text-charcoal/70">
          Share your environmental and social responsibility practices
        </p>
      </div>

      {/* Sustainability Practices */}
      <Card className="border-2 border-forest/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-charcoal">
            <Leaf className="w-5 h-5 text-forest" />
            Environmental Practices
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sustainabilityPractices.map((practice) => {
              const Icon = practice.icon;
              const isSelected = selectedPractices.includes(practice.id);
              
              return (
                <div
                  key={practice.id}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'border-forest bg-forest/5 shadow-md'
                      : 'border-forest/20 hover:border-forest/40 hover:bg-forest/2'
                  }`}
                  onClick={() => handlePracticeToggle(practice.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isSelected ? 'bg-forest text-white' : 'bg-forest/10 text-forest'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-charcoal">{practice.label}</h4>
                        {isSelected && <CheckCircle className="w-4 h-4 text-forest" />}
                      </div>
                      <p className="text-sm text-charcoal/70 mt-1">{practice.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Description */}
      <Card className="border-2 border-forest/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-charcoal">
            <Award className="w-5 h-5 text-forest" />
            Detailed Sustainability Description
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sustainability_practices" className="text-charcoal font-medium">
              Describe Your Sustainability Practices *
            </Label>
            <Textarea
              id="sustainability_practices"
              value={formData.sustainability_practices || ''}
              onChange={(e) => handleChange('sustainability_practices', e.target.value)}
              className={`min-h-[120px] border-2 ${
                errors.sustainability_practices 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                  : 'border-forest/20 focus:border-forest focus:ring-forest/20'
              } rounded-xl`}
              placeholder="Describe your environmental and social responsibility practices, certifications, and impact..."
            />
            {errors.sustainability_practices && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.sustainability_practices}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Certifications */}
      <Card className="border-2 border-forest/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-charcoal">
            <Award className="w-5 h-5 text-forest" />
            Sustainability Certifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="text-charcoal font-medium">
              Upload Sustainability Certificate (Optional)
            </Label>
            <div className="border-2 border-dashed border-forest/30 rounded-xl p-6 text-center hover:border-forest/50 transition-colors">
              <input
                type="file"
                id="sustainability_certificate"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleCertificateUpload(file);
                }}
                className="hidden"
              />
              <label htmlFor="sustainability_certificate" className="cursor-pointer">
                <Upload className="w-8 h-8 text-forest/50 mx-auto mb-2" />
                <p className="text-sm text-charcoal/70 mb-1">Click to upload certificate</p>
                <p className="text-xs text-charcoal/50">PDF, JPG, PNG (max 5MB)</p>
              </label>
            </div>
          </div>

          {uploadedCertificate && (
            <div className="flex items-center justify-between p-3 bg-forest/5 border-2 border-forest/20 rounded-xl">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-forest" />
                <span className="text-sm text-charcoal">{uploadedCertificate.name}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={removeCertificate}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                Remove
              </Button>
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-charcoal font-medium">
              Common Certifications
            </Label>
            <div className="flex flex-wrap gap-2">
              {certifications.map((cert) => (
                <Badge
                  key={cert}
                  variant="secondary"
                  className="bg-forest/10 text-forest hover:bg-forest/20 cursor-pointer"
                >
                  {cert}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Impact Statement */}
      <Card className="border-2 border-forest/10 bg-gradient-to-br from-forest/5 to-moss/5">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-forest rounded-full flex items-center justify-center mx-auto">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-charcoal text-lg">Making a Difference</h4>
              <p className="text-charcoal/70">
                By sharing your sustainability practices, you're helping customers make informed choices 
                and contributing to a more sustainable future. Your commitment to environmental and social 
                responsibility makes a real impact.
              </p>
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
              Completing Onboarding...
            </>
          ) : (
            'Complete Onboarding'
          )}
        </Button>
      </div>
    </div>
  );
};

export default Step5Sustainability;
