const buku_buku = [];
const render_buku = "render-book";
const simpan_buku = "save-book";
const kunci_penyimpanan = "BOOKSHELF_APP";
const judulBuku = document.querySelector("#inputJudulBuku");
const penulisBuku = document.querySelector("#inputPenulisBuku");
const tahunBuku = document.querySelector("#inputTahunBuku");
const bukuSudahSelesai = document.querySelector("#inputBukuSudahSelesai");

function ada_local_storage () {
    if (typeof (Storage) === undefined) {
        alert("Mohon maaf, browser Anda tidak mendukung local storage")
        return false;
    }
    return true;
}

function identitas() {
    return +new Date();
}

function identitas_buku (id, judul, author, year, isComplete) {
    return {
        id,
        judul,
        author,
        year,
        isComplete,
    }
}

function cari_buku (id_buku) {
    for (const item_buku of buku_buku) {
        if (item_buku.id === id_buku) {
            return item_buku;
        }
    }

    return null;
}

function cari_indeks (id_buku) {
    for (const indeks in buku_buku) {
        if (buku_buku[indeks].id === id_buku) {
            return indeks;
        }
    }
    return -1;
}

function tambah_objek (objek_buku) {
    const {
        id,
        judul,
        author,
        year,
        isComplete,
    } = objek_buku;

const elemen_judul = document.createElement("h3");
elemen_judul.setAttribute("id", "title-books");
elemen_judul.innerText = `${judul}`;

const element_penulis = document.createElement("h4");
element_penulis.setAttribute("id", "author-books");
element_penulis.innerText = `Penulis : ${author}`;

const elemen_tahun = document.createElement("h4");
elemen_tahun.setAttribute("id", "year-books");
elemen_tahun.innerText = `Tahun : ${year}`;

const container = document.createElement("div");
container.append(elemen_judul, element_penulis, elemen_tahun);
container.setAttribute("id", `books-${id}`);
container.classList.add("container-books");

if (isComplete) {
    const ingin_baca_lagi = document.createElement("button");
    ingin_baca_lagi.innerHTML = '<p><i class = "fa-solid fa-book-open"></i> Ingin baca lagi</p>';
    ingin_baca_lagi.classList.add("green");
    ingin_baca_lagi.addEventListener("click", function(){
        buku_belum_selesai_dibaca(id);
        if (buku_selesai_dibaca !== false) {
            swal("Jangan lupa untuk membaca buku " + judul + " lagi!", {
                icon: "success",
            });
        } 
    });

    const hapus_buku = document.createElement("button");
    hapus_buku.innerHTML = '<p><i class = "fa-regular fa-trash-can"></i> Hapus Buku</p>';
    hapus_buku.classList.add("red");
    hapus_buku.addEventListener("click", function() {
        swal({
            title: "Apakah Anda yakin ingin menghapus buku " + judul + "?",
            icon: "warning",
            buttons: ["Batal", "Ya"],
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                swal("Buku " + judul + " berhasil dihapus!", {
                    icon: "success",
                });
                buku_dihapus(id)
            } else {
                swal("Buku tidak jadi dihapus!");
            }
        });
    });
    container.append(ingin_baca_lagi, hapus_buku);
} else {
    const sudah_baca = document.createElement("button");
    sudah_baca.innerHTML = '<p><i class = "fa-solid fa-book"></i> Selesai dibaca</p>';
    sudah_baca.classList.add("finish");
    sudah_baca.addEventListener("click", function() {
        buku_selesai_dibaca(id);
        if (buku_selesai_dibaca !== false) {
            swal("Selamat kamu telah selesai membaca buku "+ judul + "!", {
                icon: "success",
            });
        } 
    });

    const hapus_buku = document.createElement("button");
    hapus_buku.innerHTML = '<p><i class = "fa-regular fa-trash-can"></i> Hapus Buku</p>';
    hapus_buku.classList.add("red");
    hapus_buku.addEventListener("click", function() {
        swal({
            title: "Apakah Anda yakin ingin menghapus buku " + judul + "?",
            icon: "warning",
            buttons: ["Batal", "Ya"],
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                swal("Buku " + judul + " berhasil dihapus!", {
                    icon: "success",
                });
                buku_dihapus(id)
            } else {
                swal("Buku tidak jadi dihapus!");
            }
        });
    });
    container.append(sudah_baca, hapus_buku); 
    }
    return container;
}

function reset_data() {
    document.getElementById('inputJudulBuku').value = '';
    document.getElementById('inputPenulisBuku').value = '';
    document.getElementById('inputTahunBuku').value = '';
    document.getElementById('inputBukuSudahSelesai').checked = false;
    return;
}

function menambahkan_buku() {
    const addjudulBuku = judulBuku.value;
    const addpenulisBuku = penulisBuku.value;
    const addtahunBuku = parseInt(tahunBuku.value);
    const addIsComplete = bukuSudahSelesai.checked;
    const buatId = identitas();
    const objek_buku = identitas_buku(
        buatId,
        addjudulBuku,
        addpenulisBuku,
        addtahunBuku,
        addIsComplete,
    );
    reset_data();
    buku_buku.push(objek_buku);
    document.dispatchEvent(new Event(render_buku));
    simpan_data_buku();
}

function buku_selesai_dibaca (id_buku) {
    const target_buku= cari_buku(id_buku);
    if (target_buku== null) return;
    target_buku.isComplete = true;
    document.dispatchEvent(new Event(render_buku));
    simpan_data_buku();
}

function buku_belum_selesai_dibaca (id_buku) {
    const target_buku= cari_buku(id_buku);
    if (target_buku== null) return;
    target_buku.isComplete = false;
    document.dispatchEvent(new Event(render_buku));
    simpan_data_buku();
}

function buku_dihapus (id_buku) {
    const target_buku= cari_indeks(id_buku);
    if (target_buku=== -1) return;
    buku_buku.splice(target_buku, 1);
    document.dispatchEvent(new Event(render_buku));
    simpan_data_buku();
}

function simpan_data_buku() {
    if (ada_local_storage ()) {
        const parsed = JSON.stringify(buku_buku);
        localStorage.setItem(kunci_penyimpanan, parsed);
        document.dispatchEvent(new Event(simpan_buku))
    }
}

function load_data_from_storage() {
    const data = localStorage.getItem(kunci_penyimpanan);
    let objek_data = JSON.parse(data);
    if (objek_data !== null) {
        for (const buku of objek_data) {
            buku_buku.push(buku);
        }
    }
    document.dispatchEvent(new Event(render_buku));
}

function mencari_buku() {
    let pencarian = document.querySelector('#cariJudulBuku').value;
    let hasil_pencarian = document.getElementsByClassName('container-books');
    for (const item_buku of hasil_pencarian) {
        let judul_buku = item_buku.innerText.toUpperCase();
        let caribuku = judul_buku.search(pencarian.toUpperCase());
        if (caribuku != -1) {
            item_buku.style.display = '';
        } else {
            item_buku.style.display = 'none';
        }
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const submitForm = document.querySelector('#inputBuku');
    const searchForm = document.querySelector('#cariBuku');
    submitForm.addEventListener("submit", (e) => {
        e.preventDefault();
        menambahkan_buku();
        swal("Berhasil menambahkan buku!", {
			icon: "success",
		});
    });
    searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        mencari_buku();
    });
    if (ada_local_storage ()) {
        load_data_from_storage();
    }
});

document.addEventListener(simpan_buku, function() {
    console.log(localStorage.getItem(kunci_penyimpanan));
});

document.addEventListener(render_buku, function() {
    const listBukuBelumSelesai = document.querySelector(".listBukuBelumSelesai");
    const listBukuSudahSelesai = document.querySelector(".listBukuSudahSelesai");
    listBukuBelumSelesai.innerHTML = "";
    listBukuSudahSelesai.innerHTML = "";
    for (const item_buku of buku_buku) {
        const elemen_buku = tambah_objek(item_buku);
        if (item_buku.isComplete) {
            listBukuSudahSelesai.append(elemen_buku);
        } else {
            listBukuBelumSelesai.append(elemen_buku);
        }
    }
});
