//ChatAdmin.js

import React, { useState, useEffect } from "react";
import { getDatabase, ref, onValue, push } from "firebase/database";

const ChatAdmin = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");

  useEffect(() => {
    const db = getDatabase();
    const chatsRef = ref(db, "chats");
    onValue(chatsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setChats(Object.entries(data));
      }
    });
  }, []);

  const handleReply = () => {
    if (!replyMessage.trim() || !selectedChat) return;

    const db = getDatabase();
    const chatRef = ref(db, `chats/${selectedChat[0]}`);
    push(chatRef, {
      text: replyMessage,
      sender: "admin",
      timestamp: Date.now(),
    });
    setReplyMessage("");
  };

  const styles = {
    container: {
      padding: "20px",
      display: "flex",
      flexDirection: "column",
    },
    wrapper: {
      display: "flex",
      gap: "20px",
    },
    chatList: {
      width: "30%",
      border: "1px solid #ccc",
      padding: "10px",
    },
    chatListUl: {
      listStyle: "none",
      padding: "0",
    },
    chatListItem: {
      padding: "10px",
      borderBottom: "1px solid #eee",
      cursor: "pointer",
    },
    chatListItemHover: {
      backgroundColor: "#f0f0f0",
    },
    chatWindow: {
      flex: 1,
      border: "1px solid #ccc",
      padding: "10px",
      display: "flex",
      flexDirection: "column",
    },
    chatMessages: {
      flex: 1,
      overflowY: "auto",
      marginBottom: "10px",
    },
    chatMessage: {
      padding: "5px",
      marginBottom: "5px",
      borderRadius: "5px",
    },
    userMessage: {
      backgroundColor: "#e0f7fa",
      alignSelf: "flex-start",
    },
    adminMessage: {
      backgroundColor: "#d1c4e9",
      alignSelf: "flex-end",
    },
    replySection: {
      display: "flex",
      gap: "10px",
    },
    replyInput: {
      flex: 1,
      padding: "10px",
    },
    replyButton: {
      padding: "10px 20px",
      backgroundColor: "#007bff",
      color: "white",
      border: "none",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.container}>
      <h2>Chat dengan Pengguna</h2>
      <div style={styles.wrapper}>
        <div style={styles.chatList}>
          <h3>Daftar Chat</h3>
          <ul style={styles.chatListUl}>
            {chats.map(([chatId, messages]) => (
              <li
                key={chatId}
                style={styles.chatListItem}
                onClick={() => setSelectedChat([chatId, messages])}
              >
                Chat ID: {chatId}
              </li>
            ))}
          </ul>
        </div>
        <div style={styles.chatWindow}>
          {selectedChat ? (
            <>
              <h3>Chat ID: {selectedChat[0]}</h3>
              <div style={styles.chatMessages}>
                {Object.values(selectedChat[1]).map((msg, index) => (
                  <div
                    key={index}
                    style={{
                      ...styles.chatMessage,
                      ...(msg.sender === "admin"
                        ? styles.adminMessage
                        : styles.userMessage),
                    }}
                  >
                    <p>
                      <strong>{msg.sender}:</strong> {msg.text}
                    </p>
                  </div>
                ))}
              </div>
              <div style={styles.replySection}>
                <input
                  type="text"
                  placeholder="Ketik balasan..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  style={styles.replyInput}
                />
                <button onClick={handleReply} style={styles.replyButton}>
                  Kirim
                </button>
              </div>
            </>
          ) : (
            <p>Pilih chat untuk melihat pesan</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatAdmin;
