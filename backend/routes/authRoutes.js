const express = require("express");
const router = express.Router();
const {
  login,
  callback,
  getAccessToken,
  refreshAccessToken,
  logout,
} = require("../controllers/authController");

router.route("/login").get(login);
router.route("/callback").get(callback);
router.route("/access-token").get(getAccessToken);
router.route("/refresh-token").get(refreshAccessToken);
router.route("/logout").get(logout);

module.exports = router;
