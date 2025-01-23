import React, { useEffect, useState } from "react";
import { realtimeDb } from "./firebaseConfig";
import { ref, get } from "firebase/database";
import styles from "../styles/Dashboard.module.css";
import { useRouter } from "next/router";

export default function Dashboard() {
  const router = useRouter();

  const handleNavigation = (path) => router.push(`/${path}`);

  return (
    <div className={styles.container}>
      <header className={styles.navbar}>
        <h1 className={styles.logo}>MedicaList</h1>
      </header>
      <aside className={styles.sidebar}>
        <nav className={styles.menu}>
          <button
            className={styles.menuItem}
            onClick={() => handleNavigation("Dashboard")}
          >
            Dashboard
          </button>
          <button
            className={styles.menuItem}
            onClick={() => handleNavigation("DaftarPenyakit")}
          >
            Penyakit
          </button>
          <button
            className={styles.menuItem}
            onClick={() => handleNavigation("DaftarObat")}
          >
            Obat
          </button>
          <button
            className={styles.menuItem}
            onClick={() => handleNavigation("DaftarAlat")}
          >
            Alat
          </button>
          <button
            className={styles.menuItem}
            onClick={() => handleNavigation("DaftarApotek")}
          >
            Apotek
          </button>
          <button
            className={styles.menuItem}
            onClick={() => handleNavigation("Chat")}
          >
            Chat
          </button>
        </nav>
      </aside>
    </div>
  );
}
