import { Avatar, Input, TextField } from "@mui/material";
import React, { useContext } from "react";
import { UserContext } from "../App";

function Home() {
  const prop = useContext(UserContext);
  return (
    <div className="d-flex flex-column align-items-center justify-content-center gap-4 p-4">
      <h1
        style={{ display: prop.currentUserDetail.username ? "unset" : "none" }}
      >
        <b>Welcome, {prop.currentUserDetail.username} !!</b>
      </h1>
      <Avatar style={{ width: "120px", height: "120px" }}></Avatar>
      <Input
        color="secondary"
        style={{ width: "40%", textAlign: "center" }}
        placeholder="Set your Profile Name.."
      />
      <button
        style={{
          backgroundColor: "#893BEF",
          color: "white",
        }}
        // type="button"
        className="btn rounded-pill"
      >
        Start a Convo
      </button>
      <p>Search for someone to start chatting..</p>
    </div>
  );
}

export default Home;
