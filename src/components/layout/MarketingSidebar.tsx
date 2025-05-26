import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Zap, DollarSign, Star, Play, Menu, X, Calendar, Users, BarChart3, Shield } from "lucide-react";

const MarketingSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsOpen(false);
  }, [location]);

  const handleNavClick = () => {
    setIsOpen(false);
    window.scrollTo(0, 0);
  };

  const navItems = [
    {
      icon: Home,
      label: "Home",
      path: "/home"
    },
    {
      icon: Zap,
      label: "Features",
      path: "/features"
    },
    {
      icon: DollarSign,
      label: "Pricing",
      path: "/pricing"
    },
    {
      icon: Star,
      label: "Testimonials",
      path: "/testimonials"
    },
    {
      icon: Play,
      label: "Get Started",
      path: "/get-started"
    }
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="glass text-white hover:bg-white/10"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-0 w-64 glass border-r border-white/10 z-40
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:h-full
        ${isOpen ? 'h-screen' : 'h-full'}
      `}>
        <div className="p-6 space-y-8 h-full overflow-y-auto">
          {/* Logo */}
          <Link to="/home" onClick={handleNavClick} className="block">
            <h1 className="text-2xl font-orbitron font-bold matrix-gradient-text">
              ScheduleFor
            </h1>
            <p className="text-xs text-green-400 matrix-font mt-1">STAFF MANAGEMENT SYSTEM</p>
          </Link>

          {/* Navigation */}
          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={handleNavClick}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                    ${isActive 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                    }
                  `}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Quick Stats */}
          <div className="glass-card p-4 space-y-3">
            <h3 className="text-sm font-orbitron font-semibold text-green-400">
              Platform Stats
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-white/60">Active Users</span>
                <span className="text-green-400">10,000+</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Businesses Managed</span>
                <span className="text-green-400">2,500+</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Schedules Created</span>
                <span className="text-green-400">1M+</span>
              </div>
            </div>
          </div>

          {/* Feature Icons */}
          <div className="space-y-3">
            <h4 className="text-xs font-orbitron font-semibold text-green-400 uppercase tracking-wider">
              Core Features
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="glass-card p-3 text-center">
                <Calendar className="h-6 w-6 text-green-400 mx-auto mb-1" />
                <p className="text-xs text-white/60">Scheduling</p>
              </div>
              <div className="glass-card p-3 text-center">
                <Users className="h-6 w-6 text-green-400 mx-auto mb-1" />
                <p className="text-xs text-white/60">Staff Mgmt</p>
              </div>
              <div className="glass-card p-3 text-center">
                <BarChart3 className="h-6 w-6 text-green-400 mx-auto mb-1" />
                <p className="text-xs text-white/60">Analytics</p>
              </div>
              <div className="glass-card p-3 text-center">
                <Shield className="h-6 w-6 text-green-400 mx-auto mb-1" />
                <p className="text-xs text-white/60">Security</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="laser-border">
            <Button asChild className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold">
              <Link to="/get-started" onClick={handleNavClick}>
                Start Free Trial
              </Link>
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default MarketingSidebar;
