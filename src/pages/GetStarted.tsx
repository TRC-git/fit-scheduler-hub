
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, ArrowRight, Calendar, Users, Building, Zap } from "lucide-react";
import MarketingLayout from "@/components/layout/MarketingLayout";

const GetStarted = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: "",
    contactName: "",
    email: "",
    phone: "",
    businessType: "",
    locations: "",
    currentChallenges: "",
    preferredDemo: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const steps = [
    {
      title: "Business Information",
      description: "Tell us about your fitness business"
    },
    {
      title: "Current Challenges",
      description: "Help us understand your pain points"
    },
    {
      title: "Demo Scheduling",
      description: "Book your personalized demo"
    },
    {
      title: "Welcome to ScheduleFor",
      description: "You're all set!"
    }
  ];

  const businessTypes = [
    "Independent Gym",
    "Fitness Studio",
    "Personal Training",
    "Yoga/Pilates Studio",
    "CrossFit Box",
    "Martial Arts Academy",
    "Gym Chain",
    "Franchise",
    "Other"
  ];

  return (
    <MarketingLayout>
      {/* Hero Section */}
      <section className="pt-20 pb-12 px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-orbitron font-bold mb-6 matrix-gradient-text leading-tight">
            Start Your Transformation
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-8 max-w-3xl mx-auto">
            Get up and running with ScheduleFor in just a few steps. Our team will guide you through the entire process.
          </p>
        </div>
      </section>

      {/* Progress Indicator */}
      <section className="pb-8 px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8 overflow-x-auto">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center flex-shrink-0">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm
                  ${index + 1 <= currentStep 
                    ? 'bg-green-600 text-white' 
                    : 'glass-card text-white/60'
                  }
                `}>
                  {index + 1 <= currentStep ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`
                    w-8 sm:w-16 h-1 mx-2 sm:mx-4
                    ${index + 1 < currentStep ? 'bg-green-600' : 'bg-white/20'}
                  `} />
                )}
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-orbitron font-bold text-white mb-2">
              {steps[currentStep - 1].title}
            </h2>
            <p className="text-white/70">
              {steps[currentStep - 1].description}
            </p>
          </div>
        </div>
      </section>

      {/* Form Steps */}
      <section className="pb-20 px-4 relative z-10">
        <div className="max-w-2xl mx-auto">
          <div className="glass-card p-6 sm:p-8">
            {/* Step 1: Business Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="businessName" className="text-white mb-2 block">
                      Business Name *
                    </Label>
                    <Input
                      id="businessName"
                      value={formData.businessName}
                      onChange={(e) => handleInputChange("businessName", e.target.value)}
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="Your Gym Name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="contactName" className="text-white mb-2 block">
                      Your Name *
                    </Label>
                    <Input
                      id="contactName"
                      value={formData.contactName}
                      onChange={(e) => handleInputChange("contactName", e.target.value)}
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="John Smith"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="email" className="text-white mb-2 block">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="john@yourgym.com"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone" className="text-white mb-2 block">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-white mb-2 block">Business Type *</Label>
                    <select
                      value={formData.businessType}
                      onChange={(e) => handleInputChange("businessType", e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white"
                    >
                      <option value="">Select Business Type</option>
                      {businessTypes.map((type) => (
                        <option key={type} value={type} className="bg-zinc-900">
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="locations" className="text-white mb-2 block">
                      Number of Locations
                    </Label>
                    <Input
                      id="locations"
                      value={formData.locations}
                      onChange={(e) => handleInputChange("locations", e.target.value)}
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="1"
                    />
                  </div>
                </div>

                <Button
                  onClick={() => setCurrentStep(2)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  disabled={!formData.businessName || !formData.contactName || !formData.email || !formData.businessType}
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Step 2: Current Challenges */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="challenges" className="text-white mb-2 block">
                    What are your biggest challenges with current scheduling/management?
                  </Label>
                  <Textarea
                    id="challenges"
                    value={formData.currentChallenges}
                    onChange={(e) => handleInputChange("currentChallenges", e.target.value)}
                    className="bg-white/10 border-white/20 text-white h-32"
                    placeholder="Tell us about your pain points, current tools, and what you'd like to improve..."
                  />
                </div>

                <div className="glass-card p-6 border-green-500/20">
                  <h3 className="text-lg font-orbitron font-semibold text-green-400 mb-4">
                    Common Challenges We Solve:
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                      <span className="text-white/70">Double bookings & conflicts</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                      <span className="text-white/70">Manual payroll processing</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                      <span className="text-white/70">Staff scheduling chaos</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                      <span className="text-white/70">Poor reporting & insights</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                      <span className="text-white/70">Multiple disconnected tools</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                      <span className="text-white/70">Scaling limitations</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={() => setCurrentStep(1)}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() => setCurrentStep(3)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Demo Scheduling */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-white mb-4 block text-lg">
                    When would you like your personalized demo?
                  </Label>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      "ASAP - Contact me today",
                      "This week",
                      "Next week", 
                      "Within the next month"
                    ].map((option) => (
                      <button
                        key={option}
                        onClick={() => handleInputChange("preferredDemo", option)}
                        className={`
                          p-4 rounded-lg border-2 transition-all duration-200 text-left
                          ${formData.preferredDemo === option
                            ? 'border-green-500 bg-green-500/20 text-green-400'
                            : 'border-white/20 bg-white/5 text-white/70 hover:bg-white/10'
                          }
                        `}
                      >
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 mr-3" />
                          {option}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="glass-card p-6 border-green-500/20">
                  <h3 className="text-lg font-orbitron font-semibold text-green-400 mb-4">
                    What to Expect in Your Demo:
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <Users className="h-5 w-5 text-green-400 mr-3 mt-0.5" />
                      <div>
                        <span className="text-white font-medium">Personalized walkthrough</span>
                        <p className="text-white/60 text-sm">Tailored to your specific business needs and challenges</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Building className="h-5 w-5 text-green-400 mr-3 mt-0.5" />
                      <div>
                        <span className="text-white font-medium">Live platform demo</span>
                        <p className="text-white/60 text-sm">See exactly how ScheduleFor works with real data</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Zap className="h-5 w-5 text-green-400 mr-3 mt-0.5" />
                      <div>
                        <span className="text-white font-medium">Implementation plan</span>
                        <p className="text-white/60 text-sm">Custom roadmap for getting you up and running</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={() => setCurrentStep(2)}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() => setCurrentStep(4)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    disabled={!formData.preferredDemo}
                  >
                    Schedule My Demo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Confirmation */}
            {currentStep === 4 && (
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="h-10 w-10 text-white" />
                </div>
                
                <div>
                  <h2 className="text-2xl font-orbitron font-bold text-green-400 mb-2">
                    Welcome to ScheduleFor!
                  </h2>
                  <p className="text-white/80">
                    Thank you {formData.contactName}! We've received your information and will contact you within 24 hours to schedule your personalized demo.
                  </p>
                </div>

                <div className="glass-card p-6 text-left">
                  <h3 className="text-lg font-orbitron font-semibold text-white mb-4">
                    What happens next:
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center mr-3 text-xs text-white font-bold">1</div>
                      <span className="text-white/70">Our team reviews your information</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center mr-3 text-xs text-white font-bold">2</div>
                      <span className="text-white/70">We'll call or email you to schedule your demo</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center mr-3 text-xs text-white font-bold">3</div>
                      <span className="text-white/70">Personalized demo based on your business needs</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center mr-3 text-xs text-white font-bold">4</div>
                      <span className="text-white/70">Start your free trial and onboarding</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <p className="text-white/60 text-sm">
                    Questions? Email us at <span className="text-green-400">hello@schedulefor.com</span> or call <span className="text-green-400">(555) 123-4567</span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
};

export default GetStarted;
