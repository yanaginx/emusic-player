import axios from "axios";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Container, Row, Col, Tab, Nav } from "react-bootstrap";

import SpotifyWebApi from "spotify-web-api-node";
import "react-toastify/dist/ReactToastify.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./styles/App.css";
import Dashboard from "./pages/Dashboard";
import Fer from "./pages/Fer";
import Login from "./pages/Login";
import Search from "./pages/Search";
import MyPlaylist from "./pages/MyPlaylist";

import Spinner from "./components/Spinner";
import Player from "./components/Player";
import Sidebar from "./components/Sidebar";
import SpotifyPlayer from "./components/SpotifyPlayer";
import CreateEmoPlaylist from "./pages/CreateEmoPlaylist";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setAccessToken,
  setUserAuth,
  refreshAuthToken,
  reset,
} from "./features/auth/authSlice";
import logo from "./logo.svg";

// const spotifyApi = new SpotifyWebApi({
//   clientId: process.env.SPOTIFY_CLIENT_ID,
// });

function App() {
  // console.log("[DEBUG] App.js is also re rendered");
  const dispatch = useDispatch();

  const [auth, setAuth] = useState(null);
  const [playingTrack, setPlayingTrack] = useState();
  const { tracks } = useSelector((state) => state.track);
  const { user_auth } = useSelector((state) => state.auth);

  useEffect(() => {
    axios.get("/api/auth/access-token").then((res) => {
      // console.log("[DEBUG] data received from server: ", res.data);
      if (res.data.access_token) {
        console.log("[DEBUG] token fetched: ", res.data.access_token);
        console.log("[DEBUG] The time: ", Date.now() - res.data.iat);
        // Check if the token is expired
        if (Date.now() - res.data.iat < 3000 * 1000) {
          console.log("[DEBUG] token is still valid");
          dispatch(setAccessToken(res.data.access_token));
        } else {
          // refresh the token
          axios
            .get("/api/auth/refresh-token")
            .then((res) => {
              if (res.status === 200) {
                console.log("[DEBUG] token refreshed: ", res);
                dispatch(setAccessToken(res.data.access_token));
              }
            })
            .catch(() => {
              console.log("[DEBUG] token refresh failed");
            });
        }
      }
    });
  }, [dispatch]);

  if (user_auth) {
    // console.log("[DEBUG] user_auth in state: ", user_auth);
    // const auth = user_auth.access_token;
    // console.log("[DEBUG] auth token on App: ", auth);
    return (
      <>
        {/* <Tab.Container id="left-tabs-example"> */}
        <Router>
          <Container style={{ height: "100vh" }}>
            <Row style={{ height: "80%" }}>
              <Col sm={3} style={{ height: "100%" }}>
                <Sidebar />
              </Col>
              <Col sm={9} style={{ height: "100%" }}>
                <Routes>
                  <Route path="/" element={<Dashboard auth={auth} />} />
                  <Route path="/fer" element={<Fer auth={auth} />} />
                  <Route path="/search" element={<Search auth={auth} />} />
                  <Route
                    path="/my-playlist"
                    element={<MyPlaylist auth={auth} />}
                  />
                  <Route
                    path="/create-playlist/:mood"
                    element={<CreateEmoPlaylist />}
                  />
                </Routes>
              </Col>
            </Row>
            <Row className="fixed-bottom">
              <div>
                {/* <Player
                  key={user_auth}
                  accessToken={auth}
                  trackUris={tracks[0]}
                /> */}
                <SpotifyPlayer token={user_auth} />
              </div>
            </Row>
          </Container>
        </Router>
        {/* </Tab.Container> */}
        {/* <Router>
          <Row className="d-flex flex-column">
            <Col xs={2} className="flex-grow-1 fixed-top">
              <Sidebar />
            </Col>
            <Col xs={10} className="offset-2">
              <Routes>
                <Route path="/" element={<Dashboard auth={auth} />} />
                <Route path="/fer" element={<Fer auth={auth} />} />
                <Route path="/search" element={<Search auth={auth} />} />
                <Route
                  path="/my-playlist"
                  element={<MyPlaylist auth={auth} />}
                />
              </Routes>
            </Col>
          </Row>
          <div>
            <Player key={user_auth} accessToken={auth} trackUris={tracks[0]} />
          </div>
        </Router> */}
        <ToastContainer />
      </>
    );
  }

  return <Login />;
}

export default App;
