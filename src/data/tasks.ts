import { TaskItem } from '../types';

export const initialTasksData: TaskItem[] = [
  {
    id: 'task-1',
    title: 'Peran Informatika dalam Kehidupan Modern',
    subject: 'Informatika',
    category: 'Artikel / Teori',
    type: 'Artikel / Teori',
    createdAt: '2026-07-28',
    date: '28 Jul 2026',
    deadline: '2026-08-05',
    status: 'Selesai',
    description: 'Pembahasan mengenai pengaruh informatika dalam efisiensi pekerjaan, komunikasi, dan transformasi digital di berbagai sektor kehidupan modern.',
    content: `Perkembangan teknologi informatika telah membawa perubahan besar dalam berbagai aspek kehidupan manusia. Saat ini, hampir semua aktivitas sehari-hari tidak lepas dari penggunaan perangkat digital dan internet, mulai dari bidang pendidikan, bisnis, kesehatan, hingga hiburan. Kehadiran teknologi ini mempermudah manusia dalam mengakses informasi, berkomunikasi jarak jauh, serta menyelesaikan berbagai pekerjaan secara lebih cepat dan efisien.

Di bidang pendidikan, teknologi informatika memungkinkan proses pembelajaran daring dan akses materi pelajaran secara fleksibel. Dalam dunia bisnis, sistem informasi membantu perusahaan mengelola data pelanggan, transaksi, hingga laporan keuangan secara cepat dan akurat. Di bidang kesehatan, teknologi informatika membantu rumah sakit dalam menyimpan rekam medis digital sehingga pelayanan kepada pasien menjadi lebih efisien.

Meskipun memberikan banyak manfaat, perkembangan informatika juga menghadirkan tantangan. Ancaman seperti pencurian data pribadi, penyebaran berita palsu, peretasan akun, serta penyalahgunaan teknologi menjadi masalah yang harus dihadapi. Oleh karena itu, setiap pengguna teknologi perlu memiliki literasi digital, memahami pentingnya menjaga keamanan data, menggunakan kata sandi yang kuat, serta bersikap bijak saat mengakses maupun membagikan informasi di internet.

Kesimpulan: Penguasaan informatika menjadi kemampuan penting bagi generasi muda untuk menghadapi perkembangan teknologi secara bertanggung jawab.`,
    cover: 'https://picsum.photos/seed/informatika-peran/800/600',
    attachments: []
  },
  {
    id: 'task-2',
    title: 'Undang-Undang ITE dan Etika Digital',
    subject: 'Informatika',
    category: 'Teori / Analisis',
    type: 'Teori / Analisis',
    createdAt: '2026-07-28',
    date: '28 Jul 2026',
    deadline: '2026-08-08',
    status: 'Selesai',
    description: 'Pembahasan mengenai aturan penggunaan teknologi informasi dan kepastian hukum transaksi elektronik di Indonesia.',
    content: `UU ITE adalah singkatan dari Undang-Undang Informasi dan Transaksi Elektronik, yaitu aturan yang mengatur penggunaan teknologi informasi dan transaksi elektronik di Indonesia. UU ini dibuat untuk memberikan kepastian hukum dalam aktivitas digital, seperti komunikasi melalui internet, transaksi online, serta penyebaran informasi melalui media elektronik.

UU ITE mengatur berbagai hal, termasuk penggunaan dokumen elektronik, transaksi elektronik, perlindungan data dan informasi, serta tindakan yang dilarang di dunia digital. Aturan ini juga berkaitan dengan berbagai bentuk penyalahgunaan teknologi, seperti akses ilegal, manipulasi informasi elektronik, dan penyebaran konten tertentu yang melanggar hukum.

Kesimpulan: UU ITE merupakan aturan penting dalam mengatur aktivitas digital di Indonesia. Dengan memahami dan menaati UU ITE, masyarakat dapat menggunakan teknologi dan internet secara lebih aman, bijak, dan bertanggung jawab.`,
    cover: 'https://picsum.photos/seed/informatika-uu-ite/800/600',
    attachments: []
  },
  {
    id: 'task-3',
    title: 'Kriptografi dan Keamanan Data',
    subject: 'Informatika',
    category: 'Pemrograman',
    type: 'Pemrograman',
    createdAt: '2026-07-28',
    date: '28 Jul 2026',
    deadline: '2026-08-10',
    status: 'Sedang Dikerjakan',
    description: 'Studi pengolahan angka enkripsi dan dekripsi untuk melindungi transaksi serta komunikasi data pribadi.',
    content: `Dalam kehidupan sehari-hari, kriptografi digunakan untuk melindungi kata sandi, transaksi online, pesan pribadi, dan komunikasi melalui internet. Salah satu penerapannya dapat ditemukan pada situs web yang menggunakan protokol HTTPS untuk membantu menjaga keamanan pertukaran data antara pengguna dan server.

Pengolahan algoritma enkripsi memastikan bahwa data sensitif yang dikirim melalui jaringan tidak dapat dibaca oleh pihak yang tidak berwenang tanpa kunci dekripsi yang sah.

Kesimpulan: Pemahaman dasar kriptografi membantu pengembang web dan pengguna internet dalam membangun sistem yang aman serta terproteksi dari ancaman peretasan data.`,
    code: `// Contoh implementasi Caesar Cipher sederhana dalam JavaScript
function caesarCipher(text, shift) {
    return text.split('').map(char => {
        const code = char.charCodeAt(0);
        if (code >= 65 && code <= 90) {
            return String.fromCharCode(((code - 65 + shift) % 26) + 65);
        } else if (code >= 97 && code <= 122) {
            return String.fromCharCode(((code - 97 + shift) % 26) + 97);
        }
        return char;
    }).join('');
}

console.log(caesarCipher("WORKSPACE", 3)); // Hasil: ZRUNVSDFH`,
    cover: 'https://picsum.photos/seed/informatika-kripto/800/600',
    attachments: ['Laporan_Kriptografi.pdf']
  },
  {
    id: 'task-4',
    title: 'Hikayat Raja Arif dan Batu Cahaya',
    subject: 'Bahasa Indonesia',
    category: 'Hikayat',
    type: 'Hikayat',
    createdAt: '2026-07-30',
    date: '30 Jul 2026',
    deadline: '2026-08-06',
    status: 'Selesai',
    description: 'Kisah hikayat klasik tentang kejujuran, ketulusan hati, dan bahaya keserakahan harta.',
    content: `Pada zaman dahulu kala, berdirilah sebuah kerajaan bernama Purnama Jaya yang dipimpin oleh Raja Arif. Baginda dikenal sebagai raja yang adil, bijaksana, dan sangat menyayangi rakyatnya. Pada suatu hari, datanglah seorang pertapa tua membawa sebuah batu yang dapat memancarkan cahaya keemasan. Pertapa itu berkata bahwa batu tersebut hanya akan bersinar di tangan orang yang memiliki hati tulus dan jujur.

Berita tentang Batu Cahaya itu kemudian tersebar ke seluruh kerajaan. Seorang saudagar kaya bernama Darman sangat ingin memilikinya. Ia menawarkan seluruh kekayaannya kepada Raja Arif, tetapi sang raja menolak karena benda tersebut bukanlah sesuatu yang dapat dibeli dengan harta. Karena dikuasai keserakahan, Darman akhirnya berniat mencuri batu tersebut pada malam hari.

Ketika berhasil mengambil Batu Cahaya, tiba-tiba cahaya batu itu padam. Darman terkejut dan mendengar suara yang berkata bahwa harta yang diperoleh dengan keserakahan tidak akan membawa kebahagiaan. Darman pun menyadari kesalahannya dan segera mengembalikan batu tersebut kepada Raja Arif. Ia meminta maaf dan berjanji untuk meninggalkan sifat tamaknya.

Raja Arif memaafkan Darman dan memintanya menggunakan kekayaannya untuk membantu rakyat yang membutuhkan. Sejak saat itu, Darman berubah menjadi saudagar yang dermawan dan suka menolong. Konon, setelah hatinya benar-benar berubah, Batu Cahaya kembali bersinar terang.

Amanat Hikayat: Kejujuran, ketulusan, dan kepedulian kepada sesama jauh lebih berharga daripada kekayaan yang diperoleh dengan cara yang tidak jujur.`,
    cover: 'https://picsum.photos/seed/bindo-hikayat/800/600',
    attachments: []
  },
  {
    id: 'task-5',
    title: 'Laporan Hasil Observasi Tanaman Lidah Buaya',
    subject: 'Bahasa Indonesia',
    category: 'Laporan Hasil Observasi',
    type: 'Laporan Hasil Observasi',
    createdAt: '2026-07-30',
    date: '30 Jul 2026',
    deadline: '2026-08-12',
    status: 'Selesai',
    description: 'Laporan hasil pengamatan ilmiah mengenai struktur fisik, manfaat, dan cara perawatan tanaman lidah buaya.',
    content: `Tanaman lidah buaya merupakan salah satu tanaman yang banyak ditemukan di lingkungan sekitar. Tanaman ini dikenal memiliki daun yang tebal, panjang, dan berdaging. Lidah buaya dapat tumbuh di daerah dengan kondisi yang cukup panas dan tidak membutuhkan banyak air.

Lidah buaya memiliki daun berwarna hijau dengan bentuk memanjang dan ujung yang meruncing. Pada bagian tepi daun terdapat duri-duri kecil. Di dalam daunnya terdapat gel bening yang mengandung banyak air dan sering dimanfaatkan dalam berbagai produk.

Berdasarkan hasil pengamatan, lidah buaya memiliki beberapa manfaat bagi manusia. Gel lidah buaya dapat digunakan sebagai bahan dalam produk perawatan kulit dan rambut. Selain itu, tanaman ini juga sering dimanfaatkan sebagai tanaman hias karena perawatannya relatif mudah.

Kesimpulan: Lidah buaya merupakan tanaman yang mudah dirawat dan memiliki berbagai manfaat kesehatan serta kecantikan.`,
    cover: 'https://picsum.photos/seed/bindo-ai/800/600',
    attachments: []
  },
  {
    id: 'task-6',
    title: 'Analisis Kebahasaan Teks Negosiasi Laboratorium',
    subject: 'Bahasa Indonesia',
    category: 'Teks Negosiasi',
    type: 'Teks Negosiasi',
    createdAt: '2026-07-30',
    date: '30 Jul 2026',
    deadline: '2026-08-14',
    status: 'Belum Dikerjakan',
    description: 'Analisis struktur orientasi, pengajuan, penawaran, dan kesepakatan dalam negosiasi pengadaan fasilitas sekolah.',
    content: `Teks negosiasi memiliki karakteristik kebahasaan tersendiri yang membedakannya dari jenis teks lain. Tujuan utama negosiasi adalah mencapai kesepakatan di antara dua belah pihak yang memiliki kepentingan berbeda. Kaidah kebahasaan yang menonjol meliputi kalimat persuasif, pronomina persona, kalimat bersyarat, dan tuturan berpasangan.

Dialog Negosiasi OSIS dan Kepala Sekolah:
OSIS: "Selamat pagi, Pak. Kami mewakili klub komputer ingin mengajukan proposal kerjasama pengadaan server lokal untuk latihan coding siswa." (Pengajuan)
Kepala Sekolah: "Selamat pagi. Proposal sudah saya baca, namun dana operasional sekolah triwulan ini difokuskan untuk renovasi perpustakaan. Apakah proyek ini mendesak?" (Penolakan Halus)
OSIS: "Kami memahaminya, Pak. Namun jika server ini disetujui, kami bersedia membantu mendigitalisasi katalog buku perpustakaan secara sukarela sebagai bagian proyek praktek kami." (Penawaran Persuasif)
Kepala Sekolah: "Tawaran yang menarik. Baiklah, saya setuju memberikan setengah dari anggaran proposal, asalkan digitalisasi perpus rampung sebelum akhir semester." (Kesepakatan)

Analisis Kebahasaan: Teks di atas mendemonstrasikan struktur penuh negosiasi: Orientasi, Pengajuan, Penawaran, dan Persetujuan. Penggunaan kalimat bersyarat menjadi jembatan diplomasi yang efektif.`,
    cover: 'https://picsum.photos/seed/bindo-nego/800/600',
    attachments: ['Proposal_Laboratorium.pdf']
  },
  {
    id: 'task-7',
    title: 'Vibe Coding: Cara Baru Berkolaborasi dengan AI dalam Membuat Program',
    subject: 'Informatika',
    category: 'Artikel',
    type: 'Artikel',
    createdAt: '2026-08-06',
    date: '06 Agu 2026',
    deadline: '2026-08-20',
    status: 'Selesai',
    description: 'Memahami konsep Vibe Coding, cara kerjanya bersama AI, serta kelebihan dan risiko dalam penggunaannya.',
    content: `Belakangan ini, istilah Vibe Coding mulai ramai diperbincangkan di kalangan pengembang perangkat lunak, termasuk pelajar dan mahasiswa yang tertarik pada dunia pemrograman. Konsep ini merujuk pada gaya baru dalam menulis kode atau membuat program, di mana seseorang tidak lagi harus mengetik setiap baris kode secara manual dari nol. Sebaliknya, mereka berkolaborasi secara intensif dengan kecerdasan buatan (AI) untuk menghasilkan, memperbaiki, dan mengembangkan kode. Dinamakan "vibe" karena pendekatannya yang lebih intuitif, mengalir, dan berfokus pada hasil akhir, sementara AI menangani hal-hal teknis yang detail.

Secara teknis, Vibe Coding bekerja melalui interaksi antara pengguna dan AI menggunakan prompt atau instruksi teks. Seseorang cukup memberikan penjelasan mengenai fitur atau program apa yang ingin dibuat. AI kemudian akan menghasilkan prototype kode yang diminta. Pengguna dapat langsung meninjau hasilnya dan memberikan umpan balik jika ada bagian yang kurang sesuai.

Kelebihan utama dari metode ini adalah kecepatan dan kemudahannya. Bagi pemula atau siswa SMA yang baru belajar coding, AI sangat membantu mengatasi hambatan awal seperti sintaks yang rumit atau debugging.

Namun, Vibe Coding juga memiliki kekurangan dan risiko. AI tidak selalu sempurna; terkadang kode mengandung kesalahan logika atau celah keamanan. Risiko terbesarnya jika pengguna terlalu bergantung pada AI tanpa memahami dasar coding.

Kesimpulan: Vibe Coding merupakan inovasi luar biasa sebagai alat bantu (tools), namun pemahaman fundamental pemrograman tetap menjadi kunci utama.`,
    cover: 'https://picsum.photos/seed/vibe-coding/800/600',
    attachments: []
  }
];

const TASKS_STORAGE_KEY = 'kellys_workspace_tasks_v2';

export function loadTasks(): TaskItem[] {
  if (typeof window === 'undefined') {
    return initialTasksData;
  }
  try {
    const saved = localStorage.getItem(TASKS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Gagal memuat tugas dari localStorage:', e);
  }
  return initialTasksData;
}

export function saveTasks(tasks: TaskItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.warn('Gagal menyimpan tugas ke localStorage:', e);
  }
}
