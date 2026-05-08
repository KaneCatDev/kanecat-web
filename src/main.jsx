import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

/*
  Punto de entrada de la aplicación.
  React renderiza el componente principal App dentro del div con id "root".
*/

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);