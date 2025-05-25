
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Star, ArrowRight, Play, Quote } from "lucide-react";
import MarketingLayout from "@/components/layout/MarketingLayout";

const Testimonials = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  const handleCTAClick = () => {
    window.scrollTo(0, 0);
  };

  const filters = [
    { id: "all", label: "All Stories" },
    { id: "small", label: "Small Studios" },
    { id: "chains", label: "Gym Chains" },
    { id: "personal", label: "Personal Trainers" },
    { id: "franchises", label: "Franchises" }
  ];

  const testimonials = [
    {
      id: 1,
      name: "Sarah Chen",
      role: "Owner",
      company: "FitZone Studios",
      category: "small",
      rating: 5,
      content: "ScheduleFor completely transformed how we operate. The scheduling conflicts that used to take hours to resolve are now prevented automatically. Our class attendance increased by 40% and our members love the seamless booking experience.",
      metrics: {
        increase: "40%",
        metric: "Class Attendance",
        timeframe: "3 months"
      },
      image: "/api/placeholder/80/80",
      featured: true
    },
    {
      id: 2,
      name: "Mike Rodriguez",
      role: "Operations Manager",
      company: "Elite Fitness Chain",
      category: "chains",
      rating: 5,
      content: "Managing 12 locations was a nightmare before ScheduleFor. Now everything is centralized and automated. We've reduced administrative overhead by 60% and can focus on what matters - our members.",
      metrics: {
        increase: "60%",
        metric: "Admin Efficiency",
        timeframe: "6 months"
      },
      image: "/api/placeholder/80/80",
      featured: true
    },
    {
      id: 3,
      name: "Jennifer Walsh",
      role: "Director",
      company: "Wellness Centers Network",
      category: "franchises",
      rating: 5,
      content: "The analytics and reporting features helped us optimize our class schedules and pricing. We identified peak hours, adjusted our offerings, and increased revenue by 25% in just 6 months.",
      metrics: {
        increase: "25%",
        metric: "Revenue Growth",
        timeframe: "6 months"
      },
      image: "/api/placeholder/80/80",
      featured: true
    },
    {
      id: 4,
      name: "David Kim",
      role: "Personal Trainer",
      company: "FitLife Coaching",
      category: "personal",
      rating: 5,
      content: "As a solo trainer, I needed something simple but powerful. ScheduleFor handles all my scheduling, payments, and client management. I've been able to take on 50% more clients without the administrative headache.",
      metrics: {
        increase: "50%",
        metric: "Client Capacity",
        timeframe: "4 months"
      },
      image: "/api/placeholder/80/80",
      featured: false
    },
    {
      id: 5,
      name: "Amanda Foster",
      role: "Studio Owner",
      company: "Zen Yoga Collective",
      category: "small",
      rating: 5,
      content: "The staff management features are incredible. Automatic payroll processing saved us 20 hours per month, and the performance tracking helps us support our instructors better.",
      metrics: {
        increase: "20hrs",
        metric: "Time Saved",
        timeframe: "monthly"
      },
      image: "/api/placeholder/80/80",
      featured: false
    },
    {
      id: 6,
      name: "Robert Thompson",
      role: "Franchise Owner",
      company: "PowerGym Franchise",
      category: "franchises",
      rating: 5,
      content: "Scaling from 3 to 15 locations would have been impossible without ScheduleFor. The multi-location management and real-time synchronization keep all our gyms running smoothly.",
      metrics: {
        increase: "400%",
        metric: "Location Growth",
        timeframe: "2 years"
      },
      image: "/api/placeholder/80/80",
      featured: false
    }
  ];

  const videoTestimonials = [
    {
      name: "Carlos Mendez",
      role: "CrossFit Box Owner",
      company: "Iron Warriors CrossFit",
      thumbnail: "/api/placeholder/300/200",
      duration: "2:45"
    },
    {
      name: "Lisa Park",
      role: "Pilates Studio Chain",
      company: "Pure Pilates Studios",
      thumbnail: "/api/placeholder/300/200",
      duration: "3:12"
    },
    {
      name: "Tom Williams",
      role: "Martial Arts Academy",
      company: "Dragon Combat Sports",
      thumbnail: "/api/placeholder/300/200",
      duration: "4:01"
    }
  ];

  const filteredTestimonials = activeFilter === "all" 
    ? testimonials 
    : testimonials.filter(t => t.category === activeFilter);

  return (
    <MarketingLayout>
      {/* Hero Section */}
      <section className="pt-20 pb-12 px-4 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-orbitron font-bold mb-6 matrix-gradient-text">
            Success Stories
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
            Discover how fitness professionals worldwide are transforming their businesses with ScheduleFor.
          </p>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <div className="glass-card px-6 py-4">
              <div className="text-2xl font-orbitron font-bold text-green-400">2,500+</div>
              <div className="text-white/60 text-sm">Happy Customers</div>
            </div>
            <div className="glass-card px-6 py-4">
              <div className="text-2xl font-orbitron font-bold text-green-400">4.9★</div>
              <div className="text-white/60 text-sm">Average Rating</div>
            </div>
            <div className="glass-card px-6 py-4">
              <div className="text-2xl font-orbitron font-bold text-green-400">98%</div>
              <div className="text-white/60 text-sm">Would Recommend</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="pb-8 px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`
                  px-6 py-3 rounded-lg transition-all duration-200 font-medium
                  ${activeFilter === filter.id 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                    : 'glass-card text-white/70 hover:text-white hover:bg-white/5'
                  }
                `}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Testimonials */}
      <section className="pb-12 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {filteredTestimonials.filter(t => t.featured).map((testimonial) => (
              <div key={testimonial.id} className="glass-card p-8 hover:scale-105 transition-transform duration-300">
                <div className="flex items-center mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <Quote className="h-8 w-8 text-green-400 mb-4" />
                
                <p className="text-white/80 mb-6 italic leading-relaxed">
                  "{testimonial.content}"
                </p>
                
                {/* Metrics */}
                <div className="glass-card p-4 mb-6 border-green-500/20">
                  <div className="text-center">
                    <div className="text-2xl font-orbitron font-bold text-green-400">
                      {testimonial.metrics.increase}
                    </div>
                    <div className="text-white/70 text-sm">{testimonial.metrics.metric}</div>
                    <div className="text-white/50 text-xs">in {testimonial.metrics.timeframe}</div>
                  </div>
                </div>
                
                {/* Author */}
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-semibold">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="text-white font-semibold">{testimonial.name}</div>
                    <div className="text-green-400 text-sm">{testimonial.role}</div>
                    <div className="text-white/60 text-xs">{testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Regular Testimonials Grid */}
      <section className="pb-20 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredTestimonials.filter(t => !t.featured).map((testimonial) => (
              <div key={testimonial.id} className="glass-card p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                  <div className="ml-auto glass-card px-3 py-1">
                    <span className="text-green-400 text-sm font-semibold">
                      {testimonial.metrics.increase}
                    </span>
                    <span className="text-white/60 text-xs ml-1">
                      {testimonial.metrics.metric}
                    </span>
                  </div>
                </div>
                
                <p className="text-white/80 mb-4 italic">
                  "{testimonial.content}"
                </p>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-semibold text-sm">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">{testimonial.name}</div>
                    <div className="text-green-400 text-xs">{testimonial.role}</div>
                    <div className="text-white/60 text-xs">{testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Testimonials */}
      <section className="py-20 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-orbitron font-bold text-center mb-12 matrix-gradient-text">
            Video Success Stories
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {videoTestimonials.map((video, index) => (
              <div key={index} className="glass-card overflow-hidden hover:scale-105 transition-transform duration-300">
                <div className="relative">
                  <div className="aspect-video bg-gradient-to-br from-green-900/30 to-emerald-900/30 flex items-center justify-center">
                    <Play className="h-12 w-12 text-green-400" />
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-white font-semibold mb-1">{video.name}</h3>
                  <p className="text-green-400 text-sm">{video.role}</p>
                  <p className="text-white/60 text-xs">{video.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Metrics */}
      <section className="py-20 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-orbitron font-bold text-center mb-12 matrix-gradient-text">
            Proven Results Across the Industry
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="glass-card p-6 text-center">
              <div className="text-3xl font-orbitron font-bold text-green-400 mb-2">35%</div>
              <div className="text-white/70 text-sm">Average Revenue Increase</div>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="text-3xl font-orbitron font-bold text-green-400 mb-2">50%</div>
              <div className="text-white/70 text-sm">Time Savings on Admin</div>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="text-3xl font-orbitron font-bold text-green-400 mb-2">40%</div>
              <div className="text-white/70 text-sm">Increase in Member Retention</div>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="text-3xl font-orbitron font-bold text-green-400 mb-2">95%</div>
              <div className="text-white/70 text-sm">Reduction in Scheduling Conflicts</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-orbitron font-bold mb-6 matrix-gradient-text">
            Ready to Write Your Success Story?
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Join thousands of fitness professionals who've transformed their businesses with ScheduleFor.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="laser-border">
              <Button 
                asChild 
                size="lg" 
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-4 text-lg"
              >
                <Link to="/get-started" onClick={handleCTAClick}>
                  Start Your Success Story
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            
            <Button 
              asChild 
              variant="outline" 
              size="lg" 
              className="border-green-500/30 text-green-400 hover:bg-green-500/10 px-8 py-4 text-lg"
            >
              <Link to="/pricing" onClick={handleCTAClick}>
                View Pricing
              </Link>
            </Button>
          </div>
          
          <p className="text-white/60 text-sm mt-6">
            14-day free trial • No credit card required • Cancel anytime
          </p>
        </div>
      </section>
    </MarketingLayout>
  );
};

export default Testimonials;
