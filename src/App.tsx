import { BrowserRouter } from "react-router-dom";
import { PayPeriodProvider } from "./contexts/PayPeriodContext";
import Router from "./Router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PayPeriodProvider>
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </PayPeriodProvider>
    </QueryClientProvider>
  );
}

export default App;