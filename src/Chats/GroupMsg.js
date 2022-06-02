import { Avatar } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";

function GroupMsg({ chat }) {
  const prop = useContext(UserContext);
  const navigate = useNavigate();
  const date = new Date(chat.lastmessage.createdAt).toDateString();
  const time = new Date(chat.lastmessage.createdAt).toLocaleTimeString();
  const [id, setId] = useState();
  // const a = time.split(":");
  // const c = a.slice(0, 2);
  // const d = c.join(":");
  // const e = a[2].split(" ");
  const [counter, setCounter] = useState([]);
  const handleClick = () => {
    navigate(`/group/${chat.id}`);
    prop.setActiveGrpChat(chat);
    prop.setGrpClicked("clicked");
  };

  useEffect(() => {
    // console.log(prop.grpMsgCount);
    setTimeout(() => {
      let filteredCnt = prop.grpMsgCount.filter((c) => {
        return c.id === chat.id;
      });
      setCounter(filteredCnt);
    }, 500);
  }, [chat, prop.grpMsgCount, prop.grpClicked]);
  // console.log(counter);

  return (
    <div
      className={
        chat.name === prop.activeGrpChat.name ? "side-chats2" : "side-chats"
      }
      onClick={handleClick}
    >
      <Avatar src={chat.profile_picture}></Avatar>
      <div>
        <p>
          <b>{chat.name}</b>
        </p>
        <p className="notifi-time">{chat.lastmessage.message}</p>
      </div>
      <div></div>
      <div className="ms-auto d-flex flex-column gap-1">
        <p className="notifi-time" style={{ marginLeft: "auto" }}>
          {time}
        </p>
        {counter[0] ? (
          <div
            style={{ display: counter[0].count > 0 ? "unset" : "none" }}
            className="rounded-circle count ms-auto"
          >
            <p style={{ fontSize: "12px" }}>{counter[0].count}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default GroupMsg;
