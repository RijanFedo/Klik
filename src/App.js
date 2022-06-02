import { Route, Routes } from "react-router-dom";
import "./App.css";
import Chatbox from "./Chatbox/Chatbox";
import Chats from "./Chats/Chats";
import Notifications from "./Notifications/Notifications";
import Login from "./Login/Login";
import { useState, useEffect, createContext } from "react";
import Signup from "./Login/Signup";
import { getDatabase, ref, get, child, onValue } from "firebase/database";
import { app } from "./Firebase/Firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Home from "./Login/Home";
import GroupChatBox from "./Chats/GroupChatBox";

export const UserContext = createContext();

function App() {
  const db = getDatabase();
  const [textValue, setTextValue] = useState("");
  const [currentUser, setCurrentUser] = useState({});
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [passwordCnfrm, setPasswordCnfrm] = useState();
  const [userName, setUserName] = useState();
  const [profileURL, setProfileURL] = useState();
  const [chatUserId, setChatUserId] = useState([]);
  const [directChats, setDirectChats] = useState([]);
  const [userChats, setUserChats] = useState([]);
  const [msgCount, setMsgCount] = useState([]);
  const [groupchats, setGroupChats] = useState([]);
  const [groupChatId, setGroupChatId] = useState([]);
  const [passType, setPassType] = useState(true);
  const [clicked, setClicked] = useState("");
  const [convoType, setConvoType] = useState("Direct");
  const [currentUserDetail, setCurrentUserDetail] = useState([]);
  const [grpData, setGrpData] = useState([]);
  const [crChatUserId, setCrChatUserId] = useState("Clicked");
  const [activeGrpChat, setActiveGrpChat] = useState([
    // {
    //   id: "",
    // },
  ]);
  const [totalDirects, setTotalDirects] = useState("");
  const [grpMsgCount, setGrpMsgCount] = useState([]);
  const [grpClicked, setGrpClicked] = useState("");
  const [activeChat, setActiveChat] = useState([
    {
      username: "",
      profile_picture: "",
      email: "",
      id: "",
    },
  ]);

  const [starredMessages, setStarredMessages] = useState([]);

  const appNotifi = [
    {
      id: 1,
      name: "Ireena",
      note: 'mentioned you in "Trip to Goa".',
      time: "1 min ago",
      path: "https://images.unsplash.com/photo-1542157585-ef20bfcce579?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NDV8fHByb2ZpbGUlMjBwaWN0dXJlfGVufDB8MnwwfHw%3D&auto=format&fit=crop&w=600&q=60",
    },
    {
      id: 2,
      name: "Rino",
      note: 'added you in group "Study".',
      time: "5 min ago",
      path: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTV8fHByb2ZpbGUlMjBwaWN0dXJlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=600&q=60",
    },
    {
      id: 3,
      name: "Sajay",
      note: 'removed you from group "Riders".',
      time: "6 min ago",
      path: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZSUyMHBpY3R1cmV8ZW58MHwyfDB8fA%3D%3D&auto=format&fit=crop&w=600&q=60",
    },
    {
      id: 4,
      name: "Godwin",
      note: "mentioned you in public chat.",
      time: "6 min ago",
      path: "https://images.unsplash.com/photo-1628157588553-5eeea00af15c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZSUyMHBpY3R1cmV8ZW58MHwyfDB8fA%3D%3D&auto=format&fit=crop&w=600&q=60",
    },
    {
      id: 5,
      name: "Ireena",
      note: 'mentioned you in "College Gang".',
      time: "15 min ago",
      path: "https://images.unsplash.com/photo-1542157585-ef20bfcce579?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NDV8fHByb2ZpbGUlMjBwaWN0dXJlfGVufDB8MnwwfHw%3D&auto=format&fit=crop&w=600&q=60",
    },
  ];
  const appSuggest = [
    {
      id: 1,
      name: "Goodnisha",
      mutuals: 10,
      path: "https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fGF2YXRhcnxlbnwwfDJ8MHx8&auto=format&fit=crop&w=600&q=60",
    },
    {
      id: 2,
      name: "Reno",
      mutuals: 12,
      path: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8&auto=format&fit=crop&w=600&q=60",
    },
    {
      id: 3,
      name: "Hemi",
      mutuals: 6,
      path: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8&auto=format&fit=crop&w=600&q=60",
    },
    {
      id: 4,
      name: "Sobiya",
      mutuals: 3,
      path: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8&auto=format&fit=crop&w=600&q=60",
    },
  ];

  const prop = {
    textValue,
    setTextValue,
    currentUser,
    setCurrentUser,
    currentUserDetail,
    setCurrentUserDetail,
    email,
    setEmail,
    password,
    setPassword,
    passwordCnfrm,
    setPasswordCnfrm,
    userName,
    setUserName,
    profileURL,
    setProfileURL,
    chatUserId,
    setChatUserId,
    userChats,
    setUserChats,
    directChats,
    setDirectChats,
    appSuggest,
    appNotifi,
    activeChat,
    setActiveChat,
    msgCount,
    setMsgCount,
    clicked,
    setClicked,
    groupchats,
    setGroupChats,
    passType,
    setPassType,
    convoType,
    setConvoType,
    grpData,
    setGrpData,
    crChatUserId,
    setCrChatUserId,
    activeGrpChat,
    setActiveGrpChat,
    groupChatId,
    setGroupChatId,
    grpMsgCount,
    setGrpMsgCount,
    grpClicked,
    setGrpClicked,
    totalDirects,
    setTotalDirects,
    starredMessages,
    setStarredMessages,
  };

  useEffect(() => {
    const auth = getAuth(app);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser({ uid: user.uid, email: user.email });
        // ...
      } else {
        // User is signed out
        // ...
      }
    });
  }, []);

  useEffect(() => {
    const dbRef = ref(getDatabase());
    get(child(dbRef, `users/` + currentUser.uid))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setCurrentUserDetail(data);
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [currentUser]);
  // console.log(currentUserDetail);

  useEffect(() => {
    const starCountRef = ref(db, "chatmembers/");
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      const direct = [];
      let chats = [];
      let chatIds = [];
      for (var key in data) {
        if (data.hasOwnProperty(key)) {
          var val = data[key];
          if (val.members.includes(currentUser.uid)) {
            chats.push(key);
            direct.push({ id: key, ...val });
            const chatuid = val.members.filter((id) => {
              return id !== currentUser.uid;
            });
            chatIds.push(chatuid[0]);
          }
        }
      }
      const sortedChat = direct.sort((a, b) => {
        return b.lastmessage.createdAt - a.lastmessage.createdAt;
      });
      setDirectChats(sortedChat);
      setChatUserId(chatIds);
    });
  }, [currentUser]);
  // console.log(chatUserId);
  // console.log(directChats);

  useEffect(() => {
    const dbRef = ref(getDatabase());
    get(child(dbRef, `users/`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          let chatUsers = [];
          for (var key in data) {
            if (data.hasOwnProperty(key) && key !== currentUser.uid) {
              var val = data[key];
              if (chatUserId.includes(val.id)) {
                chatUsers.push(val);
              }
            }
          }
          setUserChats(chatUsers);
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [chatUserId]);
  // console.log(userChats);

  useEffect(() => {
    let msgCnt = [];
    directChats.map((chat) => {
      let msg = [];
      const starCountRef = ref(db, "chatmessages/" + chat.id);
      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        let count = 0;
        for (var key in data) {
          if (data.hasOwnProperty(key)) {
            var val = data[key];
            if (val.sentBy !== prop.currentUser.uid && val.isRead === false) {
              count++;
            }
          }
        }
        msg.push({ id: chat.id, count });
        msgCnt.push(msg);
        setMsgCount(msgCnt);
      });
    });
  }, [directChats, clicked]);
  // console.log(msgCount);

  useEffect(() => {
    let totalSum = 0;
    msgCount.map((d) => {
      for (var key in d) {
        var val = d[key];
        if (val.count > 0) {
          totalSum++;
        }
      }
    });

    setTotalDirects(totalSum);
  }, [msgCount]);

  useEffect(() => {
    const db = getDatabase();
    const starCountRef = ref(db, "groupchats/");
    const arr = [];
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      const msg = [];
      const grpid = [];
      for (var key in data) {
        if (data.hasOwnProperty(key)) {
          var val = data[key];

          if (
            // val.admin.includes(currentUser.uid) ||
            val.members.includes(currentUser.uid)
          ) {
            msg.push({ id: key, ...val });
            grpid.push(key);
          }
        }
      }
      const sortedMsg = msg.sort((a, b) => {
        return b.lastmessage.createdAt - a.lastmessage.createdAt;
      });
      setGroupChatId(grpid);
      setGroupChats(sortedMsg);
    });
  }, [currentUser]);
  // console.log(groupchats);

  useEffect(() => {
    const msgCnt = [];
    const arrIndex = {};
    function addOrReplace(object) {
      var index = arrIndex[object.id];
      if (index === undefined) {
        index = msgCnt.length;
      }
      arrIndex[object.id] = index;
      msgCnt[index] = object;
      prop.setGrpClicked("");
    }
    groupChatId.map((id) => {
      const starCountRef = ref(
        db,
        "groupNotifi/" + id + "/" + prop.currentUser.uid
      );
      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        // console.log(data);
        let msgCount = null;
        if (data.lastRead) {
          msgCount = data.lastMsg - data.lastRead;
        } else {
          msgCount = data.lastMsg - 0;
        }
        // setTimeout(() => {
        addOrReplace({ id: id, count: msgCount });
        // }, 500);
      });
    });
    // console.log(msgCnt);
    setGrpMsgCount(msgCnt);
  }, [groupChatId, grpClicked]);
  // console.log(grpMsgCount);

  return (
    <UserContext.Provider value={prop}>
      <div className="App">
        <Routes>
          <Route
            path="/"
            exact
            element={
              currentUser.uid == null ? (
                <Login />
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 2fr 1fr",
                  }}
                >
                  <Chats />
                  <Home />
                  <Notifications />
                </div>
              )
            }
          ></Route>
          <Route path="/Signup" exact element={<Signup />}></Route>
          <Route
            path="/:id"
            element={
              <div
                style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1fr" }}
              >
                <Chats />
                <Chatbox />
                <Notifications />
              </div>
            }
          ></Route>
          <Route
            path="/group/:id"
            element={
              <div
                style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1fr" }}
              >
                <Chats />
                <GroupChatBox />
                <Notifications />
              </div>
            }
          ></Route>
        </Routes>
      </div>
    </UserContext.Provider>
  );
}

export default App;
