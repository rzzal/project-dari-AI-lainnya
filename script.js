// ==========================================
// VARIABEL UTAMA (PENYIMPAN DATA)
// ==========================================
// Array untuk menyimpan item-item yang dimasukkan ke keranjang
let keranjang = [];

// ==========================================
// FUNGSI 1: Format Angka ke Rupiah (Rp)
// ==========================================
// Fungsi bantuan untuk mengubah angka polos (misal 15000) menjadi format Rupiah ("Rp 15.000")
function formatRupiah(angka) {
    return 'Rp ' + angka.toLocaleString('id-ID');
}

// ==========================================
// FUNGSI 2: Menambahkan Produk ke Keranjang
// ==========================================
function tambahKeKeranjang(nama, harga) {
    // Cek apakah barang sudah ada di keranjang sebelumnya
    let itemSama = keranjang.find(item => item.nama === nama);

    if (itemSama) {
        // Jika produk sudah ada, cukup tambahkan jumlahnya (jumlah + 1)
        itemSama.jumlah += 1;
    } else {
        // Jika produk belum ada, tambahkan objek barang baru ke array keranjang
        keranjang.push({
            nama: nama,
            harga: harga,
            jumlah: 1
        });
    }

    // Perbarui tampilan tabel keranjang di layar
    perbaruiTampilanKeranjang();
}

// ==========================================
// FUNGSI 3: Menghapus Item dari Keranjang
// ==========================================
function hapusItem(index) {
    // Hapus 1 elemen pada posisi/index tertentu di array keranjang
    keranjang.splice(index, 1);
    
    // Perbarui tampilan setelah barang dihapus
    perbaruiTampilanKeranjang();
}

// ==========================================
// FUNGSI 4: Memperbarui Tampilan Tabel & Total
// ==========================================
function perbaruiTampilanKeranjang() {
    const tbody = document.getElementById('daftar-keranjang');
    const totalElement = document.getElementById('total-belanja');
    
    // Kosongkan isi tabel sebelum digambar ulang
    tbody.innerHTML = '';

    let totalBelanja = 0;

    // Lakukan perulangan untuk setiap item di keranjang
    keranjang.forEach((item, index) => {
        let totalPerItem = item.harga * item.jumlah;
        totalBelanja += totalPerItem; // Tambahkan ke total keseluruhan

        // Buat baris tabel baru (HTML)
        let row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.nama}</td>
            <td>${formatRupiah(item.harga)}</td>
            <td>${item.jumlah}</td>
            <td>${formatRupiah(totalPerItem)}</td>
            <td><button class="btn-hapus" onclick="hapusItem(${index})">Hapus</button></td>
        `;
        
        // Masukkan baris baru ke dalam tabel
        tbody.appendChild(row);
    });

    // Tampilkan total belanja yang sudah dihitung
    totalElement.innerText = formatRupiah(totalBelanja);

    // Hitung ulang kembalian secara otomatis
    hitungKembalian();
}

// ==========================================
// FUNGSI 5: Menhitung Kembalian Pembayaran
// ==========================================
function hitungKembalian() {
    // Hitung total belanja dari array keranjang
    let totalBelanja = keranjang.reduce((sum, item) => sum + (item.harga * item.jumlah), 0);
    
    // Ambil nilai dari input pembayaran
    let inputBayar = document.getElementById('bayar-input').value;
    let uangBayar = parseFloat(inputBayar) || 0;
    
    let kembalianText = document.getElementById('kembalian-text');

    if (uangBayar >= totalBelanja && totalBelanja > 0) {
        let kembalian = uangBayar - totalBelanja;
        kembalianText.innerText = formatRupiah(kembalian);
        kembalianText.style.color = "#16a34a"; // Warna hijau jika uang cukup
    } else if (totalBelanja === 0) {
        kembalianText.innerText = "Rp 0";
        kembalianText.style.color = "#16a34a";
    } else {
        kembalianText.innerText = "Uang Tidak Cukup";
        kembalianText.style.color = "#ef4444"; // Warna merah jika uang kurang
    }
}

// ==========================================
// FUNGSI 6: Menyelesaikan Transaksi & Cetak
// ==========================================
function selesaikanTransaksi() {
    let totalBelanja = keranjang.reduce((sum, item) => sum + (item.harga * item.jumlah), 0);
    let inputBayar = document.getElementById('bayar-input').value;
    let uangBayar = parseFloat(inputBayar) || 0;

    // Validasi
    if (keranjang.length === 0) {
        alert("Keranjang belanja masih kosong!");
        return;
    }

    if (uangBayar < totalBelanja) {
        alert("Pembayaran kurang! Harap masukkan jumlah uang yang cukup.");
        return;
    }

    let kembalian = uangBayar - totalBelanja;

    // Tampilkan konfirmasi nota transaksi sederhana
    alert(
        `==== NOTA TRANSAKSI ====\n` +
        `Total Belanja: ${formatRupiah(totalBelanja)}\n` +
        `Uang Dibayar : ${formatRupiah(uangBayar)}\n` +
        `Kembalian    : ${formatRupiah(kembalian)}\n\n` +
        `Terima kasih telah berbelanja!`
    );

    // Reset keranjang setelah transaksi selesai
    kosongkanKeranjang();
}

// ==========================================
// FUNGSI 7: Mengosongkan Keranjang Belanja
// ==========================================
function kosongkanKeranjang() {
    keranjang = []; // Kosongkan data array
    document.getElementById('bayar-input').value = ''; // Kosongkan input bayar
    perbaruiTampilanKeranjang(); // Reset tampilan
}
