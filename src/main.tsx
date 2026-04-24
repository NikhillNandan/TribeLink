import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import App from "./app/App.tsx";
import { UserProvider } from "./contexts/UserContext.tsx";
import { Analytics } from "@vercel/analytics/react";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserProvider>
      <App />
      <Analytics />
    </UserProvider>
  </StrictMode>
);