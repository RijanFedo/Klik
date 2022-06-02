import { Avatar, IconButton } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import CallIcon from "@mui/icons-material/Call";
import VideocamIcon from "@mui/icons-material/Videocam";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import AttachmentIcon from "@mui/icons-material/Attachment";
import Input from "@mui/material/Input";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";
import TelegramIcon from "@mui/icons-material/Telegram";
import { useParams } from "react-router-dom";
import { UserContext } from "../App";
import {
  getDatabase,
  onValue,
  push,
  ref,
  serverTimestamp,
  set,
} from "firebase/database";

function GroupChatBox() {
  const chatid = useParams();
  const [currentGrpChat, setCurrentGrpChat] = useState([]);
  const prop = useContext(UserContext);
  const [grpConvo, setGrpConvo] = useState([]);
  const db = getDatabase();

  useEffect(() => {
    const db = getDatabase();
    const starCountRef = ref(db, "groupchats/" + chatid.id);
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      setCurrentGrpChat(data);
    });
  }, [chatid]);
  // console.log(currentGrpChat.members);

  useEffect(() => {
    const db = getDatabase();
    const starCountRef = ref(db, "groupchatmessages/" + chatid.id);
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      let messages = [];
      for (var key in data) {
        if (data.hasOwnProperty(key)) {
          var val = data[key];
          messages.push(val);
        }
      }
      setGrpConvo(messages);
    });
  }, [chatid]);
  // console.log(grpConvo);

  const sendMessage = (e) => {
    e.preventDefault();
    if (prop.textValue) {
      writeUserData(prop.textValue);
      writeUserData2(prop.textValue);
      writeCountData();
    }
    prop.setTextValue("");
  };

  const writeUserData = (textValue) => {
    const postListRef = ref(db, "groupchatmessages/" + chatid.id);
    const newPostRef = push(postListRef);
    set(newPostRef, {
      message: textValue,
      createdAt: serverTimestamp(),
      sentBy: prop.currentUser.uid,
      senderName: prop.currentUserDetail.username,
      isRead: false,
    });
  };

  const writeUserData2 = (textValue) => {
    const postListRef = ref(db, "groupchats/" + chatid.id + "/lastmessage");
    set(postListRef, {
      message: textValue,
      createdAt: serverTimestamp(),
      sentBy: prop.currentUser.uid,
      senderName: prop.currentUserDetail.username,
    });
  };

  useEffect(() => {
    const postListRef = ref(
      db,
      "groupNotifi/" + chatid.id + "/" + prop.currentUser.uid + "/lastRead"
    );
    set(postListRef, grpConvo.length);
  }, [grpConvo]);

  const writeCountData = () => {
    currentGrpChat.members.map((id) => {
      const postListRef = ref(
        db,
        "groupNotifi/" + chatid.id + "/" + id + "/lastMsg"
      );
      set(postListRef, grpConvo.length + 1);
    });
  };

  return (
    <div>
      <div className="chatbox-header">
        <Avatar src={currentGrpChat.profile_picture}></Avatar>
        <div>
          <p className="avatar-name">
            <b>{currentGrpChat.name}</b>
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
        {grpConvo.map((chat) => {
          return chat.sentBy === prop.currentUser.uid ? (
            <div key={chat.createdAt} style={{ marginLeft: "auto" }}>
              <p style={{ width: "min-Content", marginLeft: "auto" }}>
                {chat.senderName}
              </p>
              <div className="chat-text">{chat.message}</div>
            </div>
          ) : (
            <div key={chat.createdAt} style={{ marginRight: "auto" }}>
              <p style={{ width: "min-Content", marginRight: "auto" }}>
                {chat.senderName}
              </p>
              <div className="rec-chat-text">{chat.message}</div>
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

export default GroupChatBox;
