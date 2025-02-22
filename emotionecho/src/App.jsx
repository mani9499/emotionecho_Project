import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Authenticate from "./components/Authenticate";
import Home from "./components/Home";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Authenticate/>}/>
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
