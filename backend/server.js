const session = require("cookie-session");
const express = require("express");
const hpp = require("hpp");
const helmet = require("helmet");
const csurf = require("csurf");
const dotenv = require("dotenv").config();
const path = require("path");
const port = process.env.PORT || 8000;

const { errorHandler } = require("./middlewares/errorMiddleware");

/* Create express app */
const app = express();

/* Setup security configs */
app.use(helmet());
app.use(hpp());

/* Setup cookie session */

/* Setup json parser */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/* Setup the session cookie */
app.use(
  session({
    name: "session",
    secret: process.env.COOKIE_SECRET,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 * 24 hours = 24*60*60*1000 ms = 1 week
  })
);

/* Setup custom middlewares */
app.use(errorHandler);

/* Setup the routes */
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/fer", require("./routes/ferRoutes"));

/* Setup app on port */
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
