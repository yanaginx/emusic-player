import axios from "axios";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setUserAuth,
  refreshAuthToken,
  reset,
} from "../features/auth/authSlice";

function Dashboard({ auth }) {
  console.log("[DEBUG] auth can be seen from DASHBOARD: ", auth);

  // DEBUG
  useEffect(() => {
    console.log("[DEBUG] REFRESHING TOKEN");
    if (auth) {
      const seeInterval = setInterval(() => {
        console.log("[DEBUG] auth from Dashboard: ", auth);
      }, 1000 * 10);
      return () => {
        clearInterval(seeInterval);
      };
    }
  }, [auth]);
  // END : DEBUG

  const navigate = useNavigate();
  const onFER = () => {
    navigate("/fer");
  };

  return (
    <>
      <section className="heading">
        <h1>Frontend to use API</h1>
        <p>Main menu</p>
      </section>
      <div className="content">
        {/* <a href={"/api/auth/login"}>
          <button className="btn">Login</button>
        </a> */}
        <button className="btn" onClick={onFER}>
          Emotion detect
        </button>
      </div>
      {auth ? (
        <a href="/api/auth/logout">LOGOUT SPOTIFY</a>
      ) : (
        <h3>You have not login yet</h3>
      )}
    </>
  );
}

export default Dashboard;
