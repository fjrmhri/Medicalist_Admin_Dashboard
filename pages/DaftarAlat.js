import React from "react";
import AdminLayout from "../components/layout/AdminLayout";
import ResourceManager from "../components/resources/ResourceManager";

const fields = [
  { name: "nama", label: "Nama Alat", placeholder: "Contoh: Stetoskop" },
  {
    name: "deskripsi",
    label: "Deskripsi",
    type: "textarea",
    placeholder: "Fungsi utama dan cara perawatan",
  },
  { name: "harga", label: "Harga", placeholder: "Rp 1.200.000" },
  { name: "kategori", label: "Kategori", placeholder: "Diagnostik" },
];

const DaftarAlat = () => (
  <AdminLayout
    title="Inventori Alat"
    description="Kelola alat kesehatan yang tersedia untuk mendukung pelayanan."
  >
    <ResourceManager
      resourcePath="alat"
      resourceName="Alat"
      description="Catat detail alat mulai dari harga, kegunaan hingga kategori"
      fields={fields}
    />
  </AdminLayout>
);

export default DaftarAlat;
