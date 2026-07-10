// Memanggil modul bawaan 'http' dan modul lokal 'biodata'
const http = require('http');
const myModule = require('./biodata');

const PORT = 3000;

// Membuat HTTP Server
const server = http.createServer((req, res) => {
    // Mengatur header respons berupa teks HTML dengan format UTF-8
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    
    // Mengambil data dari biodata.js
    const data = myModule.ambilBiodata();

    // Menampilkan data tersebut ke halaman browser
    res.write(`<h2>Selamat Datang di HTTP Server Node.js</h2>`);
    res.write(`<p><b>Nama:</b> ${data.nama}</p>`);
    res.write(`<p><b>NIM:</b> ${data.nim}</p>`);
    res.write(`<p><b>Program Studi:</b> ${data.prodi}</p>`);
    res.write(`<p><b>Materi:</b> ${data.mata_kuliah} - Pertemuan ${data.pertemuan}</p>`);
    
    res.end(); // Mengakhiri respons
});

// Menjalankan server di port 3000
server.listen(PORT, () => {
    console.log(`Server Latihan Praktikum aktif di http://localhost:${PORT}`);
});