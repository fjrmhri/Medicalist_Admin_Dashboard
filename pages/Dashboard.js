import React, { useEffect, useState } from "react";
import { realtimeDb } from "./firebaseConfig";
import { ref, get } from "firebase/database";
import styles from "../styles/Dashboard.module.css";
import { useRouter } from "next/router";

export default function Dashboard() {
  const router = useRouter();
  const [totalObat, setTotalObat] = useState(0);
  const [totalAlat, setTotalAlat] = useState(0);
  const [totalPenyakit, setTotalPenyakit] = useState(0);
  const [totalApotek, setTotalApotek] = useState(0);
  const [recentActivities, setRecentActivities] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  const obatRef = ref(realtimeDb, "obat");
  const alatRef = ref(realtimeDb, "alat");
  const penyakitRef = ref(realtimeDb, "penyakit");
  const apotekRef = ref(realtimeDb, "apotek");
  const activityRef = ref(realtimeDb, "userActivity");

  useEffect(() => {
    const fetchData = async () => {
      const obatSnapshot = await get(obatRef);
      if (obatSnapshot.exists()) {
        setTotalObat(Object.keys(obatSnapshot.val()).length);
      }

      const alatSnapshot = await get(alatRef);
      if (alatSnapshot.exists()) {
        setTotalAlat(Object.keys(alatSnapshot.val()).length);
      }

      const penyakitSnapshot = await get(penyakitRef);
      if (penyakitSnapshot.exists()) {
        setTotalPenyakit(Object.keys(penyakitSnapshot.val()).length);
      }

      const apotekSnapshot = await get(apotekRef);
      if (apotekSnapshot.exists()) {
        setTotalApotek(Object.keys(apotekSnapshot.val()).length);
      }

      const activitySnapshot = await get(activityRef);
      if (activitySnapshot.exists()) {
        const activityData = Object.keys(activitySnapshot.val()).map((key) => ({
          id: key,
          ...activitySnapshot.val()[key],
        }));
        setRecentActivities(activityData.slice(0, 5));
      }
    };

    fetchData();
  }, []);

  const handleNavigation = (path) => router.push(`/${path}`);
  const handleLogout = () => {
    // Add your logout logic here
    alert("Logged out");
    setShowPopup(false);
  };

  return (
    <div className={styles.container}>
      <header className={styles.navbar}>
        <h1 className={styles.logo}>MedicaList</h1>
        <div
          className={styles.settingsButton}
          onClick={() => setShowPopup(!showPopup)}
        >
          Settings
        </div>
        {showPopup && (
          <div className={styles.popup}>
            <button onClick={handleLogout}>Log Out</button>
          </div>
        )}
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
      <main className={styles.mainContent}>
        <h2 className={styles.header}>Dashboard</h2>

        <div className={styles.statsContainer}>
          <div className={styles.statCard}>
            <h3>Total Obat</h3>
            <p>{totalObat}</p>
          </div>

          <div className={styles.statCard}>
            <h3>Total Alat</h3>
            <p>{totalAlat}</p>
          </div>

          <div className={styles.statCard}>
            <h3>Total Penyakit</h3>
            <p>{totalPenyakit}</p>
          </div>

          <div className={styles.statCard}>
            <h3>Total Apotek</h3>
            <p>{totalApotek}</p>
          </div>
        </div>

        <div className={styles.activityContainer}>
          <h3>Recent Activities</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Activity</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {recentActivities.map((activity) => (
                <tr key={activity.id}>
                  <td>{activity.activityName}</td>
                  <td>{new Date(activity.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
