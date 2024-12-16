import { Bell, MessageSquare, Settings, Sun } from "lucide-react";
import { Avatar } from "../../ui/avatar";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-fitness-card border-b border-fitness-muted">
      <nav className="flex gap-4">
        <button className="px-4 py-2 rounded-md bg-[#15e7fb] text-white">
          Schedule
        </button>
        <button className="px-4 py-2 rounded-md hover:bg-fitness-muted text-fitness-text">
          Hrs/ Payroll
        </button>
        <button className="px-4 py-2 rounded-md hover:bg-fitness-muted text-fitness-text">
          Reports
        </button>
        <Link 
          to="/settings" 
          className="px-4 py-2 rounded-md hover:bg-fitness-muted text-fitness-text flex items-center gap-2"
        >
          <Settings className="w-4 h-4" />
          Settings
        </Link>
      </nav>
      <div className="flex items-center gap-6">
        <Sun className="w-5 h-5 text-fitness-text cursor-pointer" />
        <div className="flex items-center gap-4">
          <span className="text-fitness-text">Messages</span>
          <MessageSquare className="w-5 h-5 text-fitness-text" />
        </div>
        <Bell className="w-5 h-5 text-fitness-text" />
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8">
            <div className="w-full h-full bg-[#15e7fb] flex items-center justify-center text-white font-semibold">
              HG
            </div>
          </Avatar>
          <span className="text-fitness-text">Heath Graham</span>
        </div>
      </div>
    </header>
  );
};

export default Header;