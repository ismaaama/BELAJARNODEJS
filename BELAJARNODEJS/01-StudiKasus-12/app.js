// Menggunakan modul bawaan 'os' untuk melihat info komputer/server
const os = require('os');

console.log("======================================");
console.log("      STUDI KASUS 12: NODE.JS DASAR   ");
console.log("======================================");

// Menampilkan informasi dasar menggunakan Node.js
console.log(`Arsitektur CPU : ${os.arch()}`);
console.log(`Platform OS    : ${os.platform()}`);
console.log(`Total RAM      : ${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB`);
console.log("======================================");
console.log("Program Node.js berhasil dijalankan!");