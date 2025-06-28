
import {Routes, Route, BrowserRouter } from "react-router-dom";
import URLForm from "./Components/URLForm";
import RedirectHandler from "./Components/RedirectHandler";
export default function App() {
  return (
    // <URLForm />
       <Routes>
           <Route path="/" element={<URLForm />} />
           <Route path="/:shortId" element={<RedirectHandler />} />
           <Route path="/contact" element={<h1>hiiii</h1>} />
       </Routes>
  );
}