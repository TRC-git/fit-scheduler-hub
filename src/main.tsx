import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom"
import App from './App.tsx'
import './index.css'
import { OperationalDaysProvider } from "@/contexts/operational-days/OperationalDaysContext"

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <OperationalDaysProvider>
      <App />
    </OperationalDaysProvider>
  </BrowserRouter>
);