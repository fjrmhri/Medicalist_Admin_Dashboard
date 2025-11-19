import React from "react";
import AdminLayout from "../components/layout/AdminLayout";
import ResourceManager from "../components/resources/ResourceManager";

const fields = [
  { name: "nama", label: "Nama Penyakit", placeholder: "Contoh: Diabetes" },
  {
    name: "deskripsi",
    label: "Deskripsi",
    type: "textarea",
    placeholder: "Jelaskan ringkasan penyakit",
  },
  {
    name: "gejala",
    label: "Gejala",
    type: "textarea",
    placeholder: "Pisahkan dengan koma",
    isArray: true,
  },
  { name: "hargaPerawatan", label: "Biaya Perawatan", placeholder: "Rp 2.500.000" },
  { name: "penyebab", label: "Penyebab", placeholder: "Contoh: Resistensi insulin" },
  {
    name: "obatTerkait",
    label: "Obat Terkait",
    type: "textarea",
    placeholder: "Pisahkan dengan koma",
    isArray: true,
  },
];

const DaftarPenyakit = () => (
  <AdminLayout
    title="Daftar Penyakit"
    description="Kelola basis pengetahuan penyakit lengkap dengan gejala dan terapi."
  >
    <ResourceManager
      resourcePath="penyakit"
      resourceName="Penyakit"
      description="Berikan informasi penyakit yang akurat dan mudah dipahami pasien"
      fields={fields}
    />
  </AdminLayout>
);

export default DaftarPenyakit;
