import { Avatar } from "@mui/material";
import {
  getDatabase,
  get,
  ref,
  child,
  set,
  push,
  serverTimestamp,
} from "firebase/database";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import "./Notifications.css";

function Notifications() {
  const prop = useContext(UserContext);
  const [suggestions, setSuggestions] = useState([]);

  const writeUserData = (sug) => {
    const db = getDatabase();
    const postListRef = ref(db, "chatmembers/");
    const newPostRef = push(postListRef);
    set(newPostRef, {
      members: [prop.currentUser.uid, sug.id],
      lastmessage: {
        message: "",
        createdAt: serverTimestamp(),
        sentBy: prop.currentUser.uid,
      },
    });
  };

  useEffect(() => {
    const dbRef = ref(getDatabase());
    get(child(dbRef, `users/`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          let allUsers = [];
          for (var key in data) {
            if (data.hasOwnProperty(key) && key !== prop.currentUser.uid) {
              var val = data[key];

              allUsers.push(val);
            }
          }
          const rem = allUsers.slice(0, 4).filter((chat) => {
            return !prop.chatUserId.includes(chat.id);
          });
          setSuggestions(rem);
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [prop.userChats]);
  // console.log(suggestions);

  return (
    <div className="notifi-bar">
      <div>
        <p className="notifi-heading">
          <b>Notifications</b>
        </p>
        <div className="notifi">
          {prop.appNotifi.map((not) => {
            return (
              <div key={not.id} className="notifi-content">
                <Avatar src={not.path} />
                <p className="username">
                  <span style={{ color: "#893BEF" }}>
                    <b>@{not.name} </b>
                  </span>
                  {not.note}
                  <span
                    className="notifi-time"
                    style={{ marginLeft: "20px", whiteSpace: "nowrap" }}
                  >
                    {not.time}
                  </span>
                </p>
              </div>
            );
          })}
        </div>
      </div>
      <div>
        <p className="notifi-heading">
          <b>Suggestions</b>
        </p>
        <div className="notifi">
          {suggestions.map((sug) => {
            return (
              <div key={sug.id} className="sug-content">
                <Avatar src={sug.profile_picture} />
                <div className="d-flex align-items-center">
                  <p className="sug-username">
                    <b>{sug.username}</b>
                  </p>
                  {/* <p className="notifi-time">{sug.mutuals} Mutuals</p> */}
                </div>

                <button
                  style={{
                    backgroundColor: "#893BEF",
                    color: "white",
                  }}
                  // type="button"
                  className="btn btn-sm rounded-pill"
                  onClick={() => writeUserData(sug)}
                >
                  Add
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Notifications;
