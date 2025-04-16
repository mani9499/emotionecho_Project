import React from "react";
import { jwtDecode } from "jwt-decode";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import "./Authenticate.css";
import logo from "../assets/image-removebg-preview.png";

const Authenticate = () => {
  const navigate = useNavigate();

  const clientId =
    "949646167306-bfa0j4anp1iond1bm6khp5k88tfeeju3.apps.googleusercontent.com";

  const handleSuccess = (response) => {
    console.log("OAuth Success:", response);
    const credential = response.credential;
    const userDetails = jwtDecode(credential);

    localStorage.setItem("user", JSON.stringify(userDetails));
    navigate("/home", { state: { user: userDetails } });
  };

  const handleFailure = (error) => {
    console.error("OAuth Error:", error);
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="auth-container">
        <img src={logo} alt="EmotionEcho Logo" className="animated-logo" />
        <h2 style={{ color: "black" }}>Welcome! Please Sign In</h2>
        <div className="google-signin">
          <GoogleLogin onSuccess={handleSuccess} onError={handleFailure} />
        </div>

        <div className="soundwave">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Authenticate;
