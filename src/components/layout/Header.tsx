import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, BarChart, User, Calendar, Users, DollarSign, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserEmail(user?.email || null);
    };

    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-card border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-foreground text-xl font-bold font-['Cousine'] tracking-wider">
            ScheduleFor
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button 
                variant={isActive("/") ? "default" : "ghost"}
                className={isActive("/") ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}
              >
                <Calendar className="h-4 w-4 mr-0.5" />
                Schedule
              </Button>
            </Link>
            <Link to="/staff">
              <Button 
                variant={isActive("/staff") ? "default" : "ghost"}
                className={isActive("/staff") ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}
              >
                <Users className="h-4 w-4 mr-0.5" />
                Staff
              </Button>
            </Link>
            <Link to="/payroll">
              <Button 
                variant={isActive("/payroll") ? "default" : "ghost"}
                className={isActive("/payroll") ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}
              >
                <DollarSign className="h-4 w-4 mr-0.5" />
                Payroll/Hrs
              </Button>
            </Link>
            <Link to="/reports">
              <Button 
                variant={isActive("/reports") ? "default" : "ghost"}
                className={isActive("/reports") ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}
              >
                <BarChart className="h-4 w-4 mr-0.5" />
                Reports
              </Button>
            </Link>
            <Link to="/settings">
              <Button 
                variant={isActive("/settings") ? "default" : "ghost"}
                className={isActive("/settings") ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}
              >
                <Settings className="h-4 w-4 mr-0.5" />
                Settings
              </Button>
            </Link>
            
            {userEmail && (
              <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-md">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {userEmail.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-foreground">{userEmail}</span>
              </div>
            )}
            
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5 text-foreground" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;