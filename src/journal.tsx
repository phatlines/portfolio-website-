import { createRoot } from "react-dom/client";
import "./styles/base.css";
import "./styles/site.css";
import "./styles/journal.css";
import { Journal } from "./pages/Journal";

createRoot(document.getElementById("root")!).render(<Journal />);
