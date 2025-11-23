import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { onValue, ref } from "firebase/database";
import {
  FiActivity,
  FiCpu,
  FiHome,
  FiLayers,
  FiShield,
} from "react-icons/fi";

import AdminLayout from "../components/layout/AdminLayout";
import { realtimeDb } from "../lib/firebase";
import styles from "../styles/Dashboard.module.css";

const metricConfig = [
  { key: "obat", label: "Data Obat", icon: FiLayers, accent: "#4c6ef5" },
  { key: "alat", label: "Data Alat", icon: FiCpu, accent: "#22b8cf" },
  { key: "penyakit", label: "Data Penyakit", icon: FiShield, accent: "#fd7e14" },
  { key: "apotek", label: "Jaringan Apotek", icon: FiHome, accent: "#10b981" },
];

const Dashboard = () => {
  const [counts, setCounts] = useState({
    obat: 0,
    alat: 0,
    penyakit: 0,
    apotek: 0,
  });
  const [activities, setActivities] = useState([]);
  const [status, setStatus] = useState({ type: "idle", message: "" });

  useEffect(() => {
    // Dengarkan perubahan setiap resource untuk menghitung ringkasan cepat
    const resources = ["obat", "alat", "penyakit", "apotek"];
    const unsubscribers = resources.map((resource) => {
      const resourceRef = ref(realtimeDb, resource);
      return onValue(
        resourceRef,
        (snapshot) => {
          const total = snapshot.exists()
            ? Object.keys(snapshot.val()).length
            : 0;
          setCounts((prev) => ({ ...prev, [resource]: total }));
        },
        (error) => {
          console.error("Gagal memuat ringkasan resource", error);
          setStatus({ type: "error", message: "Tidak bisa memuat data" });
        }
      );
    });

    const activityUnsub = onValue(
      ref(realtimeDb, "userActivity"),
      (snapshot) => {
        if (!snapshot.exists()) {
          setActivities([]);
          return;
        }
        const parsed = Object.entries(snapshot.val())
          .map(([id, value]) => ({ id, ...value }))
          .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        setActivities(parsed.slice(0, 6));
      },
      (error) => {
        console.error("Gagal memuat aktivitas terbaru", error);
        setStatus({ type: "error", message: "Tidak bisa memuat aktivitas" });
      }
    );

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
      activityUnsub();
    };
  }, []);

  const totalRecords = counts.obat + counts.alat + counts.penyakit + counts.apotek;

  // Gunakan memo agar perhitungan insight tidak memicu render ulang yang tidak perlu
  const insights = useMemo(
    () => [
      {
        title: "Total Data",
        value: totalRecords,
        helper: "Gabungan seluruh entitas",
      },
      {
        title: "Aktivitas Terbaru",
        value: activities.length,
        helper: "Catatan 24 jam terakhir",
      },
      {
        title: "Rasio Obat/Alat",
        value: `${counts.alat ? (counts.obat / counts.alat).toFixed(1) : counts.obat}x`,
        helper: "Patokan stok dan logistik",
      },
    ],
    [totalRecords, activities.length, counts.obat, counts.alat]
  );

  const quickActions = [
    { label: "Tambah Obat", path: "/DaftarObat" },
    { label: "Tambah Penyakit", path: "/DaftarPenyakit" },
    { label: "Tambah Apotek", path: "/DaftarApotek" },
  ];

  return (
    <AdminLayout
      title="Dasbor MedicaList"
      description="Ringkasan operasional aplikasi kesehatan Anda dalam satu layar."
      actions=
        status.type !== "idle" && status.message ? (
          <span
            className={`${styles.statusMessage} ${
              status.type === "error" ? styles.statusMessageError : ""
            }`}
          >
            {status.message}
          </span>
        ) : null
    >
      <section className={styles.metrics}>
        {metricConfig.map(({ key, label, icon: Icon, accent }) => (
          <article key={key} className={styles.metricCard}>
            <div className={styles.iconBubble} style={{ background: accent }}>
              <Icon />
            </div>
            <div>
              <p>{label}</p>
              <h3>{counts[key]}</h3>
            </div>
          </article>
        ))}
      </section>

      <section className={styles.columns}>
        <article className={styles.activityCard}>
          <div className={styles.cardHeader}>
            <div>
              <h3>Aktivitas Terkini</h3>
              <p>Pantau perubahan terakhir pada basis data.</p>
            </div>
            <FiActivity />
          </div>
          {activities.length === 0 ? (
            <p className={styles.emptyCopy}>Belum ada aktivitas tercatat.</p>
          ) : (
            <ul className={styles.activityList}>
              {activities.map((activity) => (
                <li key={activity.id}>
                  <div>
                    <strong>{activity.activityName || "Aktivitas"}</strong>
                    <span>{activity.user || "System"}</span>
                  </div>
                  <span className={styles.timestamp}>
                    {new Date(activity.timestamp || Date.now()).toLocaleString("id-ID", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </article>
        <article className={styles.summaryCard}>
          <h3>Insight Operasional</h3>
          <div className={styles.insightGrid}>
            {insights.map((insight) => (
              <div key={insight.title} className={styles.insightItem}>
                <small>{insight.title}</small>
                <strong>{insight.value}</strong>
                <p>{insight.helper}</p>
              </div>
            ))}
          </div>
          <div className={styles.quickActions}>
            {quickActions.map((action) => (
              <Link key={action.label} href={action.path}>
                {action.label}
              </Link>
            ))}
          </div>
        </article>
      </section>

      <section className={styles.highlightCard}>
        <h3>Kinerja Basis Data</h3>
        <p>
          Total {totalRecords} entri aktif. Pastikan setiap data divalidasi secara
          berkala untuk menjaga kualitas layanan pasien.
        </p>
      </section>
    </AdminLayout>
  );
};

export default Dashboard;
