const asyncHandler = require("express-async-handler");
const axios = require("axios");
const jwt = require("jsonwebtoken");

// @desc    Login to the system through Spotify
// @route   GET /api/auth/login
// @access  Public
const login = (req, res) => {
  const scope = `streaming 
    user-read-email 
    user-read-private 
    user-library-read 
    user-library-modify 
    user-read-playback-state 
    user-modify-playback-state 
    playlist-modify-private 
    playlist-read-collaborative 
    playlist-read-private 
    playlist-modify-public`;

  const auth_query_params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.SPOTIFY_CLIENT_ID,
    scope: scope,
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
  });

  res.redirect(
    "https://accounts.spotify.com/authorize?" + auth_query_params.toString()
  );
};

// @desc    Get token on callback and store it in the jwt
// @route   GET /api/auth/callback
const callback = (req, res) => {
  const code = req.query.code;

  const authOptions = {
    method: "post",
    url: "https://accounts.spotify.com/api/token",
    params: {
      code: code,
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
      grant_type: "authorization_code",
    },
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(
          process.env.SPOTIFY_CLIENT_ID +
            ":" +
            process.env.SPOTIFY_CLIENT_SECRET
        ).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  axios(authOptions)
    .then((response) => {
      if (response.status === 200) {
        const access_token = response.data.access_token;
        const refresh_token = response.data.refresh_token;
        req.session.access_token = access_token;
        req.session.refresh_token = refresh_token;
        req.session.iat = Date.now();
        res.redirect("/");
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

// @desc    Get current user's auth info from session
// @route   GET /api/auth/access-token
const getAccessToken = (req, res) => {
  res.status(200).json({
    access_token: req.session.access_token,
    iat: req.session.iat,
  });
};

// @desc   Logout the user
// @route  GET /api/auth/logout
const logout = (req, res) => {
  req.session = null;
  res.redirect("/");
};

// @desc    Refresh the user's access token
// @route   GET /api/auth/refresh-token
const refreshAccessToken = (req, res) => {
  const refresh_token = req.session.refresh_token;
  const access_token = req.session.access_token;
  // console.log("[DEBUG] refresh: ", refresh_token);
  // console.log("[DEBUG] access: ", access_token);

  const authOptions = {
    method: "post",
    url: "https://accounts.spotify.com/api/token",
    params: {
      grant_type: "refresh_token",
      refresh_token: refresh_token,
    },
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(
          process.env.SPOTIFY_CLIENT_ID +
            ":" +
            process.env.SPOTIFY_CLIENT_SECRET
        ).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  axios(authOptions)
    .then((response) => {
      if (response.status === 200) {
        const access_token = response.data.access_token;
        req.session.access_token = access_token;
        req.session.iat = Date.now();
        res.status(200).json({
          access_token: access_token,
        });
      }
    })
    .catch((error) => {
      console.log(error.data);
    });
};

module.exports = {
  login,
  callback,
  getAccessToken,
  refreshAccessToken,
  logout,
};
