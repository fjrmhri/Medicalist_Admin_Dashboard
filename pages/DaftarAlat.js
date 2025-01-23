import React, { useEffect, useState } from "react";
import { realtimeDb } from "./firebaseConfig";
import { ref, set, get } from "firebase/database";
import styles from "../styles/DaftarAlat.module.css";
import { useRouter } from "next/router";

export default function DaftarAlat() {
  const [alat, setAlat] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const router = useRouter();
  const [formData, setFormData] = useState({
    nama: "",
    deskripsi: "",
    harga: "",
    kategori: "",
  });

  const alatRef = ref(realtimeDb, "alat");

  const fetchData = async () => {
    const snapshot = await get(alatRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      const alatArray = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));
      setAlat(alatArray);
    }
  };

  const handleAddOrUpdate = async () => {
    if (formData.nama && formData.deskripsi) {
      const alatId = isEditMode
        ? editingId
        : formData.nama.toLowerCase().replace(/\s/g, "");
      const alatRef = ref(realtimeDb, `alat/${alatId}`);
      await set(alatRef, { ...formData, id: alatId });
      setFormData({
        nama: "",
        deskripsi: "",
        harga: "",
        kategori: "",
      });
      setIsPopupVisible(false);
      setIsEditMode(false);
      fetchData();
    } else {
      alert("Nama dan Deskripsi harus diisi");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      const alatDocRef = ref(realtimeDb, `alat/${id}`);
      await set(alatDocRef, null);
      fetchData();
    }
  };

  const handleEdit = (item) => {
    setFormData({
      nama: item.nama,
      deskripsi: item.deskripsi,
      harga: item.harga,
      kategori: item.kategori,
    });
    setEditingId(item.id);
    setIsEditMode(true);
    setIsPopupVisible(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    fetchData();
  }, []);

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
      <main className={styles.mainContent}>
        <h2 className={styles.header}>Daftar Alat</h2>
        <button
          onClick={() => {
            setIsPopupVisible(true);
            setIsEditMode(false);
            setFormData({
              nama: "",
              deskripsi: "",
              harga: "",
              kategori: "",
            });
          }}
          className={styles.buttonAdd}
        >
          Tambah Alat
        </button>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nama Alat</th>
              <th>Deskripsi</th>
              <th>Harga</th>
              <th>Kategori</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {alat.map((item) => (
              <tr key={item.id}>
                <td>{item.nama}</td>
                <td>{item.deskripsi}</td>
                <td>{item.harga}</td>
                <td>{item.kategori}</td>
                <td>
                  <button
                    className={styles.buttonEdit}
                    onClick={() => handleEdit(item)}
                  >
                    Edit
                  </button>
                  <button
                    className={styles.buttonDelete}
                    onClick={() => handleDelete(item.id)}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
      {isPopupVisible && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <h3>{isEditMode ? "Edit Alat" : "Tambah Alat"}</h3>
            <form>
              <input
                type="text"
                name="nama"
                placeholder="Nama Alat"
                value={formData.nama}
                onChange={handleInputChange}
                className={styles.input}
                disabled={isEditMode} // Disable nama field saat edit
              />
              <textarea
                name="deskripsi"
                placeholder="Deskripsi Alat"
                value={formData.deskripsi}
                onChange={handleInputChange}
                className={styles.input}
              ></textarea>
              <input
                type="text"
                name="harga"
                placeholder="Harga"
                value={formData.harga}
                onChange={handleInputChange}
                className={styles.input}
              />
              <input
                type="text"
                name="kategori"
                placeholder="Kategori"
                value={formData.kategori}
                onChange={handleInputChange}
                className={styles.input}
              />
              <div className={styles.popupActions}>
                <button
                  type="button"
                  onClick={handleAddOrUpdate}
                  className={styles.buttonAdd}
                >
                  Simpan
                </button>
                <button
                  type="button"
                  onClick={() => setIsPopupVisible(false)}
                  className={styles.buttonCancel}
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
