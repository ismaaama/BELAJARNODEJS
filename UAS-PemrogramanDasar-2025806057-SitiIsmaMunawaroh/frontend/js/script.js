const API_URL = 'http://localhost:5000/api';

// ============================
// UTILITY FUNCTIONS
// ============================
function showLoading() {
    document.getElementById('loadingSpinner').classList.add('active');
}

function hideLoading() {
    document.getElementById('loadingSpinner').classList.remove('active');
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function openModal(id) {
    document.getElementById(id).classList.add('active');
}

function closeModal(id) {
    document.getElementById(id).classList.remove('active');
}

function formatDate(dateStr) {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ============================
// TAB SWITCHING
// ============================
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.dataset.tab).classList.add('active');

        if (btn.dataset.tab === 'dashboard') loadStatistik();
        if (btn.dataset.tab === 'buku') loadBuku();
        if (btn.dataset.tab === 'anggota') loadAnggota();
        if (btn.dataset.tab === 'peminjaman') loadPeminjaman();
    });
});

// ============================
// MODAL CLOSE HANDLERS
// ============================
document.querySelectorAll('.modal-close, [data-modal]').forEach(el => {
    el.addEventListener('click', () => closeModal(el.dataset.modal));
});

window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});

// ============================
// DARK MODE
// ============================
const darkModeToggle = document.getElementById('darkModeToggle');
let isDarkMode = false;

darkModeToggle.addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode', isDarkMode);
    darkModeToggle.textContent = isDarkMode ? '☀️' : '🌙';
});

// ============================
// DASHBOARD - STATISTIK
// ============================
async function loadStatistik() {
    try {
        showLoading();
        const res = await fetch(`${API_URL}/peminjaman/statistik`);
        const result = await res.json();
        if (result.success) {
            const data = result.data;
            document.getElementById('statTotalBuku').textContent = data.total_buku;
            document.getElementById('statTotalAnggota').textContent = data.total_anggota;
            document.getElementById('statDipinjam').textContent = data.total_dipinjam;
            document.getElementById('statDikembalikan').textContent = data.total_dikembalikan;
        }
    } catch (err) {
        showToast('Gagal memuat statistik', 'error');
        console.error(err);
    } finally {
        hideLoading();
    }
}

// ============================
// BUKU - CRUD
// ============================
let allBuku = [];
let allKategori = [];

async function loadKategori() {
    try {
        const res = await fetch(`${API_URL}/buku/kategori`);
        const result = await res.json();
        if (result.success) {
            allKategori = result.data;
            const filterSelect = document.getElementById('filterKategori');
            const formSelect = document.getElementById('kategoriBuku');
            filterSelect.innerHTML = '<option value="">Semua Kategori</option>';
            formSelect.innerHTML = '<option value="">-- Pilih Kategori --</option>';
            allKategori.forEach(k => {
                filterSelect.innerHTML += `<option value="${k.id_kategori}">${k.nama_kategori}</option>`;
                formSelect.innerHTML += `<option value="${k.id_kategori}">${k.nama_kategori}</option>`;
            });
        }
    } catch (err) {
        console.error(err);
    }
}

async function loadBuku() {
    try {
        showLoading();
        const res = await fetch(`${API_URL}/buku`);
        const result = await res.json();
        if (result.success) {
            allBuku = result.data;
            renderBuku(allBuku);
        }
    } catch (err) {
        showToast('Gagal memuat data buku', 'error');
        console.error(err);
    } finally {
        hideLoading();
    }
}

function renderBuku(data) {
    const tbody = document.getElementById('bukuTableBody');
    if (data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 30px;">Belum ada data buku</td></tr>`;
        return;
    }
    tbody.innerHTML = data.map(b => `
        <tr>
            <td>${b.gambar_sampul ? `<img src="http://localhost:5000/uploads/${b.gambar_sampul}" class="book-cover">` : '📕'}</td>
            <td>${b.judul}</td>
            <td>${b.penulis}</td>
            <td>${b.nama_kategori || '-'}</td>
            <td>${b.tahun_terbit || '-'}</td>
            <td>${b.stok}</td>
            <td>
                <button class="btn-edit" onclick="editBuku(${b.id_buku})">✏️ Edit</button>
                <button class="btn-delete" onclick="deleteBuku(${b.id_buku})">🗑️ Hapus</button>
            </td>
        </tr>
    `).join('');
}

document.getElementById('searchBuku').addEventListener('input', filterBuku);
document.getElementById('filterKategori').addEventListener('change', filterBuku);

function filterBuku() {
    const keyword = document.getElementById('searchBuku').value.toLowerCase();
    const kategori = document.getElementById('filterKategori').value;
    let filtered = allBuku.filter(b =>
        (b.judul.toLowerCase().includes(keyword) || b.penulis.toLowerCase().includes(keyword)) &&
        (kategori === '' || b.id_kategori == kategori)
    );
    renderBuku(filtered);
}

document.getElementById('addBukuBtn').addEventListener('click', () => {
    document.getElementById('formBuku').reset();
    document.getElementById('bukuId').value = '';
    document.getElementById('gambarLama').value = '';
    document.getElementById('modalBukuTitle').textContent = 'Tambah Buku';
    openModal('modalBuku');
});

window.editBuku = (id) => {
    const b = allBuku.find(x => x.id_buku === id);
    if (!b) return;
    document.getElementById('bukuId').value = b.id_buku;
    document.getElementById('judul').value = b.judul;
    document.getElementById('penulis').value = b.penulis;
    document.getElementById('penerbit').value = b.penerbit || '';
    document.getElementById('tahunTerbit').value = b.tahun_terbit || '';
    document.getElementById('kategoriBuku').value = b.id_kategori || '';
    document.getElementById('stok').value = b.stok;
    document.getElementById('gambarLama').value = b.gambar_sampul || '';
    document.getElementById('modalBukuTitle').textContent = 'Edit Buku';
    openModal('modalBuku');
};

window.deleteBuku = async (id) => {
    if (!confirm('Yakin mau hapus buku ini?')) return;
    try {
        showLoading();
        const res = await fetch(`${API_URL}/buku/${id}`, { method: 'DELETE' });
        const result = await res.json();
        if (result.success) {
            showToast('Buku berhasil dihapus');
            loadBuku();
        } else {
            showToast(result.message, 'error');
        }
    } catch (err) {
        showToast('Gagal menghapus buku', 'error');
        console.error(err);
    } finally {
        hideLoading();
    }
};

document.getElementById('formBuku').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('bukuId').value;

    const formData = new FormData();
    formData.append('judul', document.getElementById('judul').value.trim());
    formData.append('penulis', document.getElementById('penulis').value.trim());
    formData.append('penerbit', document.getElementById('penerbit').value.trim());
    formData.append('tahun_terbit', document.getElementById('tahunTerbit').value);
    formData.append('id_kategori', document.getElementById('kategoriBuku').value);
    formData.append('stok', document.getElementById('stok').value);
    formData.append('gambar_lama', document.getElementById('gambarLama').value);

    const fileInput = document.getElementById('gambarSampul');
    if (fileInput.files[0]) {
        formData.append('gambar_sampul', fileInput.files[0]);
    }

    try {
        showLoading();
        const url = id ? `${API_URL}/buku/${id}` : `${API_URL}/buku`;
        const method = id ? 'PUT' : 'POST';
        const res = await fetch(url, { method, body: formData });
        const result = await res.json();

        if (result.success) {
            showToast(id ? 'Buku berhasil diupdate' : 'Buku berhasil ditambahkan');
            closeModal('modalBuku');
            loadBuku();
        } else {
            showToast(result.message, 'error');
        }
    } catch (err) {
        showToast('Terjadi kesalahan', 'error');
        console.error(err);
    } finally {
        hideLoading();
    }
});

// Export CSV
document.getElementById('exportBukuBtn').addEventListener('click', () => {
    if (allBuku.length === 0) {
        showToast('Tidak ada data untuk diexport', 'error');
        return;
    }
    let csv = 'Judul,Penulis,Penerbit,Tahun,Kategori,Stok\n';
    allBuku.forEach(b => {
        csv += `"${b.judul}","${b.penulis}","${b.penerbit || ''}","${b.tahun_terbit || ''}","${b.nama_kategori || ''}","${b.stok}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'data_buku.csv';
    link.click();
    showToast('Data buku berhasil diexport');
});

// ============================
// ANGGOTA - CRUD
// ============================
let allAnggota = [];

async function loadAnggota() {
    try {
        showLoading();
        const res = await fetch(`${API_URL}/anggota`);
        const result = await res.json();
        if (result.success) {
            allAnggota = result.data;
            renderAnggota(allAnggota);
        }
    } catch (err) {
        showToast('Gagal memuat data anggota', 'error');
        console.error(err);
    } finally {
        hideLoading();
    }
}

function renderAnggota(data) {
    const tbody = document.getElementById('anggotaTableBody');
    if (data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 30px;">Belum ada data anggota</td></tr>`;
        return;
    }
    tbody.innerHTML = data.map(a => `
        <tr>
            <td>${a.nama}</td>
            <td>${a.email}</td>
            <td>${a.no_hp || '-'}</td>
            <td>${a.alamat || '-'}</td>
            <td>
                <button class="btn-edit" onclick="editAnggota(${a.id_anggota})">✏️ Edit</button>
                <button class="btn-delete" onclick="deleteAnggota(${a.id_anggota})">🗑️ Hapus</button>
            </td>
        </tr>
    `).join('');
}

document.getElementById('searchAnggota').addEventListener('input', () => {
    const keyword = document.getElementById('searchAnggota').value.toLowerCase();
    const filtered = allAnggota.filter(a =>
        a.nama.toLowerCase().includes(keyword) || a.email.toLowerCase().includes(keyword)
    );
    renderAnggota(filtered);
});

document.getElementById('addAnggotaBtn').addEventListener('click', () => {
    document.getElementById('formAnggota').reset();
    document.getElementById('anggotaId').value = '';
    document.getElementById('modalAnggotaTitle').textContent = 'Tambah Anggota';
    openModal('modalAnggota');
});

window.editAnggota = (id) => {
    const a = allAnggota.find(x => x.id_anggota === id);
    if (!a) return;
    document.getElementById('anggotaId').value = a.id_anggota;
    document.getElementById('nama').value = a.nama;
    document.getElementById('email').value = a.email;
    document.getElementById('noHp').value = a.no_hp || '';
    document.getElementById('alamat').value = a.alamat || '';
    document.getElementById('modalAnggotaTitle').textContent = 'Edit Anggota';
    openModal('modalAnggota');
};

window.deleteAnggota = async (id) => {
    if (!confirm('Yakin mau hapus anggota ini?')) return;
    try {
        showLoading();
        const res = await fetch(`${API_URL}/anggota/${id}`, { method: 'DELETE' });
        const result = await res.json();
        if (result.success) {
            showToast('Anggota berhasil dihapus');
            loadAnggota();
        } else {
            showToast(result.message, 'error');
        }
    } catch (err) {
        showToast('Gagal menghapus anggota', 'error');
        console.error(err);
    } finally {
        hideLoading();
    }
};

document.getElementById('formAnggota').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('anggotaId').value;

    const data = {
        nama: document.getElementById('nama').value.trim(),
        email: document.getElementById('email').value.trim(),
        no_hp: document.getElementById('noHp').value.trim(),
        alamat: document.getElementById('alamat').value.trim()
    };

    try {
        showLoading();
        const url = id ? `${API_URL}/anggota/${id}` : `${API_URL}/anggota`;
        const method = id ? 'PUT' : 'POST';
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await res.json();

        if (result.success) {
            showToast(id ? 'Anggota berhasil diupdate' : 'Anggota berhasil ditambahkan');
            closeModal('modalAnggota');
            loadAnggota();
        } else {
            showToast(result.message, 'error');
        }
    } catch (err) {
        showToast('Terjadi kesalahan', 'error');
        console.error(err);
    } finally {
        hideLoading();
    }
});

// ============================
// PEMINJAMAN
// ============================
let allPeminjaman = [];

async function loadPeminjaman() {
    try {
        showLoading();
        const res = await fetch(`${API_URL}/peminjaman`);
        const result = await res.json();
        if (result.success) {
            allPeminjaman = result.data;
            renderPeminjaman(allPeminjaman);
        }
    } catch (err) {
        showToast('Gagal memuat data peminjaman', 'error');
        console.error(err);
    } finally {
        hideLoading();
    }
}

function renderPeminjaman(data) {
    const tbody = document.getElementById('peminjamanTableBody');
    if (data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 30px;">Belum ada data peminjaman</td></tr>`;
        return;
    }
    tbody.innerHTML = data.map(p => `
        <tr>
            <td>${p.judul_buku}</td>
            <td>${p.nama_anggota}</td>
            <td>${formatDate(p.tanggal_pinjam)}</td>
            <td>${formatDate(p.tanggal_kembali)}</td>
            <td><span class="badge badge-${p.status === 'Dipinjam' ? 'dipinjam' : 'dikembalikan'}">${p.status}</span></td>
            <td>
                ${p.status === 'Dipinjam' ? `<button class="btn-return" onclick="kembalikanBuku(${p.id_peminjaman}, ${p.id_buku})">✅ Kembalikan</button>` : ''}
                <button class="btn-delete" onclick="deletePeminjaman(${p.id_peminjaman})">🗑️ Hapus</button>
            </td>
        </tr>
    `).join('');
}

document.getElementById('filterStatusPeminjaman').addEventListener('change', () => {
    const status = document.getElementById('filterStatusPeminjaman').value;
    const filtered = status ? allPeminjaman.filter(p => p.status === status) : allPeminjaman;
    renderPeminjaman(filtered);
});

document.getElementById('addPeminjamanBtn').addEventListener('click', async () => {
    document.getElementById('formPeminjaman').reset();

    // Load dropdown buku (stok > 0) & anggota
    const bukuSelect = document.getElementById('peminjamanBuku');
    const anggotaSelect = document.getElementById('peminjamanAnggota');

    bukuSelect.innerHTML = allBuku.filter(b => b.stok > 0)
        .map(b => `<option value="${b.id_buku}">${b.judul} (Stok: ${b.stok})</option>`).join('');
    anggotaSelect.innerHTML = allAnggota
        .map(a => `<option value="${a.id_anggota}">${a.nama}</option>`).join('');

    if (bukuSelect.innerHTML === '') {
        bukuSelect.innerHTML = '<option value="">Tidak ada buku tersedia</option>';
    }

    document.getElementById('tanggalPinjam').value = new Date().toISOString().split('T')[0];
    openModal('modalPeminjaman');
});

window.kembalikanBuku = async (id, id_buku) => {
    if (!confirm('Konfirmasi buku sudah dikembalikan?')) return;
    try {
        showLoading();
        const res = await fetch(`${API_URL}/peminjaman/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                status: 'Dikembalikan',
                tanggal_kembali: new Date().toISOString().split('T')[0],
                id_buku
            })
        });
        const result = await res.json();
        if (result.success) {
            showToast('Buku berhasil dikembalikan');
            loadPeminjaman();
            loadBuku();
        } else {
            showToast(result.message, 'error');
        }
    } catch (err) {
        showToast('Gagal update status', 'error');
        console.error(err);
    } finally {
        hideLoading();
    }
};

window.deletePeminjaman = async (id) => {
    if (!confirm('Yakin mau hapus data peminjaman ini?')) return;
    try {
        showLoading();
        const res = await fetch(`${API_URL}/peminjaman/${id}`, { method: 'DELETE' });
        const result = await res.json();
        if (result.success) {
            showToast('Data peminjaman berhasil dihapus');
            loadPeminjaman();
        } else {
            showToast(result.message, 'error');
        }
    } catch (err) {
        showToast('Gagal menghapus data', 'error');
        console.error(err);
    } finally {
        hideLoading();
    }
};

document.getElementById('formPeminjaman').addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
        id_buku: document.getElementById('peminjamanBuku').value,
        id_anggota: document.getElementById('peminjamanAnggota').value,
        tanggal_pinjam: document.getElementById('tanggalPinjam').value
    };

    if (!data.id_buku || !data.id_anggota) {
        showToast('Buku dan anggota wajib dipilih', 'error');
        return;
    }

    try {
        showLoading();
        const res = await fetch(`${API_URL}/peminjaman`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await res.json();

        if (result.success) {
            showToast('Peminjaman berhasil dibuat');
            closeModal('modalPeminjaman');
            loadPeminjaman();
            loadBuku();
        } else {
            showToast(result.message, 'error');
        }
    } catch (err) {
        showToast('Terjadi kesalahan', 'error');
        console.error(err);
    } finally {
        hideLoading();
    }
});

// ============================
// INIT - LOAD DATA PERTAMA KALI
// ============================
async function init() {
    await loadKategori();
    await loadBuku();
    await loadAnggota();
    await loadStatistik();
}

init();