import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Store, 
  ArrowLeft, 
  Leaf, 
  BarChart3, 
  DollarSign, 
  Shield, 
  CheckCircle,
  Sparkles,
  Zap
} from 'lucide-react';

const VendorPage = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    contactPerson: '',
    phone: '',
    agreeToTerms: false
  });

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (mode === 'register') {
        // Validate form data
        if (formData.password !== formData.confirmPassword) {
          alert('Passwords do not match!');
          return;
        }
        if (!formData.agreeToTerms) {
          alert('Please agree to the terms and conditions!');
          return;
        }
        
        // Show success message and redirect to login
        alert('Registration successful! Please login with your credentials.');
        setMode('login');
        setFormData({
          email: '',
          password: '',
          confirmPassword: '',
          businessName: '',
          contactPerson: '',
          phone: '',
          agreeToTerms: false
        });
        return;
      }
      
      // Handle login - for demo purposes, accept any email/password
      if (formData.email && formData.password) {
        // Store vendor session in localStorage for demo
        localStorage.setItem('vendorSession', JSON.stringify({
          email: formData.email,
          businessName: formData.businessName || 'Demo Business',
          loginTime: new Date().toISOString()
        }));
        
        // Redirect to dashboard
        window.location.href = '/vendor/dashboard';
      } else {
        alert('Please enter both email and password!');
      }
    } catch (error) {
      console.error('Authentication failed:', error);
      alert('Authentication failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest/5 via-moss/10 to-clay/5 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-forest/20 to-moss/10 rounded-full blur-3xl animate-float-gentle"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-moss/20 to-clay/10 rounded-full blur-3xl animate-float-gentle" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-clay/10 to-forest/5 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-forest/15 rounded-full blur-2xl animate-bounce-slow"></div>
        <div className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-moss/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Enhanced Header */}
      <nav className="relative z-10 bg-white/90 backdrop-blur-md border-b border-forest/20 shadow-lg px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-forest to-moss rounded-2xl flex items-center justify-center group-hover:from-moss group-hover:to-clay transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 shadow-lg">
              <Leaf className="w-6 h-6 text-white group-hover:animate-pulse" />
            </div>
            <div>
              <span className="font-bold text-xl text-forest group-hover:text-moss transition-colors duration-300 bg-gradient-to-r from-forest to-moss bg-clip-text text-transparent">AveoEarth</span>
              <span className="text-sm text-moss ml-2 font-medium">Vendor Portal</span>
            </div>
          </Link>
          
          <Link to="/" className="text-forest hover:text-moss flex items-center gap-2 group transition-all duration-300 hover:scale-105 px-4 py-2 rounded-xl hover:bg-forest/10">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
            Back to Marketplace
          </Link>
        </div>
      </nav>

      <div className="relative z-10 max-w-md mx-auto px-4 py-12">
        {/* Enhanced Welcome Section */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-forest/20 to-moss/20 rounded-3xl flex items-center justify-center mx-auto mb-6 group hover:from-moss/20 hover:to-clay/20 transition-all duration-500 hover:scale-110 hover:rotate-12 shadow-lg">
            <Store className="w-10 h-10 text-forest group-hover:text-moss transition-colors duration-300 group-hover:animate-bounce" />
          </div>
          <h1 className="text-4xl font-headline font-bold text-forest mb-3 animate-fade-in-up bg-gradient-to-r from-forest via-moss to-clay bg-clip-text text-transparent">
            Welcome Vendor
          </h1>
          <p className="text-muted-foreground text-lg animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            {mode === 'login' 
              ? 'Sign in to your vendor account' 
              : 'Join AveoEarth as a sustainable vendor'
            }
          </p>
        </div>

        {/* Enhanced Auth Form */}
        <Card className="bg-white/95 backdrop-blur-md border-forest/20 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-forest/5 to-moss/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardHeader className="pb-4 relative z-10">
            <CardTitle className="text-center text-2xl font-bold text-forest bg-gradient-to-r from-forest to-moss bg-clip-text text-transparent">
              {mode === 'login' ? 'Sign In' : 'Get Started'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {/* Enhanced Mode Toggle */}
            <div className="flex bg-gradient-to-r from-forest/10 to-moss/10 rounded-2xl p-1 mb-6 shadow-lg">
              <button
                onClick={() => setMode('login')}
                className={`flex-1 py-3 px-4 text-sm font-semibold rounded-xl transition-all duration-300 ${
                  mode === 'login'
                    ? 'bg-gradient-to-r from-forest to-moss text-white shadow-lg scale-105 hover:scale-110'
                    : 'text-forest hover:text-moss hover:bg-forest/5 hover:scale-105'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setMode('register')}
                className={`flex-1 py-3 px-4 text-sm font-semibold rounded-xl transition-all duration-300 ${
                  mode === 'register'
                    ? 'bg-gradient-to-r from-forest to-moss text-white shadow-lg scale-105 hover:scale-110'
                    : 'text-forest hover:text-moss hover:bg-forest/5 hover:scale-105'
                }`}
              >
                Register
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="businessName" className="text-forest font-semibold">
                      Business Name
                    </Label>
                    <Input
                      id="businessName"
                      type="text"
                      value={formData.businessName}
                      onChange={(e) => handleChange('businessName', e.target.value)}
                      className="border-forest/20 focus:border-forest focus:ring-forest/20"
                      placeholder="Enter your business name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactPerson" className="text-forest font-semibold">
                      Contact Person
                    </Label>
                    <Input
                      id="contactPerson"
                      type="text"
                      value={formData.contactPerson}
                      onChange={(e) => handleChange('contactPerson', e.target.value)}
                      className="border-forest/20 focus:border-forest focus:ring-forest/20"
                      placeholder="Your full name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-forest font-semibold">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className="border-forest/20 focus:border-forest focus:ring-forest/20"
                      placeholder="+1 (555) 123-4567"
                      required
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-forest font-semibold">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="border-forest/20 focus:border-forest focus:ring-forest/20"
                  placeholder="vendor@business.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-forest font-semibold">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  className="border-forest/20 focus:border-forest focus:ring-forest/20"
                  placeholder="Create a secure password"
                  required
                />
              </div>

              {mode === 'register' && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-forest font-semibold">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    className="border-forest/20 focus:border-forest focus:ring-forest/20"
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              )}

              {mode === 'register' && (
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => handleChange('agreeToTerms', checked as boolean)}
                    className="mt-1"
                  />
                  <Label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed">
                    I agree to the{' '}
                    <Link to="/vendor/terms" className="text-forest hover:text-moss font-semibold">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/vendor/privacy" className="text-forest hover:text-moss font-semibold">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-forest to-moss hover:from-moss hover:to-clay text-white py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:animate-pulse"
              >
                {mode === 'login' ? 'Sign In' : 'Start Registration Process'}
              </Button>
              
              {mode === 'register' && (
                <div className="mt-3">
                  <Link to="/vendor/onboarding">
                    <Button variant="outline" className="w-full border-forest text-forest hover:bg-forest hover:text-white">
                      Direct Registration (Recommended)
                    </Button>
                  </Link>
                </div>
              )}
            </form>

            {mode === 'login' && (
              <div className="mt-4 text-center">
                <Link to="/vendor/forgot-password" className="text-sm text-forest hover:text-moss font-semibold">
                  Forgot your password?
                </Link>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-forest/20 text-center">
              <p className="text-sm text-muted-foreground">
                Need help?{' '}
                <Link to="/vendor/support" className="text-forest hover:text-moss font-semibold">
                  Contact Vendor Support
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Benefits Section for Registration */}
        {mode === 'register' && (
          <Card className="mt-8 bg-white/95 backdrop-blur-md border-forest/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-moss/5 to-clay/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardContent className="p-6 relative z-10">
              <h3 className="font-bold text-xl text-forest mb-6 text-center bg-gradient-to-r from-forest to-moss bg-clip-text text-transparent">Why Sell on AveoEarth?</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 group/item p-3 rounded-2xl hover:bg-forest/5 transition-all duration-300 hover:scale-105">
                  <div className="w-12 h-12 bg-gradient-to-br from-forest/20 to-moss/20 rounded-2xl flex items-center justify-center group-hover/item:from-moss/20 group-hover/item:to-clay/20 transition-all duration-500 group-hover/item:scale-110 group-hover/item:rotate-12 shadow-lg">
                    <Leaf className="w-6 h-6 text-forest group-hover/item:text-moss transition-colors duration-300 group-hover/item:animate-bounce" />
                  </div>
                  <div>
                    <div className="font-semibold text-forest text-lg group-hover/item:text-moss transition-colors duration-300">Sustainable Focus</div>
                    <div className="text-muted-foreground">Reach eco-conscious customers</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 group/item p-3 rounded-2xl hover:bg-moss/5 transition-all duration-300 hover:scale-105">
                  <div className="w-12 h-12 bg-gradient-to-br from-moss/20 to-clay/20 rounded-2xl flex items-center justify-center group-hover/item:from-clay/20 group-hover/item:to-forest/20 transition-all duration-500 group-hover/item:scale-110 group-hover/item:rotate-12 shadow-lg">
                    <BarChart3 className="w-6 h-6 text-moss group-hover/item:text-clay transition-colors duration-300 group-hover/item:animate-pulse" />
                  </div>
                  <div>
                    <div className="font-semibold text-forest text-lg group-hover/item:text-moss transition-colors duration-300">Analytics & Insights</div>
                    <div className="text-muted-foreground">Track your performance</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 group/item p-3 rounded-2xl hover:bg-clay/5 transition-all duration-300 hover:scale-105">
                  <div className="w-12 h-12 bg-gradient-to-br from-clay/20 to-forest/20 rounded-2xl flex items-center justify-center group-hover/item:from-forest/20 group-hover/item:to-moss/20 transition-all duration-500 group-hover/item:scale-110 group-hover/item:rotate-12 shadow-lg">
                    <DollarSign className="w-6 h-6 text-clay group-hover/item:text-forest transition-colors duration-300 group-hover/item:animate-bounce" />
                  </div>
                  <div>
                    <div className="font-semibold text-forest text-lg group-hover/item:text-moss transition-colors duration-300">Competitive Fees</div>
                    <div className="text-muted-foreground">Low transaction costs</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 group/item p-3 rounded-2xl hover:bg-forest/5 transition-all duration-300 hover:scale-105">
                  <div className="w-12 h-12 bg-gradient-to-br from-forest/20 to-moss/20 rounded-2xl flex items-center justify-center group-hover/item:from-moss/20 group-hover/item:to-clay/20 transition-all duration-500 group-hover/item:scale-110 group-hover/item:rotate-12 shadow-lg">
                    <Shield className="w-6 h-6 text-forest group-hover/item:text-moss transition-colors duration-300 group-hover/item:animate-pulse" />
                  </div>
                  <div>
                    <div className="font-semibold text-forest text-lg group-hover/item:text-moss transition-colors duration-300">Secure Platform</div>
                    <div className="text-muted-foreground">Protected transactions</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default VendorPage;
