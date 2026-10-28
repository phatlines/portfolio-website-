import { createRoot } from "react-dom/client";
import "./styles/base.css";
import "./styles/site.css";
import "./styles/notfound.css";
import { NotFound } from "./pages/NotFound";

createRoot(document.getElementById("root")!).render(<NotFound />);
