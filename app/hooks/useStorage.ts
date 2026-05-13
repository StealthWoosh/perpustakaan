'use client';

import { useState, useEffect } from 'react';
import { Book, Member, Peminjaman } from '../types';

const SEED_BOOKS: Book[] = [
  { id: 'b1', judul: 'Laskar Pelangi', pengarang: 'Andrea Hirata', isbn: '9789793062792', kategori: 'Sastra', tahunTerbit: 2005, stok: 5, deskripsi: 'Novel tentang semangat anak-anak Belitung mengejar mimpi.', createdAt: new Date().toISOString() },
  { id: 'b2', judul: 'Bumi Manusia', pengarang: 'Pramoedya Ananta Toer', isbn: '9789794070000', kategori: 'Sastra', tahunTerbit: 1980, stok: 3, deskripsi: 'Kisah Minke di era kolonial Belanda.', createdAt: new Date().toISOString() },
  { id: 'b3', judul: 'Fisika Dasar', pengarang: 'Halliday & Resnick', isbn: '9780471320005', kategori: 'Sains', tahunTerbit: 2010, stok: 8, deskripsi: 'Buku teks fisika komprehensif untuk pelajar.', createdAt: new Date().toISOString() },
  { id: 'b4', judul: 'Matematika SMA Kelas XII', pengarang: 'Tim Kemendikbud', isbn: '9786020013022', kategori: 'Matematika', tahunTerbit: 2019, stok: 12, deskripsi: 'Buku pelajaran matematika kurikulum Merdeka.', createdAt: new Date().toISOString() },
  { id: 'b5', judul: 'Pemrograman Python', pengarang: 'Farid Azis', isbn: '9789792936444', kategori: 'Teknologi', tahunTerbit: 2021, stok: 6, deskripsi: 'Pengantar pemrograman Python untuk pemula.', createdAt: new Date().toISOString() },
  { id: 'b6', judul: 'Sejarah Indonesia Modern', pengarang: 'M.C. Ricklefs', isbn: '9780804761314', kategori: 'Sejarah', tahunTerbit: 2008, stok: 4, deskripsi: 'Sejarah komprehensif Indonesia dari masa kolonial hingga reformasi.', createdAt: new Date().toISOString() },
];

const SEED_MEMBERS: Member[] = [
  { id: 'm1', nama: 'Budi Santoso', nis: '2024001', kelas: 'XII IPA 1', email: 'budi@sekolah.ac.id', telepon: '081234567890', tanggalDaftar: '2024-01-15', aktif: true, alamat: 'Sulfat' },
  { id: 'm2', nama: 'Siti Rahayu', nis: '2024002', kelas: 'XI IPS 2', email: 'siti@sekolah.ac.id', telepon: '081234567891', tanggalDaftar: '2024-01-16', aktif: true, alamat: 'Pakis' },
  { id: 'm3', nama: 'Ahmad Fauzi', nis: '2024003', kelas: 'X MIPA 3', email: 'ahmad@sekolah.ac.id', telepon: '081234567892', tanggalDaftar: '2024-02-01', aktif: true, alamat: 'Singosari' },
  { id: 'm4', nama: 'Dewi Putri', nis: '2024004', kelas: 'XII IPS 1', email: 'dewi@sekolah.ac.id', telepon: '081234567893', tanggalDaftar: '2024-02-05', aktif: false, alamat: 'Lang Lang' },
];

const SEED_PEMINJAMAN: Peminjaman[] = [
  { id: 'p1', bookId: 'b1', memberId: 'm1', tanggalPinjam: '2025-05-01', tanggalKembali: '2025-05-15', status: 'Dipinjam', denda: 0 },
  { id: 'p2', bookId: 'b3', memberId: 'm2', tanggalPinjam: '2025-04-20', tanggalKembali: '2025-05-04', tanggalDikembalikan: '2025-05-03', status: 'Dikembalikan', denda: 0 },
  { id: 'p3', bookId: 'b5', memberId: 'm3', tanggalPinjam: '2025-04-10', tanggalKembali: '2025-04-24', status: 'Terlambat', denda: 5000 },
];

function initStorage<T>(key: string, seed: T[]): T[] {
  if (typeof window === 'undefined') return seed;
  const stored = localStorage.getItem(key);
  if (!stored) {
    localStorage.setItem(key, JSON.stringify(seed));
    return seed;
  }
  return JSON.parse(stored);
}

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    setBooks(initStorage('perpus_books', SEED_BOOKS));
  }, []);

  const save = (data: Book[]) => {
    setBooks(data);
    localStorage.setItem('perpus_books', JSON.stringify(data));
  };

  const addBook = (book: Omit<Book, 'id' | 'createdAt'>) => {
    const newBook: Book = { ...book, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    save([...books, newBook]);
  };

  const updateBook = (id: string, updated: Partial<Book>) => {
    save(books.map(b => b.id === id ? { ...b, ...updated } : b));
  };

  const deleteBook = (id: string) => {
    save(books.filter(b => b.id !== id));
  };

  return { books, addBook, updateBook, deleteBook };
}

export function useMembers() {
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    setMembers(initStorage('perpus_members', SEED_MEMBERS));
  }, []);

  const save = (data: Member[]) => {
    setMembers(data);
    localStorage.setItem('perpus_members', JSON.stringify(data));
  };

  const addMember = (member: Omit<Member, 'id'>) => {
    const newMember: Member = { ...member, id: crypto.randomUUID() };
    save([...members, newMember]);
  };

  const updateMember = (id: string, updated: Partial<Member>) => {
    save(members.map(m => m.id === id ? { ...m, ...updated } : m));
  };

  const deleteMember = (id: string) => {
    save(members.filter(m => m.id !== id));
  };

  return { members, addMember, updateMember, deleteMember };
}

export function usePeminjaman() {
  const [peminjaman, setPeminjaman] = useState<Peminjaman[]>([]);

  useEffect(() => {
    setPeminjaman(initStorage('perpus_peminjaman', SEED_PEMINJAMAN));
  }, []);

  const save = (data: Peminjaman[]) => {
    setPeminjaman(data);
    localStorage.setItem('perpus_peminjaman', JSON.stringify(data));
  };

  const addPeminjaman = (p: Omit<Peminjaman, 'id'>) => {
    const newP: Peminjaman = { ...p, id: crypto.randomUUID() };
    save([...peminjaman, newP]);
  };

  const updatePeminjaman = (id: string, updated: Partial<Peminjaman>) => {
    save(peminjaman.map(p => p.id === id ? { ...p, ...updated } : p));
  };

  const deletePeminjaman = (id: string) => {
    save(peminjaman.filter(p => p.id !== id));
  };

  return { peminjaman, addPeminjaman, updatePeminjaman, deletePeminjaman };
}
