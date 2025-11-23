import React, { useEffect, useState } from "react";
import { onValue, ref, set } from "firebase/database";

import AdminLayout from "../components/layout/AdminLayout";
import { realtimeDb } from "../lib/firebase";
import styles from "../styles/Settings.module.css";

const defaultSettings = {
  organization: "MedicaList",
  contactEmail: "support@medicalist.id",
  hotline: "+62 811-0000-911",
  supportHours: "24/7",
  theme: "light",
};

const Setting = () => {
  const [settings, setSettings] = useState(defaultSettings);
  const [status, setStatus] = useState({ state: "idle", message: "" });

  useEffect(() => {
    // Sinkronkan pengaturan umum agar selalu sesuai dengan Realtime Database
    const settingsRef = ref(realtimeDb, "settings/general");
    const unsubscribe = onValue(
      settingsRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setSettings((prev) => ({ ...prev, ...snapshot.val() }));
        }
      },
      (error) => {
        console.error("Gagal memuat pengaturan", error);
        setStatus({ state: "error", message: "Tidak bisa memuat pengaturan" });
      }
    );

    return () => unsubscribe();
  }, []);

  const handleChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      setStatus({ state: "saving", message: "Menyimpan..." });
      await set(ref(realtimeDb, "settings/general"), {
        ...settings,
        updatedAt: Date.now(),
      });
      setStatus({ state: "saved", message: "Perubahan disimpan" });
      setTimeout(() => setStatus({ state: "idle", message: "" }), 2000);
    } catch (error) {
      setStatus({ state: "error", message: "Gagal menyimpan" });
      setTimeout(() => setStatus({ state: "idle", message: "" }), 3000);
      console.error(error);
    }
  };

  return (
    <AdminLayout
      title="Pengaturan Sistem"
      description="Perbarui informasi organisasi, kontak, serta preferensi tampilan."
      actions={
        status.state !== "idle" && (
          <span
            className={`${styles.status} ${
              status.state === "error" ? styles.statusError : ""
            }`}
          >
            {status.message}
          </span>
        )
      }
    >
      <section className={styles.grid}>
        <article className={styles.card}>
          <h3>Identitas Organisasi</h3>
          <label>
            <span>Nama Organisasi</span>
            <input
              type="text"
              value={settings.organization}
              onChange={(event) => handleChange("organization", event.target.value)}
            />
          </label>
          <label>
            <span>Email Kontak</span>
            <input
              type="email"
              value={settings.contactEmail}
              onChange={(event) => handleChange("contactEmail", event.target.value)}
            />
          </label>
          <label>
            <span>Hotline Darurat</span>
            <input
              type="text"
              value={settings.hotline}
              onChange={(event) => handleChange("hotline", event.target.value)}
            />
          </label>
        </article>

        <article className={styles.card}>
          <h3>Preferensi Layanan</h3>
          <label>
            <span>Jam Layanan</span>
            <input
              type="text"
              value={settings.supportHours}
              onChange={(event) => handleChange("supportHours", event.target.value)}
            />
          </label>
          <label>
            <span>Tema Dashboard</span>
            <select
              value={settings.theme}
              onChange={(event) => handleChange("theme", event.target.value)}
            >
              <option value="light">Terang</option>
              <option value="dark">Gelap</option>
            </select>
          </label>
          <button onClick={handleSave} className={styles.saveButton}>
            Simpan Pengaturan
          </button>
        </article>
      </section>
    </AdminLayout>
  );
};

export default Setting;
