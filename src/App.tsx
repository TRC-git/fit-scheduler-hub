import { BrowserRouter } from "react-router-dom";
import { PayPeriodProvider } from "./contexts/PayPeriodContext";
import Router from "./Router";

function App() {
  return (
    <PayPeriodProvider>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </PayPeriodProvider>
  );
}

export default App;