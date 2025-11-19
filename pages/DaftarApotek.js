import React from "react";
import AdminLayout from "../components/layout/AdminLayout";
import ResourceManager from "../components/resources/ResourceManager";

const fields = [
  { name: "name", label: "Nama Apotek", placeholder: "Apotek Sehat Sentosa" },
  {
    name: "address",
    label: "Alamat",
    type: "textarea",
    placeholder: "Jl. Medika No. 10, Jakarta",
  },
  { name: "phone", label: "Telepon", placeholder: "+62 812-xxxx" },
  { name: "latitude", label: "Latitude", placeholder: "-6.200" },
  { name: "longitude", label: "Longitude", placeholder: "106.816" },
  { name: "hours", label: "Jam Operasional", placeholder: "24 Jam" },
];

const DaftarApotek = () => (
  <AdminLayout
    title="Jaringan Apotek"
    description="Sediakan rujukan apotek terpercaya beserta detail kontaknya."
  >
    <ResourceManager
      resourcePath="apotek"
      resourceName="Apotek"
      description="Awasi data apotek agar pasien mudah menemukan penyedia obat"
      fields={fields}
    />
  </AdminLayout>
);

export default DaftarApotek;
