import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar, Users, Clock, BarChart3, Shield, Smartphone, ArrowRight, CheckCircle, Zap, Globe, CreditCard } from "lucide-react";
import MarketingLayout from "@/components/layout/MarketingLayout";
const Features = () => {
  const [activeTab, setActiveTab] = useState("scheduling");
  const handleCTAClick = () => {
    window.scrollTo(0, 0);
  };
  const tabs = [{
    id: "scheduling",
    label: "Smart Scheduling",
    icon: Calendar
  }, {
    id: "staff",
    label: "Staff Management",
    icon: Users
  }, {
    id: "analytics",
    label: "Analytics & Reports",
    icon: BarChart3
  }, {
    id: "advanced",
    label: "Advanced Features",
    icon: Zap
  }];
  const featureContent = {
    scheduling: {
      title: "Intelligent Scheduling Engine",
      description: "Revolutionary scheduling that adapts to your gym's unique needs",
      features: ["AI-powered conflict prevention", "Drag-and-drop schedule builder", "Recurring class templates", "Member capacity management", "Automatic waitlist handling", "Multi-location synchronization"],
      benefits: ["95% reduction in scheduling conflicts", "50% time savings on schedule management", "30% increase in class utilization"]
    },
    staff: {
      title: "Complete Staff Management Suite",
      description: "Everything you need to manage your team efficiently",
      features: ["Staff scheduling and availability", "Certification tracking", "Performance monitoring", "Automated payroll processing", "Time tracking and attendance", "Permission-based access control"],
      benefits: ["80% faster payroll processing", "100% certification compliance", "60% improvement in staff productivity"]
    },
    analytics: {
      title: "Advanced Analytics & Reporting",
      description: "Data-driven insights to optimize your business",
      features: ["Real-time operational dashboards", "Member engagement analytics", "Revenue optimization reports", "Staff performance metrics", "Capacity utilization tracking", "Custom report builder"],
      benefits: ["25% increase in member retention", "40% improvement in operational efficiency", "Real-time decision making capabilities"]
    },
    advanced: {
      title: "Enterprise-Grade Advanced Features",
      description: "Powerful tools for scaling your empire",
      features: ["Multi-location management", "API integrations", "White-label solutions", "Advanced security protocols", "Mobile app for staff and members", "24/7 priority support"],
      benefits: ["Unlimited scalability", "Enterprise-grade security", "99.9% system uptime"]
    }
  };
  const currentContent = featureContent[activeTab];
  return <MarketingLayout>
      {/* Hero Section */}
      <section className="pt-20 pb-12 px-4 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-orbitron font-bold mb-6 matrix-gradient-text">Powerful Features for Modern Business</h1>
          <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
            Discover the comprehensive toolkit that's revolutionizing how businesses operate and scale.
          </p>
        </div>
      </section>

      {/* Feature Tabs */}
      <section className="pb-20 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {tabs.map(tab => <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`
                  flex items-center space-x-3 px-6 py-3 rounded-lg transition-all duration-200
                  ${activeTab === tab.id ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'glass-card text-white/70 hover:text-white hover:bg-white/5'}
                `}>
                <tab.icon className="h-5 w-5" />
                <span className="font-medium">{tab.label}</span>
              </button>)}
          </div>

          {/* Tab Content */}
          <div className="glass-card p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Content */}
              <div>
                <h2 className="text-3xl md:text-4xl font-orbitron font-bold mb-4 matrix-gradient-text">
                  {currentContent.title}
                </h2>
                <p className="text-white/80 text-lg mb-8">
                  {currentContent.description}
                </p>

                {/* Features List */}
                <div className="space-y-4 mb-8">
                  {currentContent.features.map((feature, index) => <div key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-white/70">{feature}</span>
                    </div>)}
                </div>

                {/* Benefits */}
                <div className="glass-card p-6 border-green-500/20">
                  <h4 className="font-orbitron font-semibold text-green-400 mb-4">Key Benefits:</h4>
                  <div className="space-y-2">
                    {currentContent.benefits.map((benefit, index) => <div key={index} className="flex items-center">
                        <ArrowRight className="h-4 w-4 text-green-400 mr-2" />
                        <span className="text-white/80 text-sm">{benefit}</span>
                      </div>)}
                  </div>
                </div>
              </div>

              {/* Visual */}
              <div className="glass-card p-8">
                <div className="aspect-square bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-lg flex items-center justify-center border border-green-500/20">
                  <div className="text-center">
                    {tabs.find(tab => tab.id === activeTab)?.icon && <>
                        {(() => {
                      const IconComponent = tabs.find(tab => tab.id === activeTab)?.icon;
                      return IconComponent ? <IconComponent className="h-20 w-20 text-green-400 mx-auto mb-4" /> : null;
                    })()}
                      </>}
                    <p className="text-white/60">Interactive Feature Demo</p>
                    <p className="text-green-400 text-sm mt-2">{currentContent.title}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="py-20 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-orbitron font-bold text-center mb-16 matrix-gradient-text">
            Everything You Need to Succeed
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Additional Features */}
            <div className="glass-card p-6 hover:scale-105 transition-transform duration-300">
              <Smartphone className="h-8 w-8 text-green-400 mb-4" />
              <h3 className="text-lg font-orbitron font-semibold text-white mb-3">Mobile Ready</h3>
              <p className="text-white/70 text-sm">
                Native mobile apps for iOS and Android. Manage your gym on the go.
              </p>
            </div>

            <div className="glass-card p-6 hover:scale-105 transition-transform duration-300">
              <Globe className="h-8 w-8 text-green-400 mb-4" />
              <h3 className="text-lg font-orbitron font-semibold text-white mb-3">Multi-Location</h3>
              <p className="text-white/70 text-sm">
                Scale across multiple locations with centralized management.
              </p>
            </div>

            <div className="glass-card p-6 hover:scale-105 transition-transform duration-300">
              <CreditCard className="h-8 w-8 text-green-400 mb-4" />
              <h3 className="text-lg font-orbitron font-semibold text-white mb-3">Payment Integration</h3>
              <p className="text-white/70 text-sm">
                Seamless payment processing with multiple gateway support.
              </p>
            </div>

            <div className="glass-card p-6 hover:scale-105 transition-transform duration-300">
              <Shield className="h-8 w-8 text-green-400 mb-4" />
              <h3 className="text-lg font-orbitron font-semibold text-white mb-3">Data Security</h3>
              <p className="text-white/70 text-sm">
                Bank-grade encryption and GDPR compliance for maximum security.
              </p>
            </div>

            <div className="glass-card p-6 hover:scale-105 transition-transform duration-300">
              <Clock className="h-8 w-8 text-green-400 mb-4" />
              <h3 className="text-lg font-orbitron font-semibold text-white mb-3">24/7 Support</h3>
              <p className="text-white/70 text-sm">
                Round-the-clock technical support and customer success team.
              </p>
            </div>

            <div className="glass-card p-6 hover:scale-105 transition-transform duration-300">
              <Zap className="h-8 w-8 text-green-400 mb-4" />
              <h3 className="text-lg font-orbitron font-semibold text-white mb-3">Lightning Fast</h3>
              <p className="text-white/70 text-sm">
                Optimized performance with sub-second response times.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-orbitron font-bold mb-6 matrix-gradient-text">
            Ready to Transform Your Gym?
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Join thousands of professionals who've revolutionized their operations with ScheduleFor.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="laser-border">
              <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-4 text-lg">
                <Link to="/get-started" onClick={handleCTAClick}>
                  Start Your Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            
            <Button asChild variant="outline" size="lg" className="border-green-500/30 text-green-400 hover:bg-green-500/10 px-8 py-4 text-lg">
              <Link to="/pricing" onClick={handleCTAClick}>
                View Pricing
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </MarketingLayout>;
};
export default Features;