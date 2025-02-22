import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import "./Authenticate.css";

const Authenticate = () => {
  const [action, setAction] = useState("Sign Up");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const clientId =
    "949646167306-bfa0j4anp1iond1bm6khp5k88tfeeju3.apps.googleusercontent.com";

  const handleSuccess = (response) => {
    console.log("OAuth Success:", response);
    setLoading(false);
    const credential = response.credential;
    const userDetails = jwtDecode(credential);
    localStorage.setItem("user", JSON.stringify(userDetails));
    navigate("/home", { state: { user: userDetails } });
  };

  const handleFailure = (error) => {
    console.error("OAuth Error:", error);
    setLoading(false);
  };

  const handleSubmit = () => {
    if (action === "Sign Up") {
      console.log("Sign Up with:", { username, email, password });
    } else {
      console.log("Login with:", { email, password });
    }
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="container">
        <div className="header">
          <div className="text">{action}</div>
          <div className="underline"></div>
          <div className="inputs">
            <div className="google-signin">
              <GoogleLogin onSuccess={handleSuccess} onError={handleFailure} />
            </div>
            <center>Or</center>
            {action === "Sign Up" && (
              <div className="input">
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            )}
            <div className="input">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="submit-container">
            <div className="submit" onClick={handleSubmit}>
              {loading ? "Processing..." : action}
            </div>
            <div
              className="toggle"
              onClick={() => {
                if (action === "Sign Up") {
                  setAction("Login");
                } else {
                  setAction("Sign Up");
                }
              }}
            >
              {action === "Sign Up"
                ? "Already have an account? Login"
                : "Don't have an account? Sign Up"}
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Authenticate;
