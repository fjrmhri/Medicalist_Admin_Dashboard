import React, { useState, useEffect } from "react";
import { realtimeDb } from "./firebaseConfig";
import { ref, onValue, push, remove } from "firebase/database";
import styles from "../styles/Chat.module.css";
import { useRouter } from "next/router";

export default function Chat() {
  const router = useRouter();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const chatsRef = ref(realtimeDb, "chats");
    onValue(chatsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const chatList = Object.keys(data)
          .map((key) => {
            const chatData = data[key];
            const firstMessage = Object.values(chatData)[0];
            return {
              id: key,
              senderEmail: firstMessage.senderEmail || "No Email",
            };
          })
          .filter((chat) => chat.senderEmail !== "admin@example.com");
        setChats(chatList);
      } else {
        setChats([]);
      }
    });
  }, []);

  const selectChat = (chatId) => {
    setSelectedChat(chatId);
    const messagesRef = ref(realtimeDb, `chats/${chatId}`);
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const chatMessages = Object.entries(data).map(([id, message]) => ({
          id,
          ...message,
        }));
        setMessages(chatMessages);
      } else {
        setMessages([]);
      }
    });
  };

  const sendMessage = () => {
    if (newMessage.trim() === "") return;

    const messagesRef = ref(realtimeDb, `chats/${selectedChat}`);
    push(messagesRef, {
      text: newMessage,
      sender: "admin@example.com",
      timestamp: Date.now(),
    });
    setNewMessage("");
  };

  const deleteMessage = (messageId) => {
    const messageRef = ref(realtimeDb, `chats/${selectedChat}/${messageId}`);
    remove(messageRef);
  };

  const deleteChat = (chatId) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus chat ini?")) {
      const chatRef = ref(realtimeDb, `chats/${chatId}`);
      remove(chatRef);
      setSelectedChat(null);
      setMessages([]);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.navbar}>
        <h1 className={styles.logo}>MedicaList</h1>
      </header>

      <aside className={styles.sidebar}>
        <nav className={styles.menu}>
          <button
            className={styles.menuItem}
            onClick={() => router.push("/Dashboard")}
          >
            Dashboard
          </button>
          <button
            className={styles.menuItem}
            onClick={() => router.push("/DaftarPenyakit")}
          >
            Penyakit
          </button>
          <button
            className={styles.menuItem}
            onClick={() => router.push("/DaftarObat")}
          >
            Obat
          </button>
          <button
            className={styles.menuItem}
            onClick={() => router.push("/DaftarAlat")}
          >
            Alat
          </button>
          <button
            className={styles.menuItem}
            onClick={() => router.push("/DaftarApotek")}
          >
            Apotek
          </button>
          <button
            className={styles.menuItem}
            onClick={() => router.push("/Chat")}
          >
            Chat
          </button>
        </nav>
      </aside>
      <main className={styles.mainContent}>
        <h2 className={styles.header}>Chat</h2>
        <hr className={styles.horizontalLine} />
        <div className={styles.chatContainer}>
          <div className={styles.chatListContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Sender</th>
                </tr>
              </thead>
              <tbody>
                {chats.map((chat) => (
                  <tr key={chat.id} onClick={() => selectChat(chat.id)}>
                    <td>{chat.senderEmail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={styles.separator}></div>
          <div className={styles.chatSection}>
            {selectedChat ? (
              <>
                <div
                  className={styles.messagesContainer}
                  style={{ overflowY: "scroll", maxHeight: "450px" }}
                >
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={
                        message.sender === "admin@example.com"
                          ? styles.adminMessage
                          : styles.userMessage
                      }
                      onContextMenu={(e) => {
                        e.preventDefault();
                        if (
                          window.confirm(
                            "Apakah Anda yakin ingin menghapus pesan ini?"
                          )
                        ) {
                          deleteMessage(message.id);
                        }
                      }}
                    >
                      <p>{message.text}</p>
                    </div>
                  ))}
                </div>
                <div className={styles.inputContainer}>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Tulis pesan..."
                    className={styles.input}
                  />
                  <button onClick={sendMessage} className={styles.sendButton}>
                    Kirim
                  </button>
                </div>
              </>
            ) : (
              <p className={styles.noChatSelected}>
                Pilih chat untuk memulai percakapan
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
