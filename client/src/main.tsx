import { createRoot } from "react-dom/client";
import "./translations"; // Cargar traducciones antes que la app
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);