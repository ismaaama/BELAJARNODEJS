const express = require("express");

const app = express();

const PORT = 3000;

app.use(express.json());

app.use(express.static("public"));

let mahasiswa = [
  {
    id: 1,
    nama: "Aulia",
    nim: "230001",
    prodi: "Informatika",
  },
];

// ======================
// READ ALL
// ======================

app.get("/api/mahasiswa", (req, res) => {
  res.json(mahasiswa);
});

// ======================
// READ BY ID
// ======================

app.get("/api/mahasiswa/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const data = mahasiswa.find((item) => item.id === id);

  if (data) {
    res.json(data);
  } else {
    res.status(404).json({
      message: "Data tidak ditemukan",
    });
  }
});

// ======================
// CREATE
// ======================

app.post("/api/mahasiswa", (req, res) => {
  const data = {
    id: Date.now(),
    nama: req.body.nama,
    nim: req.body.nim,
    prodi: req.body.prodi,
  };

  mahasiswa.push(data);

  res.status(201).json(data);
});

// ======================
// UPDATE
// ======================

app.put("/api/mahasiswa/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const index = mahasiswa.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({
      message: "Data tidak ditemukan",
    });
  }

  mahasiswa[index] = {
    id,
    nama: req.body.nama,
    nim: req.body.nim,
    prodi: req.body.prodi,
  };

  res.json(mahasiswa[index]);
});

// ======================
// DELETE
// ======================

app.delete("/api/mahasiswa/:id", (req, res) => {
  const id = parseInt(req.params.id);

  mahasiswa = mahasiswa.filter((item) => item.id !== id);

  res.json({
    message: "Data berhasil dihapus",
  });
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});