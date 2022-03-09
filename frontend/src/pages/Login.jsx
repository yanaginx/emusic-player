import React from "react";
import styles from "./Login.module.css";

function Login() {
  return (
    <div className={styles.login}>
      <a href="/api/auth/login">LOGIN WITH SPOTIFY</a>
    </div>
  );
}

export default Login;
