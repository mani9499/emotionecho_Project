import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Authenticate from "./components/Authenticate";
import Home from "./components/Home";
import About from "./components/About";
import Contact from "./components/Contact";
import "./App.css";

const ProtectedRoute = ({ element, setShowLoginAlert }) => {
  const isAuthenticated = localStorage.getItem("user");

  if (!isAuthenticated) {
    setShowLoginAlert(true);
    return <Navigate to="/" replace />;
  }

  return element;
};

function App() {
  const [showLoginAlert, setShowLoginAlert] = useState(false);

  useEffect(() => {
    if (showLoginAlert) {
      const timer = setTimeout(() => {
        setShowLoginAlert(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showLoginAlert]);

  return (
    <Router>
      {showLoginAlert && (
        <div className="login-alert">⚠️ Please login to continue.</div>
      )}
      <Routes>
        <Route path="/" element={<Authenticate />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute
              element={<Home />}
              setShowLoginAlert={setShowLoginAlert}
            />
          }
        />
        <Route
          path="/about"
          element={
            <ProtectedRoute
              element={<About />}
              setShowLoginAlert={setShowLoginAlert}
            />
          }
        />
        <Route
          path="/contact"
          element={
            <ProtectedRoute
              element={<Contact />}
              setShowLoginAlert={setShowLoginAlert}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
