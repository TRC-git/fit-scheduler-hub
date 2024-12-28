import { BrowserRouter as Router } from "react-router-dom";
import { PayPeriodProvider } from "./contexts/PayPeriodContext";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

function App() {
  return (
    <PayPeriodProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Router>
    </PayPeriodProvider>
  );
}

export default App;
