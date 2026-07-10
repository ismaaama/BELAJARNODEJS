const express = require("express"); //
const app = express(); //
const PORT = 3000; //

app.use(express.json()); //

// Data dummy Mahasiswa
let mahasiswa = [
    {
        id: 1,
        nama: "Andi",
        nim: "230001",
        prodi: "Informatika"
    }
]; //

// READ ALL
app.get("/api/mahasiswa", (req, res) => {
    res.json(mahasiswa); //
});

// CREATE
app.post("/api/mahasiswa", (req, res) => {
    const data = {
        id: Date.now(),
        nama: req.body.nama,
        nim: req.body.nim,
        prodi: req.body.prodi
    }; //
    mahasiswa.push(data); //
    res.status(201).json(data); //
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`); //
});