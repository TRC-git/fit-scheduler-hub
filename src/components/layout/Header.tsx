import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const Header = () => {
  const { toggleSidebar } = useIsMobile();

  return (
    <header className="bg-fitness-card border-b border-fitness-border">
      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={toggleSidebar}
          >
            <Menu className="h-6 w-6 text-fitness-text" />
          </Button>
          <h1 className="text-xl font-semibold text-fitness-text">Dashboard</h1>
        </div>
        <Button variant="ghost" size="icon">
          <Bell className="h-6 w-6 text-fitness-text" />
        </Button>
      </div>
    </header>
  );
};

export default Header;