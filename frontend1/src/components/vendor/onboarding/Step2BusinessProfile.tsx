import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  FileText, 
  Upload, 
  CheckCircle,
  AlertCircle,
  Loader2,
  X,
  Plus,
  Banknote,
  MapPin,
  Globe,
  Award
} from 'lucide-react';

interface Step2BusinessProfileProps {
  formData: any;
  handleChange: (field: string, value: any) => void;
  onStepComplete: (hasExistingBusiness?: boolean) => void;
}

const Step2BusinessProfile: React.FC<Step2BusinessProfileProps> = ({ 
  formData, 
  handleChange, 
  onStepComplete 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File | null>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const legalEntityTypes = [
    'Sole Proprietorship',
    'Partnership',
    'Private Limited Company',
    'Public Limited Company',
    'LLP (Limited Liability Partnership)',
    'HUF (Hindu Undivided Family)',
    'Trust',
    'Society',
    'Other'
  ];

  const documentTypes = [
    { key: 'logo', label: 'Business Logo', required: false, description: 'Your business logo (PNG, JPG, max 2MB)' },
    { key: 'banner', label: 'Banner Image', required: false, description: 'Banner image for your store (PNG, JPG, max 5MB)' },
    { key: 'pan_card', label: 'PAN Card', required: true, description: 'PAN card copy (PDF, JPG, PNG, max 2MB)' },
    { key: 'address_proof', label: 'Address Proof', required: true, description: 'Utility bill or bank statement (PDF, JPG, PNG, max 2MB)' },
    { key: 'fssai_license', label: 'FSSAI License', required: false, description: 'Food license (if applicable) (PDF, JPG, PNG, max 2MB)' },
    { key: 'trade_license', label: 'Trade License', required: false, description: 'Trade license (if applicable) (PDF, JPG, PNG, max 2MB)' },
    { key: 'msme_certificate', label: 'MSME Certificate', required: false, description: 'MSME registration certificate (PDF, JPG, PNG, max 2MB)' },
    { key: 'other_document', label: 'Other Document', required: false, description: 'Any other relevant document (PDF, JPG, PNG, max 2MB)' }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.business_name?.trim()) {
      newErrors.business_name = 'Business name is required';
    }

    if (!formData.legal_entity_type) {
      newErrors.legal_entity_type = 'Legal entity type is required';
    }

    if (!formData.pan_gst_number?.trim()) {
      newErrors.pan_gst_number = 'PAN/GST number is required';
    }

    if (!formData.bank_name?.trim()) {
      newErrors.bank_name = 'Bank name is required';
    }

    if (!formData.bank_account_number?.trim()) {
      newErrors.bank_account_number = 'Bank account number is required';
    }

    if (!formData.ifsc_code?.trim()) {
      newErrors.ifsc_code = 'IFSC code is required';
    }

    if (!formData.business_address?.trim()) {
      newErrors.business_address = 'Business address is required';
    }

    // Check required documents
    if (!uploadedFiles.pan_card) {
      newErrors.pan_card = 'PAN card is required';
    }

    if (!uploadedFiles.address_proof) {
      newErrors.address_proof = 'Address proof is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileUpload = (field: string, file: File) => {
    setUploadedFiles(prev => ({ ...prev, [field]: file }));
    handleChange(field, file);
  };

  const removeFile = (field: string) => {
    setUploadedFiles(prev => ({ ...prev, [field]: null }));
    handleChange(field, null);
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      onStepComplete(false);
    } catch (error) {
      console.error('Failed to save business profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-forest/10 to-moss/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-forest" />
        </div>
        <h3 className="text-2xl font-headline font-bold text-charcoal mb-2">
          Business Profile
        </h3>
        <p className="text-charcoal/70">
          Complete your business information and upload required documents
        </p>
      </div>

      {/* Business Information */}
      <Card className="border-2 border-forest/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-charcoal">
            <Building2 className="w-5 h-5 text-forest" />
            Business Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="business_name" className="text-charcoal font-medium">
                Business Name *
              </Label>
              <Input
                id="business_name"
                value={formData.business_name || ''}
                onChange={(e) => handleChange('business_name', e.target.value)}
                className={`h-12 border-2 ${
                  errors.business_name 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                    : 'border-forest/20 focus:border-forest focus:ring-forest/20'
                } rounded-xl`}
                placeholder="Enter your business name"
              />
              {errors.business_name && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.business_name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="legal_entity_type" className="text-charcoal font-medium">
                Legal Entity Type *
              </Label>
              <Select 
                value={formData.legal_entity_type || ''} 
                onValueChange={(value) => handleChange('legal_entity_type', value)}
              >
                <SelectTrigger className={`h-12 border-2 ${
                  errors.legal_entity_type 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                    : 'border-forest/20 focus:border-forest focus:ring-forest/20'
                } rounded-xl`}>
                  <SelectValue placeholder="Select entity type" />
                </SelectTrigger>
                <SelectContent>
                  {legalEntityTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.legal_entity_type && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.legal_entity_type}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pan_gst_number" className="text-charcoal font-medium">
              PAN/GST Number *
            </Label>
            <Input
              id="pan_gst_number"
              value={formData.pan_gst_number || ''}
              onChange={(e) => handleChange('pan_gst_number', e.target.value)}
              className={`h-12 border-2 ${
                errors.pan_gst_number 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                  : 'border-forest/20 focus:border-forest focus:ring-forest/20'
              } rounded-xl`}
              placeholder="Enter PAN or GST number"
            />
            {errors.pan_gst_number && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.pan_gst_number}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="business_address" className="text-charcoal font-medium">
              Business Address *
            </Label>
            <Textarea
              id="business_address"
              value={formData.business_address || ''}
              onChange={(e) => handleChange('business_address', e.target.value)}
              className={`min-h-[100px] border-2 ${
                errors.business_address 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                  : 'border-forest/20 focus:border-forest focus:ring-forest/20'
              } rounded-xl`}
              placeholder="Enter your complete business address"
            />
            {errors.business_address && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.business_address}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="website" className="text-charcoal font-medium">
                Website (Optional)
              </Label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-charcoal/40 w-4 h-4" />
                <Input
                  id="website"
                  value={formData.website || ''}
                  onChange={(e) => handleChange('website', e.target.value)}
                  className="pl-10 h-12 border-2 border-forest/20 focus:border-forest focus:ring-forest/20 rounded-xl"
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-charcoal font-medium">
                Business Description (Optional)
              </Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                className="min-h-[100px] border-2 border-forest/20 focus:border-forest focus:ring-forest/20 rounded-xl"
                placeholder="Tell us about your business..."
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_msme_registered"
              checked={formData.is_msme_registered || false}
              onCheckedChange={(checked) => handleChange('is_msme_registered', checked)}
            />
            <Label htmlFor="is_msme_registered" className="text-charcoal">
              I am MSME registered
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Banking Information */}
      <Card className="border-2 border-forest/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-charcoal">
            <Banknote className="w-5 h-5 text-forest" />
            Banking Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="bank_name" className="text-charcoal font-medium">
                Bank Name *
              </Label>
              <Input
                id="bank_name"
                value={formData.bank_name || ''}
                onChange={(e) => handleChange('bank_name', e.target.value)}
                className={`h-12 border-2 ${
                  errors.bank_name 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                    : 'border-forest/20 focus:border-forest focus:ring-forest/20'
                } rounded-xl`}
                placeholder="Enter bank name"
              />
              {errors.bank_name && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.bank_name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bank_account_number" className="text-charcoal font-medium">
                Account Number *
              </Label>
              <Input
                id="bank_account_number"
                value={formData.bank_account_number || ''}
                onChange={(e) => handleChange('bank_account_number', e.target.value)}
                className={`h-12 border-2 ${
                  errors.bank_account_number 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                    : 'border-forest/20 focus:border-forest focus:ring-forest/20'
                } rounded-xl`}
                placeholder="Enter account number"
              />
              {errors.bank_account_number && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.bank_account_number}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ifsc_code" className="text-charcoal font-medium">
              IFSC Code *
            </Label>
            <Input
              id="ifsc_code"
              value={formData.ifsc_code || ''}
              onChange={(e) => handleChange('ifsc_code', e.target.value)}
              className={`h-12 border-2 ${
                errors.ifsc_code 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                  : 'border-forest/20 focus:border-forest focus:ring-forest/20'
              } rounded-xl`}
              placeholder="Enter IFSC code"
            />
            {errors.ifsc_code && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.ifsc_code}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Document Upload */}
      <Card className="border-2 border-forest/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-charcoal">
            <Upload className="w-5 h-5 text-forest" />
            Required Documents
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {documentTypes.map((doc) => (
              <div key={doc.key} className="space-y-2">
                <Label className="text-charcoal font-medium flex items-center gap-2">
                  {doc.label}
                  {doc.required && <Badge variant="destructive" className="text-xs">Required</Badge>}
                </Label>
                
                {uploadedFiles[doc.key] ? (
                  <div className="flex items-center justify-between p-3 bg-forest/5 border-2 border-forest/20 rounded-xl">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-forest" />
                      <span className="text-sm text-charcoal">{uploadedFiles[doc.key]?.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(doc.key)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-forest/30 rounded-xl p-6 text-center hover:border-forest/50 transition-colors">
                    <input
                      type="file"
                      id={doc.key}
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(doc.key, file);
                      }}
                      className="hidden"
                    />
                    <label htmlFor={doc.key} className="cursor-pointer">
                      <Upload className="w-8 h-8 text-forest/50 mx-auto mb-2" />
                      <p className="text-sm text-charcoal/70 mb-1">Click to upload</p>
                      <p className="text-xs text-charcoal/50">{doc.description}</p>
                    </label>
                  </div>
                )}
                
                {errors[doc.key] && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors[doc.key]}
                  </p>
                )}
              </div>
            ))}
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
              Saving Profile...
            </>
          ) : (
            'Save & Continue'
          )}
        </Button>
      </div>
    </div>
  );
};

export default Step2BusinessProfile;
