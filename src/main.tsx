import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { OperationalDaysProvider } from "@/contexts/operational-days/OperationalDaysContext"

createRoot(document.getElementById("root")!).render(
  <OperationalDaysProvider>
    <App />
  </OperationalDaysProvider>
);