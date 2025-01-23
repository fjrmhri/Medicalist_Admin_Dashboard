import React, { useEffect, useState } from "react";
import { realtimeDb } from "./firebaseConfig";
import { ref, set, get } from "firebase/database";
import styles from "../styles/DaftarObat.module.css";
import { useRouter } from "next/router";

export default function DaftarObat() {
  const [obat, setObat] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const router = useRouter();
  const [formData, setFormData] = useState({
    nama: "",
    deskripsi: "",
    dosis: "",
    harga: "",
    jenis: "",
    kategori: "",
  });

  const obatRef = ref(realtimeDb, "obat");

  const fetchData = async () => {
    const snapshot = await get(obatRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      const obatArray = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));
      setObat(obatArray);
    }
  };

  const handleAddOrUpdate = async () => {
    if (formData.nama && formData.deskripsi) {
      const obatId = isEditMode
        ? editingId
        : formData.nama.toLowerCase().replace(/\s/g, "");
      const obatRef = ref(realtimeDb, `obat/${obatId}`);
      await set(obatRef, { ...formData, id: obatId });
      setFormData({
        nama: "",
        deskripsi: "",
        dosis: "",
        harga: "",
        jenis: "",
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
      const obatDocRef = ref(realtimeDb, `obat/${id}`);
      await set(obatDocRef, null);
      fetchData();
    }
  };

  const handleEdit = (item) => {
    setFormData({
      nama: item.nama,
      deskripsi: item.deskripsi,
      dosis: item.dosis,
      harga: item.harga,
      jenis: item.jenis,
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
        <h2 className={styles.header}>Daftar Obat</h2>
        <button
          onClick={() => {
            setIsPopupVisible(true);
            setIsEditMode(false);
            setFormData({
              nama: "",
              deskripsi: "",
              dosis: "",
              harga: "",
              jenis: "",
              kategori: "",
            });
          }}
          className={styles.buttonAdd}
        >
          Tambah Obat
        </button>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nama Obat</th>
              <th>Deskripsi</th>
              <th>Dosis</th>
              <th>Harga</th>
              <th>Jenis</th>
              <th>Kategori</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {obat.map((item) => (
              <tr key={item.id}>
                <td>{item.nama}</td>
                <td>{item.deskripsi}</td>
                <td>{item.dosis}</td>
                <td>{item.harga}</td>
                <td>{item.jenis}</td>
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
            <h3>{isEditMode ? "Edit Obat" : "Tambah Obat"}</h3>
            <form>
              <input
                type="text"
                name="nama"
                placeholder="Nama Obat"
                value={formData.nama}
                onChange={handleInputChange}
                className={styles.input}
                disabled={isEditMode} // Disable nama field saat edit
              />
              <textarea
                name="deskripsi"
                placeholder="Deskripsi Obat"
                value={formData.deskripsi}
                onChange={handleInputChange}
                className={styles.input}
              ></textarea>
              <input
                type="text"
                name="dosis"
                placeholder="Dosis"
                value={formData.dosis}
                onChange={handleInputChange}
                className={styles.input}
              />
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
                name="jenis"
                placeholder="Jenis"
                value={formData.jenis}
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
