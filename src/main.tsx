import { GooeyToaster } from "goey-toast";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "@/index.css";
import "goey-toast/styles.css";
import App from "@/app/App";
import { QueryProvider } from "@/app/ui/query-provider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GooeyToaster />
    <QueryProvider>
      <App />
    </QueryProvider>
  </StrictMode>,
);
