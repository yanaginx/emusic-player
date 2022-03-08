const express = require("express");
const router = express.Router();

const {
  loginUser,
  getTokenWithCode,
  getCurrentSession,
  refreshToken,
  logoutUser,
} = require("../controllers/authController");

router.get("/login", loginUser);
router.get("/callback", getTokenWithCode);
router.get("/current-session", getCurrentSession);
router.get("/refresh-token", refreshToken);
router.get("/logout", logoutUser);

module.exports = router;
