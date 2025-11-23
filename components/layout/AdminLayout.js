import React, { useState } from "react";
import { useRouter } from "next/router";
import {
  FiActivity,
  FiBox,
  FiCpu,
  FiMessageCircle,
  FiSettings,
  FiShoppingBag,
  FiThermometer,
  FiLogOut,
  FiMenu,
} from "react-icons/fi";
import styles from "../../styles/AdminLayout.module.css";

// Daftar menu utama yang digunakan seluruh halaman admin
const navItems = [
  { label: "Dashboard", href: "/Dashboard", icon: FiActivity },
  { label: "Penyakit", href: "/DaftarPenyakit", icon: FiThermometer },
  { label: "Obat", href: "/DaftarObat", icon: FiBox },
  { label: "Alat", href: "/DaftarAlat", icon: FiCpu },
  { label: "Apotek", href: "/DaftarApotek", icon: FiShoppingBag },
  { label: "Chat", href: "/Chat", icon: FiMessageCircle },
  { label: "Pengaturan", href: "/Setting", icon: FiSettings },
];

const AdminLayout = ({ title, description, children, actions }) => {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const handleLogout = () => {
    // Tidak ada sesi kompleks, cukup arahkan kembali ke halaman login
    router.push("/Login");
  };

  return (
    <div className={styles.shell}>
      <aside
        className={`${styles.sidebar} ${
          isSidebarOpen ? styles.sidebarOpen : ""
        }`}
      >
        <div className={styles.brand}>MedicaList</div>
        <nav className={styles.navigation}>
          {navItems.map(({ label, href, icon: Icon }) => {
            const isActive = router.pathname === href;
            return (
              <button
                key={href}
                className={`${styles.navButton} ${
                  isActive ? styles.navButtonActive : ""
                }`}
                onClick={() => {
                  router.push(href);
                  setIsSidebarOpen(false);
                }}
              >
                <Icon />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>
        <div className={styles.sidebarFooter}>
          <p>Versi 1.0</p>
          <p>© {new Date().getFullYear()} MedicaList</p>
        </div>
      </aside>

      <div className={styles.mainArea}>
        <header className={styles.topBar}>
          <button className={styles.menuButton} onClick={toggleSidebar}>
            <FiMenu />
          </button>
          <div>
            <h1>{title}</h1>
            {description && <p>{description}</p>}
          </div>
          <div className={styles.topBarActions}>
            {actions}
            <button className={styles.logoutButton} onClick={handleLogout}>
              <FiLogOut />
              <span>Keluar</span>
            </button>
          </div>
        </header>
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
