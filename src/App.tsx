
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { useState } from "react";
import Router from "./Router";
import "./App.css";

function App() {
  // Create a new QueryClient instance for each app render
  // This ensures the client is fresh each time and prevents stale state issues
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
        // Add staleTime to prevent unnecessary refetches
        staleTime: 1000 * 30, // 30 seconds
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
