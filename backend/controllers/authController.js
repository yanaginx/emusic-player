const asyncHandler = require("express-async-handler");
const axios = require("axios");
const jwt = require("jsonwebtoken");

// @desc    Login to the system through Spotify
// @route   GET /api/auth/login
// @access  Public
const loginUser = (req, res) => {
  const AUTH_URL = new URL("https://accounts.spotify.com/authorize");
  AUTH_URL.search = new URLSearchParams({
    response_type: "code",
    client_id: process.env.SPOTIFY_CLIENT_ID,
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
    scope:
      "streaming user-read-email user-read-private user-library-read user-library-modify user-read-playback-state user-modify-playback-state playlist-modify-private playlist-read-collaborative playlist-read-private playlist-modify-public",
  });

  res.redirect(AUTH_URL);
};

// @desc    Get token on callback and store it in the jwt
// @route   GET /api/auth/callback
const getTokenWithCode = async (req, res) => {
  if (req.query.error) {
    res.status(400);
    throw new Error(req.query.error);
  }
  const code = req.query.code;
  // DEBUG
  console.log("[DEBUG] in getTokenWithCode: search params code:", code);
  // END : DEBUG
  const data_params = new URLSearchParams({
    grant_type: "authorization_code",
    code: code,
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
  });
  const basicHeader = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString("base64");
  const response = await axios.post(
    "https://accounts.spotify.com/api/token",
    data_params.toString(),
    {
      headers: {
        Authorization: `Basic ${basicHeader}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  if (response.data.access_token) {
    // const jwt_user_token = generateToken(
    //   response.data.access_token,
    //   response.data.refresh_token,
    //   response.data.expiresIn
    // );
    // console.log("[DEBUG] generated jwt object", jwt_user_token);

    const user_auth = {
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token,
      expires_in: response.data.expires_in,
      iat: Date.now(),
    };
    console.log("[DEBUG] generated user_auth object", user_auth);
    // res.status(200).json(user_auth);
    // save the user_auth object in the session
    req.session.user_auth = user_auth;
    // then redirect to root
    return res.redirect("/");
    // res.status(200).json(req.session.user_auth);
  }
};

// @desc    Get current user's auth info from session
// @route   GET /api/auth/current-session
const getCurrentSession = (req, res) => {
  if (req.session.user_auth) {
    res.status(200).json(req.session.user_auth);
  } else {
    res.status(404);
    throw new Error("No user_auth object found in session");
  }
};

// @desc   Logout the user
// @route  GET /api/auth/logout
const logoutUser = (req, res) => {
  req.session = null;
  res.redirect("/");
};

// @desc    Refresh the user's access token
// @route   GET /api/auth/refresh-token
const refreshToken = async (req, res) => {
  // Get refresh token from session
  if (!req.session.user_auth) {
    res.status(404);
    throw new Error("No user_auth object found in session");
  }

  const refresh_token = req.session.user_auth.refresh_token;
  const data_params = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refresh_token,
  });
  const basicHeader = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString("base64");
  const response = await axios.post(
    "https://accounts.spotify.com/api/token",
    data_params.toString(),
    {
      headers: {
        Authorization: `Basic ${basicHeader}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  if (response.data.access_token) {
    const user_auth = {
      access_token: response.data.access_token,
      refresh_token: refresh_token,
      expires_in: response.data.expires_in,
      iat: Date.now(),
    };
    console.log("[DEBUG] new user_auth object with token refreshed", user_auth);
    // res.status(200).json(user_auth);
    // save the user_auth object in the session
    req.session.user_auth = user_auth;

    res.status(200).json(req.session.user_auth);
  }
};

module.exports = {
  loginUser,
  getTokenWithCode,
  getCurrentSession,
  refreshToken,
  logoutUser,
};
