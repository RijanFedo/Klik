import { Avatar } from "@mui/material";
import {
  getDatabase,
  push,
  ref,
  serverTimestamp,
  set,
} from "firebase/database";
import React, { useContext } from "react";
import { UserContext } from "../App";

function AddUser({ chat, setPopsearch }) {
  const prop = useContext(UserContext);
  const writeUserData = (chat) => {
    const db = getDatabase();
    const postListRef = ref(db, "chatmembers/");
    const newPostRef = push(postListRef);
    set(newPostRef, {
      members: [prop.currentUser.uid, chat.id],
      lastmessage: {
        message: "",
        createdAt: serverTimestamp(),
        sentBy: prop.currentUser.uid,
      },
    });
    setPopsearch("");
  };
  return (
    <div className="side-chats" style={{ width: "250px" }}>
      <Avatar src={chat.profile_picture} />
      <div>
        <p>
          <b>{chat.username}</b>
        </p>
      </div>
      {!prop.chatUserId.includes(chat.id) ? (
        <button
          style={{
            backgroundColor: "#893BEF",
            color: "white",
            marginLeft: "auto",
          }}
          className="btn btn-sm rounded-pill"
          onClick={() => writeUserData(chat)}
        >
          Add
        </button>
      ) : (
        <p
          style={{
            color: "#893BEF",
            marginLeft: "auto",
          }}
        >
          <b>Connected</b>
        </p>
      )}
    </div>
  );
}

export default AddUser;
