import React, { useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useRouter } from "next/router";
import { FiLock, FiMail } from "react-icons/fi";
import { firestoreDb } from "../lib/firebase";
import styles from "../styles/Login.module.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const q = query(
        collection(firestoreDb, "admin"),
        where("username", "==", username),
        where("password", "==", password)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        router.push("/Dashboard");
      } else {
        setError("Username atau password tidak valid");
      }
    } catch (err) {
      setError("Gagal terhubung ke server");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div>
          <p className={styles.tag}>MedicaList Admin</p>
          <h1>Masuk ke dashboard</h1>
          <p className={styles.subtitle}>
            Gunakan akun resmi untuk mengelola data medis.
          </p>
        </div>
        <form className={styles.form} onSubmit={handleLogin}>
          <label>
            <span>Username</span>
            <div className={styles.inputGroup}>
              <FiMail />
              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="admin@medicalist"
                required
              />
            </div>
          </label>
          <label>
            <span>Password</span>
            <div className={styles.inputGroup}>
              <FiLock />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••"
                required
              />
            </div>
          </label>
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Memverifikasi..." : "Masuk"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
