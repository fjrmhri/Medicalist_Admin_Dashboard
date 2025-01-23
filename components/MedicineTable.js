//MedicineTable.js

import React from 'react';

const MedicineTable = () => {
    const medicines = [
        { name: 'Amoxicillin', description: 'Antibiotik untuk infeksi bakteri', price: '35.000' },
        { name: 'Cetirizine', description: 'Antihistamin untuk alergi dan rhinitis', price: '20.000' },
        { name: 'Dexamethasone', description: 'Kortikosteroid untuk peradangan', price: '40.000' },
        { name: 'Ibuprofen', description: 'Anti-inflamasi nonsteroid', price: '40.000' },
        { name: 'Loratadine', description: 'Antihistamin untuk alergi', price: '18.000' },
    ];

    return (
        <div className="table-container">
            <button className="button">Tambah</button>
            <table className="table">
                <thead>
                    <tr>
                        <th>Nama Obat</th>
                        <th>Deskripsi</th>
                        <th>Harga</th>
                        <th>Edit</th>
                    </tr>
                </thead>
                <tbody>
                    {medicines.map((medicine, index) => (
                        <tr key={index}>
                            <td>{medicine.name}</td>
                            <td>{medicine.description}</td>
                            <td>{medicine.price}</td>
                            <td>
                                <button className="button edit">✏️</button>
                                <button className="button delete">🗑️</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MedicineTable;
