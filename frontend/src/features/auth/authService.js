import axios from "axios";

const API_URL = "/api/auth/";

// Set User's auth info to local storage
const setUserAuth = async (user_auth) => {
  if (user_auth) {
    localStorage.setItem("user_auth", user_auth);
  }
  return user_auth;
};

// Refresh the user's access token
const refreshAuthToken = async () => {
  const response = await axios.get(API_URL + "refresh-token");

  // if (response.data) {
  //   localStorage.setItem("user_auth", JSON.stringify(response.data));
  // }
  if (response.data.access_token) {
    return response.data.access_token;
  }
  return response.data;
};

// Logout the user
const logout = async () => {
  localStorage.removeItem("user_auth");
  await axios.get(API_URL + "logout");
};

const authService = { setUserAuth, logout, refreshAuthToken };

export default authService;
