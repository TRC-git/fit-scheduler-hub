
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Calendar, 
  Users, 
  Clock, 
  BarChart3, 
  Shield, 
  Zap,
  CheckCircle,
  XCircle
} from "lucide-react";
import MarketingLayout from "@/components/layout/MarketingLayout";

const Home = () => {
  const handleCTAClick = () => {
    window.scrollTo(0, 0);
  };

  return (
    <MarketingLayout>
      {/* Hero Section */}
      <section className="pt-20 pb-20 px-4 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-orbitron font-bold mb-6 matrix-gradient-text">
            Master Your Fitness Empire
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-4xl mx-auto leading-relaxed">
            The ultimate scheduling and management platform built for fitness professionals. 
            Streamline operations, boost efficiency, and scale your business with enterprise-grade tools.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <div className="laser-border">
              <Button 
                asChild 
                size="lg" 
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-4 text-lg"
              >
                <Link to="/get-started" onClick={handleCTAClick}>
                  Start Your Free Trial
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
              <Link to="/features" onClick={handleCTAClick}>
                Explore Features
              </Link>
            </Button>
          </div>

          {/* Product Demo */}
          <div className="glass-card p-8 max-w-5xl mx-auto">
            <div className="aspect-video bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-lg flex items-center justify-center border border-green-500/20">
              <div className="text-center">
                <BarChart3 className="h-16 w-16 text-green-400 mx-auto mb-4" />
                <p className="text-white/60 text-lg">Live Platform Demo</p>
                <p className="text-green-400 text-sm mt-2">Real-time scheduling interface</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Benefits */}
      <section className="py-20 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-orbitron font-bold text-center mb-16 matrix-gradient-text">
            Why Fitness Pros Choose ScheduleFor
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Benefit 1 */}
            <div className="glass-card p-8 hover:scale-105 transition-transform duration-300">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-6">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-orbitron font-semibold text-white mb-4">
                Smart Scheduling Engine
              </h3>
              <p className="text-white/70">
                AI-powered scheduling that automatically optimizes class times, prevents conflicts, and maximizes gym utilization.
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="glass-card p-8 hover:scale-105 transition-transform duration-300">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-6">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-orbitron font-semibold text-white mb-4">
                Complete Staff Management
              </h3>
              <p className="text-white/70">
                Manage trainer schedules, track certifications, monitor performance, and streamline payroll processing.
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="glass-card p-8 hover:scale-105 transition-transform duration-300">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-6">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-orbitron font-semibold text-white mb-4">
                Real-Time Operations
              </h3>
              <p className="text-white/70">
                Live updates, instant notifications, and real-time reporting keep your entire team synchronized.
              </p>
            </div>

            {/* Benefit 4 */}
            <div className="glass-card p-8 hover:scale-105 transition-transform duration-300">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-6">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-orbitron font-semibold text-white mb-4">
                Advanced Analytics
              </h3>
              <p className="text-white/70">
                Deep insights into member engagement, revenue optimization, and operational efficiency metrics.
              </p>
            </div>

            {/* Benefit 5 */}
            <div className="glass-card p-8 hover:scale-105 transition-transform duration-300">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-6">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-orbitron font-semibold text-white mb-4">
                Enterprise Security
              </h3>
              <p className="text-white/70">
                Bank-grade security, compliance ready, with advanced user permissions and data protection.
              </p>
            </div>

            {/* Benefit 6 */}
            <div className="glass-card p-8 hover:scale-105 transition-transform duration-300">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-6">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-orbitron font-semibold text-white mb-4">
                Lightning Fast Setup
              </h3>
              <p className="text-white/70">
                Get up and running in minutes with our intuitive setup wizard and pre-built templates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem/Solution */}
      <section className="py-20 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-orbitron font-bold text-center mb-16 matrix-gradient-text">
            Before vs After ScheduleFor
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Before */}
            <div className="glass-card p-8 border-red-500/20">
              <div className="flex items-center mb-6">
                <XCircle className="h-6 w-6 text-red-400 mr-3" />
                <h3 className="text-xl font-orbitron font-semibold text-red-400">
                  Without ScheduleFor
                </h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-red-400 mr-3">•</span>
                  <span className="text-white/70">Manual scheduling chaos and double bookings</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-3">•</span>
                  <span className="text-white/70">Scattered tools for different operations</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-3">•</span>
                  <span className="text-white/70">No real-time visibility into gym operations</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-3">•</span>
                  <span className="text-white/70">Time-consuming payroll and reporting</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-3">•</span>
                  <span className="text-white/70">Limited scalability and growth potential</span>
                </li>
              </ul>
            </div>

            {/* After */}
            <div className="glass-card p-8 border-green-500/20">
              <div className="flex items-center mb-6">
                <CheckCircle className="h-6 w-6 text-green-400 mr-3" />
                <h3 className="text-xl font-orbitron font-semibold text-green-400">
                  With ScheduleFor
                </h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-green-400 mr-3">•</span>
                  <span className="text-white/70">Automated scheduling with conflict prevention</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-3">•</span>
                  <span className="text-white/70">Unified platform for all operations</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-3">•</span>
                  <span className="text-white/70">Real-time dashboard and live updates</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-3">•</span>
                  <span className="text-white/70">Automated payroll and instant reports</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-3">•</span>
                  <span className="text-white/70">Unlimited scalability and growth support</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-20 px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-orbitron font-bold mb-8 matrix-gradient-text">
            Trusted by 2,500+ Fitness Professionals
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="glass-card p-6 text-center">
              <div className="text-2xl font-orbitron font-bold text-green-400">10,000+</div>
              <div className="text-white/60 text-sm">Active Users</div>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="text-2xl font-orbitron font-bold text-green-400">2,500+</div>
              <div className="text-white/60 text-sm">Gyms Managed</div>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="text-2xl font-orbitron font-bold text-green-400">1M+</div>
              <div className="text-white/60 text-sm">Classes Scheduled</div>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="text-2xl font-orbitron font-bold text-green-400">99.9%</div>
              <div className="text-white/60 text-sm">Uptime</div>
            </div>
          </div>

          <div className="laser-border inline-block">
            <Button 
              asChild 
              size="lg" 
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-12 py-4 text-lg"
            >
              <Link to="/get-started" onClick={handleCTAClick}>
                Join The Elite Network
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
};

export default Home;
