import React, { useContext, useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import CallIcon from "@mui/icons-material/Call";
import VideocamIcon from "@mui/icons-material/Videocam";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import AttachmentIcon from "@mui/icons-material/Attachment";
import Input from "@mui/material/Input";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";
import TelegramIcon from "@mui/icons-material/Telegram";
import "./Chatbox.css";
import { useParams } from "react-router-dom";
import { IconButton } from "@mui/material";
import {
  serverTimestamp,
  getDatabase,
  ref,
  set,
  push,
  onValue,
} from "firebase/database";
import { UserContext } from "../App";

function Chatbox() {
  const prop = useContext(UserContext);
  const chatid = useParams();
  const db = getDatabase();
  const [convo, setConvo] = useState([]);

  useEffect(() => {
    const starCountRef = ref(db, "chatmembers/" + chatid.id + "/members");
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      // console.log(data);
      const filteredId = data.filter((mem) => {
        return mem !== prop.currentUser.uid;
      });
      // console.log(filteredId[0]);
      prop.setCrChatUserId(filteredId[0]);
    });
  }, [chatid]);
  // console.log(prop.crChatUserId);

  useEffect(() => {
    const db = getDatabase();
    // console.log(prop.userdir);
    const starCountRef = ref(db, "users/");
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      // console.log(data);
      for (var key in data) {
        // console.log(key);
        if (data.hasOwnProperty(key) && key == prop.crChatUserId) {
          var val = data[key];
          prop.setActiveChat(val);
        }
      }
    });
  }, [prop.crChatUserId]);
  // console.log(prop.activeChat);

  useEffect(() => {
    let msgIds = [];
    const db = getDatabase();
    const starCountRef = ref(db, "chatmessages/" + chatid.id);
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      for (var key in data) {
        if (data.hasOwnProperty(key)) {
          var val = data[key];
          // console.log(val.sentBy);
          if (val.sentBy === prop.activeChat.id) {
            msgIds.push(key);
          }
        }
      }
    });
    msgIds.map((c) => {
      const postListRef = ref(
        db,
        "chatmessages/" + chatid.id + "/" + c + "/isRead"
      );
      starCountRef && set(postListRef, true);
    });
  }, [convo]);

  useEffect(() => {
    const starCountRef = ref(db, "chatmessages/" + chatid.id);
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      let messages = [];
      for (var key in data) {
        if (data.hasOwnProperty(key)) {
          var val = data[key];
          messages.push(val);
        }
      }
      setConvo(messages);
      // setChatmsg(data);
    });
  }, [chatid]);
  // console.log(convo);

  const sendMessage = (e) => {
    e.preventDefault();
    if (prop.textValue) {
      writeUserData(prop.textValue);
      writeUserData2(prop.textValue);
    }
    prop.setTextValue("");
  };

  const writeUserData = (textValue) => {
    const postListRef = ref(db, "chatmessages/" + chatid.id);
    const newPostRef = push(postListRef);
    set(newPostRef, {
      message: textValue,
      createdAt: serverTimestamp(),
      sentBy: prop.currentUser.uid,
      isRead: false,
    });
  };

  const writeUserData2 = (textValue) => {
    const postListRef = ref(db, "chatmembers/" + chatid.id + "/lastmessage");
    set(postListRef, {
      message: textValue,
      createdAt: serverTimestamp(),
      sentBy: prop.currentUser.uid,
    });
  };

  const addStarredMessage = (chat) => {
    prop.setStarredMessages([...prop.starredMessages, chat]);
  };
  console.log(prop.starredMessages);

  return (
    <div>
      <div className="chatbox-header">
        <Avatar src={prop.activeChat.profile_picture}></Avatar>
        <div>
          <p className="avatar-name">
            <b>{prop.activeChat.username}</b>
          </p>
          <p className="avatar-lastseen">Last seen 3 hours ago</p>
        </div>
        <IconButton style={{ marginLeft: "auto" }}>
          <CallIcon className="header-icon" />
        </IconButton>
        <IconButton>
          <VideocamIcon className="header-icon" />
        </IconButton>
        <IconButton>
          <MoreHorizIcon className="header-icon" />
        </IconButton>
      </div>
      <div className="chatbox-content">
        Today 12:23 pm
        {convo.map((chat) => {
          return chat.sentBy === prop.currentUser.uid ? (
            <div
              onDoubleClick={() => addStarredMessage(chat)}
              className="chat-text"
            >
              {chat.message}
            </div>
          ) : (
            <div
              onDoubleClick={() => addStarredMessage(chat)}
              className="rec-chat-text"
            >
              {chat.message}
            </div>
          );
        })}
      </div>
      <form onSubmit={sendMessage}>
        <div className="chatbox-footer">
          <IconButton>
            <AttachmentIcon className="header-icon" />
          </IconButton>

          <Input
            value={prop.textValue}
            color="secondary"
            style={{ width: "80%" }}
            placeholder="Type a message here..."
            onChange={(e) => prop.setTextValue(e.target.value)}
          />

          <IconButton>
            <EmojiEmotionsIcon className="header-icon" />
          </IconButton>
          <IconButton>
            <KeyboardVoiceIcon className="header-icon" />
          </IconButton>
          <IconButton
            type="submit"
            className="rounded-circle"
            style={{ backgroundColor: "#893BEF" }}
          >
            <TelegramIcon style={{ fill: "white" }} />
          </IconButton>
        </div>
      </form>
    </div>
  );
}
export default Chatbox;
