import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Header from "@/components/layout/Header";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Staff from "@/pages/Staff";
import Settings from "@/pages/Settings";
import Reports from "@/pages/Reports";
import Payroll from "@/pages/Payroll";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-fitness-background">
          <Header />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/settings/*" element={<Settings />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/payroll" element={<Payroll />} />
          </Routes>
        </div>
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;