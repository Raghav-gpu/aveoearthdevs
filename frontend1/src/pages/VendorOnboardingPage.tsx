import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Building2, 
  FileText, 
  Package, 
  BarChart3, 
  Leaf,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Loader2
} from 'lucide-react';

// Import step components
import OnboardingHeader from '@/components/vendor/onboarding/OnboardingHeader';
import OnboardingProgress from '@/components/vendor/onboarding/OnboardingProgress';
import Step1BasicInfo from '@/components/vendor/onboarding/Step1BasicInfo';
import Step2BusinessProfile from '@/components/vendor/onboarding/Step2BusinessProfile';
import Step3ProductInfo from '@/components/vendor/onboarding/Step3ProductInfo';
import Step4Inventory from '@/components/vendor/onboarding/Step4Inventory';
import Step5Sustainability from '@/components/vendor/onboarding/Step5Sustainability';
import OnboardingComplete from '@/components/vendor/onboarding/OnboardingComplete';

const VendorOnboardingPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isComplete, setIsComplete] = useState(false);
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    // Step 1 fields (Seller Signup)
    businessName: '',
    contactPerson: '',
    email: '',
    phone: '',
    password: '',
    agreeToTerms: false,
    
    // Step 2 fields - Business Profile
    business_name: '',
    legal_entity_type: '',
    pan_gst_number: '',
    bank_name: '',
    bank_account_number: '',
    ifsc_code: '',
    business_address: '',
    is_msme_registered: false,
    website: '',
    business_description: '',
    
    // Document uploads
    logo: null,
    banner: null,
    pan_card: null,
    address_proof: null,
    fssai_license: null,
    trade_license: null,
    msme_certificate: null,
    other_document: null,
    other_document_name: '',
    
    // Step 3 fields - Product Basic Info
    name: '',
    sku: '',
    short_description: '',
    description: '',
    category_id: '',
    brand_id: '',
    price: 0,
    compare_at_price: 0,
    cost_per_item: 0,
    tags: [],
    images: [],
    
    // Step 4 fields - Product Details & Inventory
    weight: 0,
    dimensions: {},
    materials: [],
    care_instructions: '',
    origin_country: '',
    manufacturing_details: {},
    track_quantity: true,
    continue_selling: true,
    productVariants: [{ name: '', price: '', stockQuantity: '' }],
    
    // Step 5 fields - Sustainability Profile
    sustainability_practices: '',
    sustainability_certificate: null
  });

  // Check authentication and business status on mount
  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        setIsLoading(true);
        
        // Simulate checking user status
        // In real implementation, check Supabase auth and user profile
        setTimeout(() => {
          setCurrentStep(1);
          setIsSignedUp(false);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error checking user status:', error);
        setCurrentStep(1);
        setIsSignedUp(false);
        setIsLoading(false);
      }
    };

    checkUserStatus();
  }, []);

  const handleChange = (field: string, value: any) => {
    console.log(`Main: handleChange called with field: ${field}, value:`, value);
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle Step 1 completion (signup with OTP verification)
  const handleStep1Complete = () => {
    setIsSignedUp(true);
    setCurrentStep(2);
  };

  // Handle Step 2 completion (save business data)
  const handleStep2Complete = async (hasExistingBusiness = false) => {
    try {
      console.log('Saving business profile...');
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCurrentStep(3);
    } catch (error) {
      console.error('Failed to save business data:', error);
      alert('Failed to save business information: ' + error.message);
    }
  };

  // Handle Step 3 completion (create product)
  const handleStep3Complete = async () => {
    try {
      console.log('Creating product...');
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCurrentStep(4);
    } catch (error) {
      console.error('Failed to create product:', error);
      alert('Failed to create product: ' + error.message);
    }
  };

  // Handle Step 4 completion (inventory management)
  const handleStep4Complete = async () => {
    try {
      console.log('Setting up inventory...');
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCurrentStep(5);
    } catch (error) {
      console.error('Failed to complete inventory setup:', error);
      alert('Failed to complete inventory setup: ' + error.message);
    }
  };

  // Handle Step 5 completion (sustainability)
  const handleStep5Complete = async () => {
    try {
      console.log('Saving sustainability profile...');
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Onboarding completed successfully! Redirecting to your dashboard...');
      navigate('/vendor/dashboard');
    } catch (error) {
      console.error('Failed to save sustainability data:', error);
      alert('Failed to save sustainability information: ' + error.message);
    }
  };

  // Handle skipping step 3 (product creation)
  const handleSkipStep3 = () => {
    console.log('Skipping product creation step');
    setCurrentStep(5);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentStep === 1) {
      return; // Step 1 has its own signup handling
    }
    
    if (currentStep === 2) {
      return; // Step 2 has its own save handling
    }
    
    if (currentStep === 3) {
      await handleStep3Complete();
      return;
    }

    if (currentStep === 4) {
      await handleStep4Complete();
      return;
    }
    
    if (currentStep === 5) {
      await handleStep5Complete();
      return;
    }
  };

  const handleGoBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Show loading state while checking user status
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage/5 via-background to-moss/5 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-forest to-moss rounded-full flex items-center justify-center mx-auto mb-6">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
          <p className="text-charcoal font-semibold text-lg">Checking your onboarding status...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {isComplete ? (
        <OnboardingComplete />
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-sage/5 via-background to-moss/5 overflow-hidden">
          <OnboardingHeader />
          <OnboardingProgress currentStep={currentStep} />

          {/* Main Form Card */}
          <div className="max-w-4xl mx-auto px-4 py-8">
            <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="max-w-3xl mx-auto">
                  
                  {/* Step Header */}
                  <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      {currentStep === 1 && <Building2 className="w-8 h-8 text-forest" />}
                      {currentStep === 2 && <FileText className="w-8 h-8 text-forest" />}
                      {currentStep === 3 && <Package className="w-8 h-8 text-forest" />}
                      {currentStep === 4 && <BarChart3 className="w-8 h-8 text-forest" />}
                      {currentStep === 5 && <Leaf className="w-8 h-8 text-forest" />}
                      <h2 className="text-3xl font-headline font-bold text-charcoal">
                        {currentStep === 1 && 'Basic Information'}
                        {currentStep === 2 && 'Business Profile'}
                        {currentStep === 3 && 'Product Information'}
                        {currentStep === 4 && 'Inventory Management'}
                        {currentStep === 5 && 'Sustainability Practices'}
                      </h2>
                    </div>
                    <p className="text-charcoal/70 text-lg">
                      {currentStep === 1 && 'Tell us about yourself and your business'}
                      {currentStep === 2 && 'Complete your business profile and upload documents'}
                      {currentStep === 3 && 'Add your first product to the marketplace'}
                      {currentStep === 4 && 'Set up inventory and product variants'}
                      {currentStep === 5 && 'Share your sustainability practices and certifications'}
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* Step 1: Basic Information */}
                    {currentStep === 1 && (
                      <Step1BasicInfo 
                        formData={formData} 
                        handleChange={handleChange} 
                        onStepComplete={handleStep1Complete}
                      />
                    )}

                    {/* Step 2: Business Profile */}
                    {currentStep === 2 && (
                      <Step2BusinessProfile 
                        formData={formData} 
                        handleChange={handleChange} 
                        onStepComplete={handleStep2Complete}
                      />
                    )}

                    {/* Step 3: Product Information */}
                    {currentStep === 3 && (
                      <Step3ProductInfo 
                        formData={formData} 
                        handleChange={handleChange}
                        onSkip={handleSkipStep3}
                      />
                    )}

                    {/* Step 4: Inventory Management */}
                    {currentStep === 4 && (
                      <Step4Inventory 
                        formData={formData} 
                        handleChange={handleChange} 
                      />
                    )}

                    {/* Step 5: Sustainability Practices */}
                    {currentStep === 5 && (
                      <Step5Sustainability 
                        formData={formData} 
                        handleChange={handleChange} 
                      />
                    )}
                  </form>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Navigation Actions */}
          <div className="max-w-4xl mx-auto px-4 pb-8">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handleGoBack}
                disabled={currentStep === 1}
                className="flex items-center gap-2 border-2 border-forest/20 hover:border-forest hover:bg-forest/5 text-forest"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>

              <div className="flex items-center gap-4">
                {currentStep < 5 && (
                  <Button
                    onClick={() => {
                      if (currentStep === 1) handleStep1Complete();
                      else if (currentStep === 2) handleStep2Complete();
                      else if (currentStep === 3) handleStep3Complete();
                      else if (currentStep === 4) handleStep4Complete();
                    }}
                    className="btn-primary flex items-center gap-2"
                  >
                    {currentStep === 5 ? 'Complete Onboarding' : 'Continue'}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VendorOnboardingPage;
