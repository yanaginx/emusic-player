import axios from "axios";

const API_URL = "/api/auth/";

// Get User's auth info from current session
const getUserAuth = async () => {
  const response = await axios.get(API_URL + "current-session");

  if (response.data) {
    localStorage.setItem("user_auth", JSON.stringify(response.data));
  }

  return response.data;
};

// Logout the user
const logout = async () => {
  localStorage.removeItem("user_auth");
  await axios.get(API_URL + "logout");
};

const authService = { getUserAuth, logout };

export default authService;
