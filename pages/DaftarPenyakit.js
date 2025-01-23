import React, { useEffect, useState } from "react";
import { realtimeDb } from "./firebaseConfig";
import { ref, set, get } from "firebase/database";
import styles from "../styles/DaftarPenyakit.module.css";
import { useRouter } from "next/router";

export default function DaftarPenyakit() {
  const [penyakit, setPenyakit] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const router = useRouter();
  const [formData, setFormData] = useState({
    nama: "",
    deskripsi: "",
    gejala: [],
    hargaPerawatan: "",
    penyebab: "",
    obatTerkait: [],
  });

  const penyakitRef = ref(realtimeDb, "penyakit");

  const fetchData = async () => {
    const snapshot = await get(penyakitRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      const penyakitArray = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));
      setPenyakit(penyakitArray);
    }
  };

  const handleAddOrUpdate = async () => {
    if (formData.nama && formData.deskripsi) {
      const penyakitId = isEditMode ? editingId : formData.nama.toLowerCase();
      const penyakitRef = ref(realtimeDb, `penyakit/${penyakitId}`);
      await set(penyakitRef, formData);
      setFormData({
        nama: "",
        deskripsi: "",
        gejala: [],
        hargaPerawatan: "",
        penyebab: "",
        obatTerkait: [],
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
      const penyakitDocRef = ref(realtimeDb, `penyakit/${id}`);
      await set(penyakitDocRef, null);
      fetchData();
    }
  };

  const handleEdit = (item) => {
    setFormData({
      nama: item.nama,
      deskripsi: item.deskripsi,
      gejala: item.gejala,
      hargaPerawatan: item.hargaPerawatan,
      penyebab: item.penyebab,
      obatTerkait: item.obatTerkait,
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
            onClick={() => handleNavigation("Apotek")}
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
        <h2 className={styles.header}>Daftar Penyakit</h2>
        <button
          onClick={() => {
            setIsPopupVisible(true);
            setIsEditMode(false);
            setFormData({
              nama: "",
              deskripsi: "",
              gejala: [],
              hargaPerawatan: "",
              penyebab: "",
              obatTerkait: [],
            });
          }}
          className={styles.buttonAdd}
        >
          Tambah Penyakit
        </button>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nama Penyakit</th>
              <th>Deskripsi</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {penyakit.map((item) => (
              <tr key={item.id}>
                <td>{item.nama}</td>
                <td>{item.deskripsi}</td>
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
            <h3>{isEditMode ? "Edit Penyakit" : "Tambah Penyakit"}</h3>
            <form>
              <input
                type="text"
                name="nama"
                placeholder="Nama Penyakit"
                value={formData.nama}
                onChange={handleInputChange}
                className={styles.input}
                disabled={isEditMode} // Disable nama field saat edit
              />
              <textarea
                name="deskripsi"
                placeholder="Deskripsi Penyakit"
                value={formData.deskripsi}
                onChange={handleInputChange}
                className={styles.input}
              ></textarea>
              <input
                type="text"
                name="gejala"
                placeholder="Gejala (pisahkan dengan koma)"
                value={formData.gejala.join(",")}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    gejala: e.target.value.split(","),
                  }))
                }
                className={styles.input}
              />
              <input
                type="text"
                name="hargaPerawatan"
                placeholder="Harga Perawatan"
                value={formData.hargaPerawatan}
                onChange={handleInputChange}
                className={styles.input}
              />
              <input
                type="text"
                name="penyebab"
                placeholder="Penyebab"
                value={formData.penyebab}
                onChange={handleInputChange}
                className={styles.input}
              />
              <input
                type="text"
                name="obatTerkait"
                placeholder="Obat Terkait (pisahkan dengan koma)"
                value={formData.obatTerkait.join(",")}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    obatTerkait: e.target.value.split(","),
                  }))
                }
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
