import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField } from "@mui/material";
import "./Signup.css";
import { app } from "../Firebase/Firebase";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import { UserContext } from "../App";

const Signup = () => {
  const prop = useContext(UserContext);
  const navigate = useNavigate();
  const auth = getAuth(app);
  const [passErr, setPassErr] = useState("");
  const [userErr, setUserErr] = useState("");
  const [nameErr, setNameErr] = useState("");
  const [allErr, setAllErr] = useState("");

  const handleSignUp = () => {
    if (
      !prop.email ||
      !prop.password ||
      !prop.passwordCnfrm ||
      !prop.userName
    ) {
      setAllErr("Fill all the required fields");
    } else if (prop.password !== prop.passwordCnfrm) {
      setPassErr("Passwords does not match !");
    } else if (!prop.userName) {
      setNameErr("Enter a username");
    } else {
      createUserWithEmailAndPassword(auth, prop.email, prop.password)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log(user);
          navigate("/");
          writeUserData(user.uid, prop.userName, user.email, prop.profileURL);
        })
        .catch((error) => {
          setUserErr("Email already exists");
          console.log(error.message);
        });
    }
  };

  const writeUserData = (userId, name, email, imageUrl) => {
    const db = getDatabase();
    set(ref(db, "users/" + userId), {
      id: userId,
      username: name,
      email: email,
      profile_picture: imageUrl,
    });
  };

  return (
    <div className="signup-content">
      <div className="login-logo">
        <img
          style={{
            width: "100%",
            height: "50%",
          }}
          src="./click.png"
        />
      </div>
      <div className="reg-cred">
        <div className="d-flex flex-column">
          <small
            className="text-danger p-0 m-0"
            style={{ display: allErr ? "unset" : "none" }}
          >
            {allErr}
          </small>
          <TextField
            value={prop.email}
            className="input-cred"
            label="email"
            color="secondary"
            variant="filled"
            onChange={(e) => {
              setUserErr("");
              prop.setEmail(e.target.value);
              setAllErr("");
            }}
          />
          <small
            className="text-danger p-0 m-0"
            style={{ display: userErr ? "unset" : "none" }}
          >
            {userErr}
          </small>
        </div>
        <div className="d-flex flex-column">
          <TextField
            value={prop.userName}
            className="input-cred"
            label="username"
            color="secondary"
            variant="filled"
            onChange={(e) => {
              setNameErr("");
              prop.setUserName(e.target.value);
              setAllErr("");
            }}
          />
          <small
            className="text-danger p-0 m-0"
            style={{ display: nameErr ? "unset" : "none" }}
          >
            {nameErr}
          </small>
        </div>
        <TextField
          value={prop.profileURL}
          className="input-cred"
          label="profile"
          color="secondary"
          variant="filled"
          onChange={(e) => prop.setProfileURL(e.target.value)}
        />
        <TextField
          value={prop.password}
          className="input-cred"
          label="password"
          type="password"
          color="secondary"
          variant="filled"
          onChange={(e) => prop.setPassword(e.target.value)}
        />
        <div className="d-flex flex-column">
          <TextField
            value={prop.passwordCnfrm}
            className="input-cred"
            id="filled-basic"
            label="Confirm Password"
            type="password"
            color="secondary"
            variant="filled"
            onChange={(e) => {
              prop.setPasswordCnfrm(e.target.value);
              setPassErr("");
              setAllErr("");
            }}
          />
          <small
            className="text-danger p-0 m-0"
            style={{ display: passErr ? "unset" : "none" }}
          >
            {passErr}
          </small>
        </div>
        <button className="btn rounded-pill login-btn" onClick={handleSignUp}>
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default Signup;
