import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AuthProvider } from "@/context/AuthContext";

import Home from "@/pages/Home";
import About from "@/pages/About";
import Features from "@/pages/Features";
import Data from "@/pages/Data";
import Login from "@/pages/Login";
import Contact from "@/pages/Contact";

function NotFound() {
  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-24 grid grid-cols-12">
      <div className="col-span-12 md:col-span-1 font-mono-tech text-[11px] tracking-[0.22em] text-zinc-500">
        404
      </div>
      <div className="col-span-12 md:col-span-11">
        <p className="overline mb-6">Page not found</p>
        <h1 className="font-display font-black text-6xl md:text-8xl tracking-tighter">
          Off-grid.
        </h1>
        <p className="mt-6 text-zinc-600 max-w-md">
          The requested page is not in the archive. Use the navigation above.
        </p>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/features" element={<Features />} />
              <Route
                path="/data"
                element={
                  <ProtectedRoute>
                    <Data />
                  </ProtectedRoute>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
