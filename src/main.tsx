import { createRoot } from "react-dom/client";
import "./styles/base.css";
import "./styles/site.css";
import { App } from "./App";

createRoot(document.getElementById("root")!).render(<App />);
