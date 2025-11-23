import React, { useEffect, useMemo, useState } from "react";
import { onValue, push, ref, remove } from "firebase/database";
import { FiSearch, FiSend, FiTrash2 } from "react-icons/fi";

import AdminLayout from "../components/layout/AdminLayout";
import { realtimeDb } from "../lib/firebase";
import styles from "../styles/Chat.module.css";

const ADMIN_EMAIL = "admin@example.com";

const Chat = () => {
  const [conversations, setConversations] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState({ type: "idle", message: "" });

  useEffect(() => {
    // Dengarkan daftar percakapan agar admin selalu melihat permintaan terbaru
    const chatsRef = ref(realtimeDb, "chats");
    const unsubscribe = onValue(
      chatsRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          setConversations([]);
          return;
        }
        const data = snapshot.val();
        const list = Object.entries(data)
          .map(([id, messages]) => {
            const orderedMessages = Object.values(messages).sort(
              (a, b) => (a.timestamp || 0) - (b.timestamp || 0)
            );
            const firstMessage = orderedMessages[0];
            const lastMessage = orderedMessages[orderedMessages.length - 1];
            return {
              id,
              senderEmail: firstMessage?.senderEmail || firstMessage?.sender || "Pengguna",
              lastMessage: lastMessage?.text || "",
              lastTimestamp: lastMessage?.timestamp || 0,
            };
          })
          .filter((chat) => chat.senderEmail !== ADMIN_EMAIL)
          .sort((a, b) => b.lastTimestamp - a.lastTimestamp);

        setConversations(list);
        setActiveChatId((prev) => prev ?? list[0]?.id ?? null);
        setStatus({ type: "idle", message: "" });
      },
      (error) => {
        console.error("Gagal memuat percakapan", error);
        setStatus({ type: "error", message: "Tidak bisa memuat percakapan" });
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!activeChatId) {
      setMessages([]);
      return undefined;
    }
    // Dengarkan pesan dalam percakapan terpilih secara real-time
    const messagesRef = ref(realtimeDb, `chats/${activeChatId}`);
    const unsubscribe = onValue(
      messagesRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          setMessages([]);
          return;
        }
        const parsed = Object.entries(snapshot.val())
          .map(([id, value]) => ({ id, ...value }))
          .sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
        setMessages(parsed);
      },
      (error) => {
        console.error("Gagal memuat pesan", error);
        setStatus({ type: "error", message: "Tidak bisa memuat pesan" });
      }
    );

    return () => unsubscribe();
  }, [activeChatId]);

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    const query = searchQuery.toLowerCase();
    return conversations.filter((conversation) =>
      conversation.senderEmail.toLowerCase().includes(query)
    );
  }, [conversations, searchQuery]);

  const sendMessage = async () => {
    if (!activeChatId || !newMessage.trim()) return;
    try {
      const messagesRef = ref(realtimeDb, `chats/${activeChatId}`);
      await push(messagesRef, {
        text: newMessage,
        sender: ADMIN_EMAIL,
        senderEmail: ADMIN_EMAIL,
        timestamp: Date.now(),
      });
      setNewMessage("");
      setStatus({ type: "info", message: "Pesan terkirim" });
      setTimeout(() => setStatus({ type: "idle", message: "" }), 1500);
    } catch (error) {
      console.error("Gagal mengirim pesan", error);
      setStatus({ type: "error", message: "Pesan gagal dikirim" });
    }
  };

  const deleteConversation = async (chatId) => {
    const confirmed = window.confirm("Hapus percakapan ini?");
    if (!confirmed) return;
    try {
      await remove(ref(realtimeDb, `chats/${chatId}`));
      if (chatId === activeChatId) {
        setActiveChatId(null);
      }
      setStatus({ type: "info", message: "Percakapan dihapus" });
      setTimeout(() => setStatus({ type: "idle", message: "" }), 1500);
    } catch (error) {
      console.error("Gagal menghapus percakapan", error);
      setStatus({ type: "error", message: "Tidak bisa menghapus percakapan" });
    }
  };

  const deleteMessage = async (messageId) => {
    if (!activeChatId) return;
    try {
      await remove(ref(realtimeDb, `chats/${activeChatId}/${messageId}`));
    } catch (error) {
      console.error("Gagal menghapus pesan", error);
      setStatus({ type: "error", message: "Tidak bisa menghapus pesan" });
    }
  };

  return (
    <AdminLayout
      title="Inbox Konsultasi"
      description="Pantau dan balas pesan pasien secara real-time."
      actions={
        status.message && status.type !== "idle" ? (
          <span
            className={`${styles.statusMessage} ${
              status.type === "error" ? styles.statusMessageError : ""
            }`}
          >
            {status.message}
          </span>
        ) : null
      }
    >
      <div className={styles.chatShell}>
        <section className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h3>Semua Pesan</h3>
            <div className={styles.searchBox}>
              <FiSearch />
              <input
                type="search"
                placeholder="Cari pasien"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </div>
          </div>
          <div className={styles.conversationList}>
            {filteredConversations.length === 0 ? (
              <p className={styles.emptyCopy}>Belum ada percakapan.</p>
            ) : (
              filteredConversations.map((conversation) => (
                <button
                  key={conversation.id}
                  className={`${styles.conversationItem} ${
                    conversation.id === activeChatId ? styles.conversationActive : ""
                  }`}
                  onClick={() => setActiveChatId(conversation.id)}
                >
                  <div>
                    <strong>{conversation.senderEmail}</strong>
                    <p>{conversation.lastMessage || "Pesan baru"}</p>
                  </div>
                  <FiTrash2
                    className={styles.deleteIcon}
                    onClick={(event) => {
                      event.stopPropagation();
                      deleteConversation(conversation.id);
                    }}
                  />
                </button>
              ))
            )}
          </div>
        </section>

        <section className={styles.thread}>
          {activeChatId ? (
            <>
              <div className={styles.messages}>
                {messages.length === 0 ? (
                  <p className={styles.emptyCopy}>Mulai percakapan dengan pasien.</p>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`${styles.message} ${
                        message.sender === ADMIN_EMAIL
                          ? styles.messageAdmin
                          : styles.messageUser
                      }`}
                      onDoubleClick={() => deleteMessage(message.id)}
                    >
                      <p>{message.text}</p>
                      <span>
                        {new Date(message.timestamp || Date.now()).toLocaleString(
                          "id-ID",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </span>
                    </div>
                  ))
                )}
              </div>
              <div className={styles.inputBar}>
                <input
                  type="text"
                  placeholder="Tulis pesan balasan..."
                  value={newMessage}
                  onChange={(event) => setNewMessage(event.target.value)}
                  onKeyDown={(event) => event.key === "Enter" && sendMessage()}
                />
                <button onClick={sendMessage}>
                  <FiSend />
                  Kirim
                </button>
              </div>
            </>
          ) : (
            <div className={styles.emptyState}>
              <h3>Pilih percakapan</h3>
              <p>Tap salah satu pasien untuk mulai membalas pesan.</p>
            </div>
          )}
        </section>
      </div>
    </AdminLayout>
  );
};

export default Chat;
