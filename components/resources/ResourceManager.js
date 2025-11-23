import React, { useEffect, useMemo, useState } from "react";
import { onValue, push, ref, remove, set } from "firebase/database";
import { FiEdit2, FiPlus, FiSearch, FiTrash2 } from "react-icons/fi";

import { realtimeDb } from "../../lib/firebase";
import Modal from "../ui/Modal";
import EmptyState from "../ui/EmptyState";
import styles from "../../styles/ResourceManager.module.css";

const buildDefaultState = (fields) =>
  fields.reduce((acc, field) => {
    acc[field.name] = field.isArray ? [] : field.defaultValue ?? "";
    return acc;
  }, {});

const ResourceManager = ({ resourcePath, resourceName, description, fields }) => {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState(() => buildDefaultState(fields));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState({ type: "idle", message: "" });

  useEffect(() => {
    // Tarik data resource dari Realtime Database dan dengarkan perubahan selanjutnya
    const resourceRef = ref(realtimeDb, resourcePath);
    const unsubscribe = onValue(
      resourceRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          setItems([]);
          return;
        }
        const data = snapshot.val();
        const parsed = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setItems(parsed.reverse());
      },
      (error) => {
        setStatus({ type: "error", message: error.message });
        console.error(`Gagal memuat ${resourceName}`, error);
      }
    );

    return () => unsubscribe();
  }, [resourcePath]);

  const tableFields = fields.filter((field) => field.showInTable !== false);

  const filteredItems = useMemo(() => {
    // Pencarian sederhana berbasis teks lintas kolom
    if (!searchQuery.trim()) return items;
    const query = searchQuery.toLowerCase();
    return items.filter((item) =>
      fields.some((field) => {
        const value = item[field.name];
        if (Array.isArray(value)) {
          return value.join(" ").toLowerCase().includes(query);
        }
        return String(value ?? "").toLowerCase().includes(query);
      })
    );
  }, [items, searchQuery, fields]);

  const openModal = (item = null) => {
    setEditingItem(item);
    if (item) {
      setFormData(
        fields.reduce((acc, field) => {
          const value = item[field.name];
          acc[field.name] = field.isArray ? value ?? [] : value ?? "";
          return acc;
        }, {})
      );
    } else {
      setFormData(buildDefaultState(fields));
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleChange = (field, rawValue) => {
    setFormData((prev) => ({
      ...prev,
      [field.name]: field.isArray
        ? rawValue
            .split(",")
            .map((value) => value.trim())
            .filter(Boolean)
        : rawValue,
    }));
  };

  const handleSave = async () => {
    try {
      setStatus({ type: "loading", message: "Menyimpan..." });
      const now = Date.now();
      if (editingItem) {
        const payload = {
          ...editingItem,
          ...formData,
          updatedAt: now,
        };
        await set(ref(realtimeDb, `${resourcePath}/${editingItem.id}`), payload);
      } else {
        const listRef = ref(realtimeDb, resourcePath);
        const newRef = push(listRef);
        const payload = {
          ...formData,
          id: newRef.key,
          createdAt: now,
          updatedAt: now,
        };
        await set(newRef, payload);
      }
      setStatus({ type: "success", message: `${resourceName} disimpan` });
      closeModal();
      setTimeout(() => setStatus({ type: "idle", message: "" }), 2000);
    } catch (error) {
      setStatus({ type: "error", message: error.message });
      setTimeout(() => setStatus({ type: "idle", message: "" }), 3000);
      console.error(`Gagal menyimpan ${resourceName}`, error);
    }
  };

  const handleDelete = async (itemId) => {
    const confirmed = window.confirm(
      `Hapus ${resourceName} ini secara permanen?`
    );
    if (!confirmed) return;
    try {
      await remove(ref(realtimeDb, `${resourcePath}/${itemId}`));
      setStatus({ type: "success", message: `${resourceName} dihapus` });
      setTimeout(() => setStatus({ type: "idle", message: "" }), 2000);
    } catch (error) {
      setStatus({ type: "error", message: error.message });
      setTimeout(() => setStatus({ type: "idle", message: "" }), 3000);
    }
  };

  const renderInput = (field) => {
    const commonProps = {
      id: field.name,
      name: field.name,
      placeholder: field.placeholder ?? field.label,
      value: field.isArray
        ? (formData[field.name] || []).join(", ")
        : formData[field.name] ?? "",
      onChange: (event) => handleChange(field, event.target.value),
      className: styles.input,
    };

    if (field.type === "textarea") {
      return <textarea {...commonProps} rows={field.rows ?? 4} />;
    }

    return <input type={field.type ?? "text"} {...commonProps} />;
  };

  return (
    <section className={styles.card}>
      <div className={styles.headerRow}>
        <div>
          <h2>{resourceName}</h2>
          {description && <p>{description}</p>}
        </div>
        <button className={styles.primaryButton} onClick={() => openModal()}>
          <FiPlus /> Tambah {resourceName}
        </button>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <FiSearch />
          <input
            type="search"
            placeholder={`Cari ${resourceName}...`}
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </div>
        {status.type !== "idle" && status.message && (
          <span
            className={`${styles.status} ${
              status.type === "error" ? styles.statusError : styles.statusInfo
            }`}
          >
            {status.message}
          </span>
        )}
      </div>

      {filteredItems.length === 0 ? (
        <EmptyState
          title={`Belum ada ${resourceName}`}
          actionLabel={`Tambah ${resourceName}`}
          onAction={() => openModal()}
        />
      ) : (
        <div className={styles.tableWrapper}>
          <table>
            <thead>
              <tr>
                {tableFields.map((field) => (
                  <th key={field.name}>{field.tableLabel ?? field.label}</th>
                ))}
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id}>
                  {tableFields.map((field) => {
                    const value = item[field.name];
                    const displayValue = Array.isArray(value)
                      ? value.join(", ")
                      : value || "-";
                    return <td key={field.name}>{displayValue}</td>;
                  })}
                  <td>
                    <div className={styles.actionCell}>
                      <button
                        className={styles.iconButton}
                        onClick={() => openModal(item)}
                        title="Edit"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        className={styles.iconButtonDanger}
                        onClick={() => handleDelete(item.id)}
                        title="Hapus"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        title={`${editingItem ? "Ubah" : "Tambah"} ${resourceName}`}
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handleSave}
        confirmLabel="Simpan"
      >
        <div className={styles.formGrid}>
          {fields.map((field) => (
            <label key={field.name} htmlFor={field.name}>
              <span>{field.label}</span>
              {renderInput(field)}
            </label>
          ))}
        </div>
      </Modal>
    </section>
  );
};

export default ResourceManager;
