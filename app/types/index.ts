export type BookCategory = 'Fiksi' | 'Non-Fiksi' | 'Sains' | 'Sejarah' | 'Teknologi' | 'Sastra' | 'Matematika' | 'Biologi';

export interface Book {
  id: string;
  judul: string;
  pengarang: string;
  isbn: string;
  kategori: BookCategory;
  tahunTerbit: number;
  stok: number;
  deskripsi: string;
  createdAt: string;
}

export interface Member {
  id: string;
  nama: string;
  nis: string;
  kelas: string;
  email: string;
  telepon: string;
  tanggalDaftar: string;
  aktif: boolean;
}

export interface Peminjaman {
  id: string;
  bookId: string;
  memberId: string;
  tanggalPinjam: string;
  tanggalKembali: string;
  tanggalDikembalikan?: string;
  status: 'Dipinjam' | 'Dikembalikan' | 'Terlambat';
  denda: number;
}
