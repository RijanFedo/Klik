import React, { useContext, useEffect, useState } from "react";
import ForumIcon from "@mui/icons-material/Forum";
import CallIcon from "@mui/icons-material/Call";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import GroupsIcon from "@mui/icons-material/Groups";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Chatsmsg from "./Chatsmsg";
import "./Chats.css";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Avatar, Chip, Input } from "@mui/material";
import { UserContext } from "../App";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { getAuth, signOut } from "firebase/auth";
import { app } from "../Firebase/Firebase";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";

import {
  getDatabase,
  ref,
  get,
  child,
  serverTimestamp,
  push,
  set,
} from "firebase/database";
import AddUser from "./AddUser";
import GroupMsg from "./GroupMsg";

function Chats() {
  const navigate = useNavigate();
  const prop = useContext(UserContext);
  const [filteredChats, setFilteredChats] = useState([]);
  const [search, setSearch] = useState("");
  const [searchUserPopup, setSearchUserPopup] = useState(false);
  const [newGroupPopup, setNewGroupPopup] = useState(false);
  const [allUserSearch, setAllUserSearch] = useState("");
  const [groupUserSearch, setGroupUserSearch] = useState("");
  const [popFilter, setPopfilter] = useState([]);
  const [logOutAnchor, setLogOutAnchor] = useState(null);
  const [newGroupAnchor, setNewGroupAnchor] = useState(null);
  const [loadMore, setLoadMore] = useState(2);
  const [active, setActive] = useState("Chats");
  const [newGroupName, setNewGroupName] = useState("");
  const [groupUserSearchRes, setGroupUserSearchRes] = useState([]);
  const [newGroupUsers, setNewGroupUsers] = useState([]);
  const [newGroupUserId, setNewGroupUserId] = useState([]);
  const [newGroupImage, setNewGroupImage] = useState("");
  const [filteredId, setFilteredId] = useState([]);
  const handleOpen = () => setSearchUserPopup(true);
  const handleOpen2 = () => {
    setNewGroupPopup(true);
    setNewGroupAnchor(null);
  };
  const handleClose = () => setSearchUserPopup(false);
  const handleClose2 = () => setNewGroupPopup(false);
  const handleMenu = (event) => {
    setLogOutAnchor(event.currentTarget);
  };
  const handleCreateGroup = (event) => {
    setNewGroupAnchor(event.currentTarget);
  };
  const handleLogout = () => {
    const auth = getAuth(app);
    signOut(auth)
      .then(() => {
        navigate("/");
        // console.log(prop.currentUser);
        prop.setCurrentUser({ uid: null, email: null });
        prop.setEmail("");
        prop.setPassType(false);
        prop.setPassword();
        // Sign-out successful.
      })
      .catch((error) => {
        // An error happened.
        alert(error.message);
      });
    setLogOutAnchor(null);
  };
  const handleLogoutClose = () => {
    setLogOutAnchor(null);
  };
  const handleLogoutClose2 = () => {
    setNewGroupAnchor(null);
  };

  const handleChange = (e) => {
    setSearch(e.target.value);
    const res = prop.userChats
      .filter((chat) => {
        return chat.username.toLowerCase().includes(search);
      })
      .map((c) => {
        return c.id;
      });
    // console.log(res);
    setFilteredId(res);
  };

  useEffect(() => {
    const abc = [];
    filteredId.map((id) => {
      for (var key in prop.directChats) {
        if (key) {
          const val = prop.directChats[key];
          // console.log(val);
          if (val.members.includes(id)) {
            abc.push(val);
          }
        }
      }
    });
    // console.log(abc);
    const filChats = abc.sort((a, b) => {
      return b.lastmessage.createdAt - a.lastmessage.createdAt;
    });
    setFilteredChats(filChats);
  }, [filteredId]);
  // console.log(filteredChats);
  useEffect(() => {
    const res = prop.userChats.filter((chat) => {
      return (
        chat.username.toLowerCase().includes(groupUserSearch.toLowerCase()) &&
        !newGroupUsers.includes(chat)
      );
    });
    setGroupUserSearchRes(res);
  }, [groupUserSearch, newGroupUsers]);
  // console.log(groupUserSearchRes);

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
              if (
                allUserSearch &&
                val.username.toLowerCase().includes(allUserSearch.toLowerCase())
              ) {
                allUsers.push(val);
              }
            }
          }
          setPopfilter(allUsers);
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [allUserSearch]);
  // console.log(popFilter);

  useEffect(() => {
    const filteredId = newGroupUsers.map((chat) => {
      return chat.id;
    });
    setNewGroupUserId(filteredId);
  }, [newGroupUsers]);
  // console.log(newGroupUserId);

  const writeGroupData = () => {
    // console.log(prop.currentUser.uid, chat.id);
    const db = getDatabase();
    const postListRef = ref(db, "groupchats/");
    const newPostRef = push(postListRef);
    set(newPostRef, {
      name: newGroupName,
      admin: [prop.currentUser.uid],
      members: [...newGroupUserId, prop.currentUser.uid],
      profile_picture: newGroupImage,
      lastmessage: {
        message: "",
        createdAt: serverTimestamp(),
        sentBy: prop.currentUser.uid,
        senderName: prop.currentUserDetail.username,
      },
    });
    setAllUserSearch("");
    setNewGroupPopup(false);
    setNewGroupName("");
    setGroupUserSearch("");
    setGroupUserSearchRes([]);
    setNewGroupUsers([]);
    setNewGroupUserId([]);
  };

  return (
    <div>
      <div className="chats-header">
        <IconButton onClick={() => setActive("Chats")}>
          <Badge badgeContent={prop.totalDirects} color="warning">
            <ForumIcon
              style={{ fill: active === "Chats" ? "#893bef" : null }}
              className="header-icon"
            />
          </Badge>
        </IconButton>
        <IconButton onClick={() => setActive("Calls")}>
          <Badge color="warning">
            <CallIcon
              style={{ fill: active === "Calls" ? "#893bef" : null }}
              className="header-icon"
            />
          </Badge>
        </IconButton>
        <IconButton onClick={() => setActive("Groups")}>
          <Badge color="warning">
            <GroupsIcon
              style={{ fill: active === "Groups" ? "#893bef" : null }}
              className="header-icon"
            />
          </Badge>
        </IconButton>
        <Avatar
          style={{ cursor: "pointer" }}
          src={prop.currentUser.photoURL}
          size="large"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleMenu}
          color="inherit"
        />
        <Menu
          id="menu-appbar"
          anchorEl={logOutAnchor}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "down",
            horizontal: "right",
          }}
          open={Boolean(logOutAnchor)}
          onClose={handleLogoutClose}
        >
          <MenuItem onClick={handleLogout}>Log out</MenuItem>
        </Menu>
      </div>
      <div className="chats-content">
        <div className="chats_header1">
          <p className="notifi-heading">
            <b>Chats</b>
          </p>
          <IconButton onClick={handleOpen} style={{ marginLeft: "auto" }}>
            <AddCircleIcon style={{ color: "#893BEF", fontSize: "35px" }} />
          </IconButton>
          <IconButton onClick={handleCreateGroup}>
            <MoreVertIcon style={{ color: "#893BEF" }} />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={newGroupAnchor}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "down",
              horizontal: "right",
            }}
            open={Boolean(newGroupAnchor)}
            onClose={handleLogoutClose2}
          >
            <MenuItem onClick={handleOpen2}>Create new Group</MenuItem>
          </Menu>
          <Modal
            open={searchUserPopup}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            className="d-flex flex-column align-items-center pt-5"
          >
            <Box
              style={{
                backgroundColor: "white",
                width: "min-content",
                borderRadius: "10px",
                maxHeight: "500px",
              }}
              className="d-flex flex-column align-items-center justify-content-center p-5 gap-4"
            >
              <CloseIcon
                style={{
                  position: "absolute",
                  right: "400px",
                  top: "25px",
                  fill: "white",
                }}
                onClick={handleClose}
              />
              <h4>Search Klik Users</h4>
              <Input
                color="secondary"
                type="search"
                style={{ width: "300px" }}
                placeholder="Type username"
                defaultValue={allUserSearch}
                onChange={(e) => {
                  setAllUserSearch(e.target.value);
                  setLoadMore(2);
                }}
              />

              <div
                style={{ overflowY: "scroll" }}
                className="d-flex flex-column align-items-center justify-content-center gap-3"
              >
                {allUserSearch.length > 0 ? (
                  popFilter.slice(0, loadMore).map((chat) => {
                    return (
                      <AddUser
                        key={chat.id}
                        setAllUserSearch={setAllUserSearch}
                        chat={chat}
                      />
                    );
                  })
                ) : (
                  <small>Your results here !</small>
                )}
                <button
                  style={{
                    backgroundColor: "#893BEF",
                    color: "white",
                    width: "max-content",
                    display: popFilter.length > 0 ? "unset" : "none",
                  }}
                  onClick={() => setLoadMore(loadMore + loadMore)}
                  // type="button"
                  className="btn btn-sm rounded-pill p-2"
                >
                  Load More
                </button>
                <small
                  style={{
                    display:
                      allUserSearch && popFilter.length <= 0 ? "unset" : "none",
                  }}
                >
                  No users found..!!
                </small>
              </div>
            </Box>
          </Modal>
          <Modal
            open={newGroupPopup}
            onClose={handleClose2}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            className="d-flex flex-column align-items-center pt-5"
          >
            <Box
              style={{
                backgroundColor: "white",
                width: "min-content",
                borderRadius: "10px",
                // maxHeight: "500px",
                // overflowY: "scroll",
              }}
              className="d-flex flex-column align-items-center justify-content-center p-5 gap-4"
            >
              <CloseIcon
                style={{
                  position: "absolute",
                  right: "400px",
                  top: "25px",
                  fill: "white",
                }}
                onClick={handleClose2}
              />
              <h6>Create a Group Chat</h6>
              <Input
                defaultValue={newGroupName}
                color="secondary"
                style={{ width: "250px" }}
                placeholder="Group Name"
                onChange={(e) => setNewGroupName(e.target.value)}
              />
              <Input
                defaultValue={newGroupImage}
                color="secondary"
                style={{ width: "250px" }}
                placeholder="Group Profile"
                onChange={(e) => setNewGroupImage(e.target.value)}
              />

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {newGroupUsers.map((chat) => (
                  <Chip key={chat.username} label={chat.username} />
                ))}
              </Box>
              <Input
                defaultValue={groupUserSearch}
                color="secondary"
                type="search"
                style={{ width: "250px" }}
                placeholder="Type username"
                onChange={(e) => setGroupUserSearch(e.target.value)}
              />
              {groupUserSearch.length > 0 &&
                groupUserSearchRes.map((chat) => {
                  return (
                    <div key={chat.id} className="sug-content">
                      <Avatar src={chat.profile_picture} />
                      <div className="d-flex align-items-center">
                        <p className="sug-username">
                          <b>{chat.username}</b>
                        </p>
                      </div>

                      <button
                        style={{
                          backgroundColor: "#893BEF",
                          color: "white",
                        }}
                        // type="button"
                        className="btn btn-sm rounded-pill"
                        onClick={() =>
                          setNewGroupUsers([...newGroupUsers, chat])
                        }
                      >
                        Add
                      </button>
                    </div>
                  );
                })}

              <button
                style={{
                  backgroundColor: "#893BEF",
                  color: "white",
                  marginLeft: "auto",
                }}
                className="btn btn-sm rounded-pill"
                onClick={() => writeGroupData()}
              >
                Create
              </button>
            </Box>
          </Modal>
        </div>

        <div className="chats-sub-headers">
          <Badge color="warning" variant="dot">
            <p
              onClick={() => prop.setConvoType("Direct")}
              className={
                prop.convoType === "Direct" ? " fw-bold" : "text-secondary"
              }
            >
              DIRECT
            </p>
          </Badge>
          <Badge color="warning" variant="dot">
            <p
              onClick={() => prop.setConvoType("Group")}
              className={
                prop.convoType === "Group" ? " fw-bold" : "text-secondary"
              }
            >
              GROUPS
            </p>
          </Badge>
        </div>

        <input
          style={{
            width: "85%",
            boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
          }}
          className="form-control ms-4 rounded-pill"
          type="search"
          placeholder="Search"
          aria-label="Search"
          defaultValue={search}
          onChange={(e) => handleChange(e)}
        />

        {prop.convoType === "Direct" ? (
          <div className="chats-all">
            {search
              ? filteredChats.map((chat) => {
                  return <Chatsmsg key={chat.id} chat={chat} />;
                })
              : prop.directChats.map((chat) => {
                  return <Chatsmsg key={chat.id} chat={chat} />;
                })}
          </div>
        ) : (
          <div className="chats-all">
            {prop.groupchats.map((chat) => {
              return <GroupMsg key={chat.id} chat={chat} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Chats;
