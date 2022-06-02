import { TextField } from "@mui/material";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { app } from "../Firebase/Firebase";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { UserContext } from "../App";
import VisibilityIcon from "@mui/icons-material/Visibility";

function Login() {
  const prop = useContext(UserContext);
  const navigate = useNavigate();
  const [err, setErr] = useState("");

  //firebase
  const auth = getAuth(app);
  const handleSignIn = () => {
    signInWithEmailAndPassword(auth, prop.email, prop.password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // navigate("/");
        console.log(user);
        // ...
      })
      .catch((error) => {
        setErr("User doesn't exists");
        console.log(error.message);
      });
  };
  //firebase end

  return (
    <div className="login-content">
      <div className="login-logo">
        <img
          style={{
            width: "100%",
            height: "50%",
          }}
          src="./click.png"
        />
      </div>
      <div className="login-cred">
        <div>
          <TextField
            value={prop.email}
            className="input-cred"
            label="Email"
            color="secondary"
            onChange={(e) => {
              setErr("");
              prop.setEmail(e.target.value);
            }}
            variant="filled"
          />
        </div>

        <TextField
          value={prop.password}
          className="input-cred"
          label="Password"
          type={prop.passType ? "password" : "text"}
          color="secondary"
          variant="filled"
          onChange={(e) => prop.setPassword(e.target.value)}
        />
        <VisibilityIcon
          style={{ position: "absolute", right: "190px", bottom: "305px" }}
          onClick={() => prop.setPassType(!prop.passType)}
        />
        <small
          className="text-danger p-0 m-0"
          style={{ display: err ? "unset" : "none" }}
        >
          {err}
        </small>
        <button className="btn rounded-pill login-btn" onClick={handleSignIn}>
          <b>Log In</b>
        </button>
        <small style={{ fontSize: "0.8rem" }}>
          Don't have an Account?
          <a
            onClick={() => navigate("/Signup")}
            style={{ color: "#6f42c1", cursor: "pointer" }}
          >
            <u> CreateOne</u>
          </a>
        </small>
      </div>
    </div>
  );
}

export default Login;
