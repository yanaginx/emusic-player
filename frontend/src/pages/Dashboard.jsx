import axios from "axios";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import { Button, Row, Col } from "react-bootstrap";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setUserAuth,
  refreshAuthToken,
  reset,
} from "../features/auth/authSlice";

function Dashboard({ auth }) {
  // console.log("[DEBUG] auth can be seen from DASHBOARD: ", auth);

  // // DEBUG
  // useEffect(() => {
  //   console.log("[DEBUG] REFRESHING TOKEN");
  //   if (auth) {
  //     const seeInterval = setInterval(() => {
  //       console.log("[DEBUG] auth from Dashboard: ", auth);
  //     }, 1000 * 50 * 60);
  //     return () => {
  //       clearInterval(seeInterval);
  //     };
  //   }
  // }, [auth]);
  // // END : DEBUG

  const navigate = useNavigate();
  const onFER = () => {
    navigate("/fer");
  };
  const onSearch = () => {
    navigate("/search");
  };

  return (
    <>
      <section className="heading">
        <h1>WELCOME</h1>
        <p>To Emusic</p>
      </section>
      <Row style={{ height: "100%" }}>
        <Col>
          <Button onClick={onFER}>Emotion detect</Button>
        </Col>
        <Col>
          <Button onClick={onSearch}>Search</Button>
        </Col>
      </Row>
      {/* <Row>
        {auth ? (
          <a href="/api/auth/logout">
            <button className="btn">LOGOUT SPOTIFY</button>
          </a>
        ) : (
          <h3>You have not login yet</h3>
        )}
      </Row> */}
      {/* <a href={"/api/auth/login"}>
          <button className="btn">Login</button>
        </a> */}
    </>
  );
}

export default Dashboard;
