import React from "react";
import AdminLayout from "../components/layout/AdminLayout";
import ResourceManager from "../components/resources/ResourceManager";

const fields = [
  { name: "nama", label: "Nama Obat", placeholder: "Contoh: Amoxicillin" },
  {
    name: "deskripsi",
    label: "Deskripsi",
    type: "textarea",
    placeholder: "Ringkasan kegunaan dan peringatan",
  },
  { name: "dosis", label: "Dosis", placeholder: "3x sehari" },
  { name: "harga", label: "Harga", placeholder: "Rp 50.000" },
  { name: "jenis", label: "Jenis", placeholder: "Tablet/Kapsul" },
  { name: "kategori", label: "Kategori", placeholder: "Antibiotik" },
];

const DaftarObat = () => (
  <AdminLayout
    title="Manajemen Obat"
    description="Atur data obat lengkap dengan dosis, harga, serta kategorinya."
  >
    <ResourceManager
      resourcePath="obat"
      resourceName="Obat"
      description="Pastikan seluruh obat yang tersedia di aplikasi selalu terbaru"
      fields={fields}
    />
  </AdminLayout>
);

export default DaftarObat;
