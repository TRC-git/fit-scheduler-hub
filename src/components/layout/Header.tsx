import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <header className="bg-fitness-card border-b border-fitness-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-fitness-text text-xl font-bold font-['Cousine'] tracking-wider">
            ScheduleFor
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost">Schedule</Button>
            </Link>
            <Link to="/staff">
              <Button variant="ghost">Staff</Button>
            </Link>
            <Link to="/payroll">
              <Button variant="ghost">Payroll/Hrs</Button>
            </Link>
            <Link to="/reports">
              <Button variant="ghost">Reports</Button>
            </Link>
            <Link to="/settings">
              <Button variant="ghost">Settings</Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5 text-fitness-text" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;