import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "@/index.css";
import App from "@/app/App";
import { QueryProvider } from "@/app/ui/query-provider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryProvider>
      <App />
    </QueryProvider>
  </StrictMode>,
);
