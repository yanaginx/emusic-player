import axios from "axios";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Dashboard from "./pages/Dashboard";
import Fer from "./pages/Fer";
import Login from "./pages/Login";

import Spinner from "./components/Spinner";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setUserAuth,
  refreshAuthToken,
  reset,
} from "./features/auth/authSlice";
import logo from "./logo.svg";

function App() {
  console.log("[DEBUG] App.js is also re rendered");
  const dispatch = useDispatch();

  const [auth, setAuth] = useState(null);

  useEffect(() => {
    axios.get("/api/auth/current-session").then((res) => {
      console.log("[DEBUG] data received from server: ", res.data);
      if (res.data.access_token) {
        console.log("[DEBUG] token fetched: ", res.data.access_token);
        console.log("[DEBUG] The time: ", Date.now() - res.data.iat);
        // Check if the token is expired
        if (Date.now() - res.data.iat < 3000 * 1000) {
          console.log("[DEBUG] token is still valid");
          setAuth(res.data.access_token);
          localStorage.setItem("access_token", res.data.access_token);
        } else {
          // refresh the token
          axios
            .get("/api/auth/refresh-token")
            .then((res) => {
              if (res.status === 200) {
                console.log("[DEBUG] token refreshed: ", res);
                // fetch the new token
                axios.get("/api/auth/current-session").then((res) => {
                  console.log("[DEBUG] data received from server: ", res.data);
                  if (res.data.access_token) {
                    console.log(
                      "[DEBUG] New token fetch: ",
                      res.data.access_token
                    );
                    setAuth(res.data.access_token);
                    localStorage.setItem("access_token", res.data.access_token);
                  }
                });
              }
            })
            .catch(() => {
              console.log("[DEBUG] token refresh failed");
            });
        }
      }
    });
  }, []);

  // call refresh token route every 50 minutes
  useEffect(() => {
    console.log("[DEBUG] REFRESHING TOKEN");
    if (auth) {
      const refreshTokenInterval = setInterval(() => {
        axios.get("/api/auth/refresh-token").then((res) => {
          console.log("[DEBUG] interval refresh: ", res);
          console.log(
            "[DEBUG] The interval refresh time: ",
            new Date().toString()
          );
          setAuth(res.data.access_token);
        });
      }, 1000 * 50 * 60);
      return () => {
        clearInterval(refreshTokenInterval);
      };
    }
  }, [auth]);

  if (auth) {
    console.log("[DEBUG] auth token on App: ", auth);
    return (
      <>
        <Router>
          <div className="container">
            <Routes>
              <Route path="/" element={<Dashboard auth={auth} />} />
              <Route path="/fer" element={<Fer auth={auth} />} />
            </Routes>
          </div>
        </Router>
        <ToastContainer />
      </>
    );
  }

  return <Login />;
}

export default App;
