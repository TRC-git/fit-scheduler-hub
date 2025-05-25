
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle, ArrowRight, Star, Zap, Crown } from "lucide-react";
import MarketingLayout from "@/components/layout/MarketingLayout";

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState("monthly");

  const handleCTAClick = () => {
    window.scrollTo(0, 0);
  };

  const plans = [
    {
      name: "Starter",
      description: "Perfect for small gyms and studios",
      monthlyPrice: 49,
      yearlyPrice: 39,
      icon: Zap,
      features: [
        "Up to 50 active members",
        "Basic scheduling system",
        "Staff management (3 staff)",
        "Basic reporting",
        "Email support",
        "Mobile app access",
        "Class booking system",
        "Basic payment processing"
      ],
      popular: false,
      cta: "Start Free Trial"
    },
    {
      name: "Professional",
      description: "For growing fitness businesses",
      monthlyPrice: 99,
      yearlyPrice: 79,
      icon: Star,
      features: [
        "Up to 500 active members",
        "Advanced scheduling with AI",
        "Unlimited staff accounts",
        "Advanced analytics & reports",
        "Priority phone & chat support",
        "Custom branding",
        "Advanced payment features",
        "Marketing automation",
        "Multi-location support (up to 3)",
        "API access"
      ],
      popular: true,
      cta: "Start Free Trial"
    },
    {
      name: "Enterprise",
      description: "For large chains and franchises",
      monthlyPrice: 199,
      yearlyPrice: 159,
      icon: Crown,
      features: [
        "Unlimited members",
        "Full AI-powered automation",
        "White-label solutions",
        "Enterprise-grade security",
        "24/7 dedicated support",
        "Custom integrations",
        "Advanced user permissions",
        "Unlimited locations",
        "Custom reporting & dashboards",
        "Dedicated account manager",
        "Training & onboarding",
        "SLA guarantee"
      ],
      popular: false,
      cta: "Contact Sales"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Owner, FitZone Studios",
      content: "ScheduleFor transformed our operations. We've seen a 40% increase in class attendance and our staff love how easy it is to use.",
      rating: 5,
      image: "/api/placeholder/64/64"
    },
    {
      name: "Mike Rodriguez",
      role: "Manager, Elite Fitness Chain",
      content: "Managing 12 locations was a nightmare before ScheduleFor. Now everything is centralized and automated. Best investment we've made.",
      rating: 5,
      image: "/api/placeholder/64/64"
    },
    {
      name: "Jennifer Walsh",
      role: "Director, Wellness Centers",
      content: "The analytics and reporting features helped us optimize our class schedules and increase revenue by 25% in just 6 months.",
      rating: 5,
      image: "/api/placeholder/64/64"
    }
  ];

  return (
    <MarketingLayout>
      {/* Hero Section */}
      <section className="pt-20 pb-12 px-4 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-orbitron font-bold mb-6 matrix-gradient-text">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
            Choose the perfect plan for your fitness business. All plans include a 14-day free trial.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center mb-12">
            <div className="glass-card p-2 flex rounded-lg">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-6 py-2 rounded-md transition-all duration-200 ${
                  billingCycle === "monthly"
                    ? "bg-green-600 text-white"
                    : "text-white/70 hover:text-white"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`px-6 py-2 rounded-md transition-all duration-200 ${
                  billingCycle === "yearly"
                    ? "bg-green-600 text-white"
                    : "text-white/70 hover:text-white"
                }`}
              >
                Yearly
                <span className="ml-2 text-xs bg-green-400 text-black px-2 py-1 rounded">
                  Save 20%
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={plan.name}
                className={`
                  glass-card p-8 relative hover:scale-105 transition-transform duration-300
                  ${plan.popular ? 'border-green-500/50 ring-2 ring-green-500/20' : ''}
                `}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <plan.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-orbitron font-bold text-white mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-white/60 mb-6">{plan.description}</p>
                  
                  <div className="mb-6">
                    <span className="text-4xl font-orbitron font-bold text-green-400">
                      ${billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice}
                    </span>
                    <span className="text-white/60 ml-2">
                      /{billingCycle === "monthly" ? "month" : "month (billed yearly)"}
                    </span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-white/70 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className={plan.popular ? "laser-border" : ""}>
                  <Button 
                    asChild 
                    className={`
                      w-full font-semibold
                      ${plan.popular 
                        ? 'bg-green-600 hover:bg-green-700 text-white' 
                        : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                      }
                    `}
                  >
                    <Link to="/get-started" onClick={handleCTAClick}>
                      {plan.cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons */}
      <section className="py-20 px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-orbitron font-bold text-center mb-12 matrix-gradient-text">
            Optional Add-ons
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6">
              <h3 className="text-xl font-orbitron font-semibold text-white mb-2">
                Premium Support
              </h3>
              <p className="text-white/70 mb-4">
                24/7 phone support with dedicated account manager
              </p>
              <div className="text-green-400 font-semibold">$99/month</div>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-xl font-orbitron font-semibold text-white mb-2">
                Custom Integrations
              </h3>
              <p className="text-white/70 mb-4">
                Bespoke API integrations and custom development
              </p>
              <div className="text-green-400 font-semibold">Contact for quote</div>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-xl font-orbitron font-semibold text-white mb-2">
                Advanced Analytics
              </h3>
              <p className="text-white/70 mb-4">
                AI-powered insights and predictive analytics
              </p>
              <div className="text-green-400 font-semibold">$49/month</div>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-xl font-orbitron font-semibold text-white mb-2">
                White Label
              </h3>
              <p className="text-white/70 mb-4">
                Complete white-label solution with your branding
              </p>
              <div className="text-green-400 font-semibold">$199/month</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-orbitron font-bold text-center mb-12 matrix-gradient-text">
            What Our Customers Say
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="glass-card p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-white/80 mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-semibold text-sm">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">{testimonial.name}</div>
                    <div className="text-white/60 text-xs">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-orbitron font-bold text-center mb-12 matrix-gradient-text">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                Can I change plans anytime?
              </h3>
              <p className="text-white/70">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing differences.
              </p>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                Is there a setup fee?
              </h3>
              <p className="text-white/70">
                No setup fees for any plan. We provide free onboarding and training to get you started quickly.
              </p>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-white/70">
                We accept all major credit cards (Visa, MasterCard, Amex) and bank transfers for annual plans.
              </p>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                Can I cancel anytime?
              </h3>
              <p className="text-white/70">
                Yes, you can cancel your subscription at any time. No long-term contracts or cancellation fees.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-orbitron font-bold mb-6 matrix-gradient-text">
            Ready to Revolutionize Your Gym?
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Join thousands of fitness professionals who trust ScheduleFor. Start your free trial today.
          </p>
          
          <div className="laser-border inline-block">
            <Button 
              asChild 
              size="lg" 
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-12 py-4 text-lg"
            >
              <Link to="/get-started" onClick={handleCTAClick}>
                Start Your 14-Day Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
          
          <p className="text-white/60 text-sm mt-4">
            No credit card required • Cancel anytime • Full access to all features
          </p>
        </div>
      </section>
    </MarketingLayout>
  );
};

export default Pricing;
