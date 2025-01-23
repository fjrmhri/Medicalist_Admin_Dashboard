import React, { useEffect, useState } from "react";
import { realtimeDb } from "./firebaseConfig";
import { ref, set, get } from "firebase/database";
import styles from "../styles/DaftarApotek.module.css";
import { useRouter } from "next/router";

export default function DaftarApotek() {
  const [apotek, setApotek] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    latitude: "",
    longitude: "",
    hours: "",
  });

  const apotekRef = ref(realtimeDb, "apotek");

  const fetchData = async () => {
    const snapshot = await get(apotekRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      const apotekArray = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));
      setApotek(apotekArray);
    }
  };

  const handleAddOrUpdate = async () => {
    if (formData.name && formData.address) {
      const apotekId = isEditMode
        ? editingId
        : formData.name.toLowerCase().replace(/\s/g, "");
      const apotekRef = ref(realtimeDb, `apotek/${apotekId}`);
      await set(apotekRef, { ...formData, id: apotekId });
      setFormData({
        name: "",
        address: "",
        phone: "",
        latitude: "",
        longitude: "",
        hours: "",
      });
      setIsPopupVisible(false);
      setIsEditMode(false);
      fetchData();
    } else {
      alert("Nama dan Alamat harus diisi");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      const apotekDocRef = ref(realtimeDb, `apotek/${id}`);
      await set(apotekDocRef, null);
      fetchData();
    }
  };

  const handleEdit = (item) => {
    setFormData({
      name: item.name,
      address: item.address,
      phone: item.phone,
      latitude: item.latitude,
      longitude: item.longitude,
      hours: item.hours,
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
        <h2 className={styles.header}>Daftar Apotek</h2>
        <button
          onClick={() => {
            setIsPopupVisible(true);
            setIsEditMode(false);
            setFormData({
              name: "",
              address: "",
              phone: "",
              latitude: "",
              longitude: "",
              hours: "",
            });
          }}
          className={styles.buttonAdd}
        >
          Tambah Apotek
        </button>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nama Apotek</th>
              <th>Alamat</th>
              <th>Telepon</th>
              <th>Latitude</th>
              <th>Longitude</th>
              <th>Jam Operasional</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {apotek.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.address}</td>
                <td>{item.phone}</td>
                <td>{item.latitude}</td>
                <td>{item.longitude}</td>
                <td>{item.hours}</td>
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
            <h3>{isEditMode ? "Edit Apotek" : "Tambah Apotek"}</h3>
            <form>
              <input
                type="text"
                name="name"
                placeholder="Nama Apotek"
                value={formData.name}
                onChange={handleInputChange}
                className={styles.input}
                disabled={isEditMode} // Disable nama field saat edit
              />
              <textarea
                name="address"
                placeholder="Alamat Apotek"
                value={formData.address}
                onChange={handleInputChange}
                className={styles.input}
              ></textarea>
              <input
                type="text"
                name="phone"
                placeholder="Telepon"
                value={formData.phone}
                onChange={handleInputChange}
                className={styles.input}
              />
              <input
                type="text"
                name="latitude"
                placeholder="Latitude"
                value={formData.latitude}
                onChange={handleInputChange}
                className={styles.input}
              />
              <input
                type="text"
                name="longitude"
                placeholder="Longitude"
                value={formData.longitude}
                onChange={handleInputChange}
                className={styles.input}
              />
              <input
                type="text"
                name="hours"
                placeholder="Jam Operasional"
                value={formData.hours}
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
