import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ClerkProvider } from "@clerk/react";

const keyprovider = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!keyprovider) {
  console.error(
    "Missing VITE_CLERK_PUBLISHABLE_KEY in environment variables. Please restart the dev server."
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProvider publishableKey={keyprovider || ""}>
      <App />
    </ClerkProvider>
  </StrictMode>,
);
