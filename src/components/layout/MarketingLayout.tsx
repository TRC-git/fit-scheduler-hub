
import { ReactNode } from "react";
import MarketingSidebar from "./MarketingSidebar";
import Footer from "./Footer";

interface MarketingLayoutProps {
  children: ReactNode;
}

const MarketingLayout = ({ children }: MarketingLayoutProps) => {
  return (
    <div className="min-h-screen spotlight-bg">
      <div className="matrix-rain" />
      <MarketingSidebar />
      <main className="md:ml-64 min-h-screen">
        {children}
        <Footer />
      </main>
    </div>
  );
};

export default MarketingLayout;
