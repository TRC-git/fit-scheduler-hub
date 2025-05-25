
import React from "react";
import { Link } from "react-router-dom";
import { ArrowUp, Github, Linkedin, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative z-10 border-t border-white/10 mt-12">
      <div className="glass-card backdrop-blur-md mt-1">
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Top section with scroll to top button */}
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-xl font-orbitron font-bold matrix-gradient-text">
                ScheduleFor
              </h2>
              <p className="text-xs text-green-400 matrix-font mt-1">
                FITNESS MANAGEMENT SYSTEM
              </p>
            </div>
            <Button
              onClick={scrollToTop}
              variant="ghost"
              size="icon"
              className="rounded-full bg-white/5 hover:bg-green-500/20 border border-green-500/20"
              aria-label="Scroll to top"
            >
              <ArrowUp className="h-5 w-5 text-green-400" />
            </Button>
          </div>

          {/* Footer links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="text-sm font-orbitron font-semibold text-green-400 mb-4">Product</h3>
              <ul className="space-y-3">
                <li><Link to="/features" className="text-white/70 hover:text-green-400 text-sm">Features</Link></li>
                <li><Link to="/pricing" className="text-white/70 hover:text-green-400 text-sm">Pricing</Link></li>
                <li><Link to="/testimonials" className="text-white/70 hover:text-green-400 text-sm">Testimonials</Link></li>
                <li><Link to="/get-started" className="text-white/70 hover:text-green-400 text-sm">Get Started</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-orbitron font-semibold text-green-400 mb-4">Company</h3>
              <ul className="space-y-3">
                <li><Link to="/home" className="text-white/70 hover:text-green-400 text-sm">About Us</Link></li>
                <li><Link to="/home" className="text-white/70 hover:text-green-400 text-sm">Careers</Link></li>
                <li><Link to="/home" className="text-white/70 hover:text-green-400 text-sm">Blog</Link></li>
                <li><Link to="/home" className="text-white/70 hover:text-green-400 text-sm">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-orbitron font-semibold text-green-400 mb-4">Support</h3>
              <ul className="space-y-3">
                <li><Link to="/home" className="text-white/70 hover:text-green-400 text-sm">Documentation</Link></li>
                <li><Link to="/home" className="text-white/70 hover:text-green-400 text-sm">Help Center</Link></li>
                <li><Link to="/home" className="text-white/70 hover:text-green-400 text-sm">API Reference</Link></li>
                <li><Link to="/home" className="text-white/70 hover:text-green-400 text-sm">System Status</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-orbitron font-semibold text-green-400 mb-4">Legal</h3>
              <ul className="space-y-3">
                <li><Link to="/home" className="text-white/70 hover:text-green-400 text-sm">Privacy Policy</Link></li>
                <li><Link to="/home" className="text-white/70 hover:text-green-400 text-sm">Terms of Service</Link></li>
                <li><Link to="/home" className="text-white/70 hover:text-green-400 text-sm">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom section */}
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/60 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} ScheduleFor. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white/60 hover:text-green-400">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-white/60 hover:text-green-400">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a href="#" className="text-white/60 hover:text-green-400">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
