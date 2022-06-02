import { Avatar } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import "./Chatsmsg.css";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import { getDatabase, onValue, ref, set } from "firebase/database";

const Chatsmsg = ({ chat }) => {
  const prop = useContext(UserContext);
  const navigate = useNavigate();
  const [currentChatId, setCurrentChatId] = useState("");
  const [currentChatUserInfo, setCurrentChatUserInfo] = useState([]);
  const [unRead, setUnRead] = useState();
  const handleClick = () => {
    navigate(`/${chat.id}`);
    writeTextRead();
    prop.setClicked("clicked");
  };

  const writeTextRead = () => {
    let msgIds = [];
    const db = getDatabase();
    const starCountRef = ref(db, "chatmessages/" + chat.id);
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      for (var key in data) {
        if (data.hasOwnProperty(key)) {
          var val = data[key];
          if (val.sentBy === currentChatId) {
            msgIds.push(key);
          }
        }
      }
    });
    msgIds.map((c) => {
      const postListRef = ref(
        db,
        "chatmessages/" + chat.id + "/" + c + "/isRead"
      );
      set(postListRef, true);
    });
  };

  useEffect(() => {
    const filteredUser = chat.members.filter((mem) => {
      return mem !== prop.currentUser.uid;
    });
    setCurrentChatId(filteredUser[0]);
    const db = getDatabase();
    const starCountRef = ref(db, "users/" + filteredUser[0]);
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      // console.log(data);
      setCurrentChatUserInfo(data);
    });
  }, [chat]);
  // console.log(currentChatUserInfo);

  const date = new Date(chat.lastmessage.createdAt).toLocaleTimeString();

  // // console.log(prop.msgCount);
  useEffect(() => {
    prop.setClicked("");
    const lc = prop.msgCount
      .map((c) => {
        return c[0];
      })
      .filter((c) => {
        return c.id === chat.id;
      })
      .map((c) => {
        return c.count;
      });
    // console.log(lc);
    setUnRead(lc[0]);
  }, [chat.id, writeTextRead]);
  // console.log(unRead);

  return (
    <div
      className={
        currentChatUserInfo.username === prop.activeChat.username
          ? "side-chats2"
          : "side-chats"
      }
      onClick={handleClick}
    >
      <Avatar src={currentChatUserInfo.profile_picture}></Avatar>
      <div>
        <p>
          <b>{currentChatUserInfo.username}</b>
        </p>
        <p className="notifi-time">{chat.lastmessage.message}</p>
      </div>

      <div className="ms-auto d-flex flex-column gap-1">
        <p className="notifi-time">{date}</p>

        <div
          style={{ display: unRead > 0 ? "unset" : "none" }}
          className="rounded-circle count ms-auto"
        >
          <p style={{ fontSize: "12px" }}>{unRead}</p>
        </div>
      </div>
    </div>
  );
};

export default Chatsmsg;
