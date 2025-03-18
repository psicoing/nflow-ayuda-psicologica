import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./translations"; // Asegurarse de que las traducciones se cargan antes que la app

createRoot(document.getElementById("root")!).render(<App />);