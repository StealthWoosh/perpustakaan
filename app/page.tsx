'use client';

import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import BooksPage from './components/BooksPage';
import MembersPage from './components/MembersPage';
import PeminjamanPage from './components/PeminjamanPage';
import { useBooks, useMembers, usePeminjaman } from './hooks/useStorage';

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  dashboard: { title: 'Dashboard', subtitle: 'Ringkasan aktivitas perpustakaan hari ini' },
  buku: { title: 'Koleksi Buku', subtitle: 'Kelola katalog buku perpustakaan' },
  anggota: { title: 'Data Anggota', subtitle: 'Kelola keanggotaan siswa perpustakaan' },
  peminjaman: { title: 'Peminjaman Buku', subtitle: 'Catat dan pantau transaksi peminjaman' },
};

export default function Home() {
  const [activePage, setActivePage] = useState('dashboard');
  const { books, addBook, updateBook, deleteBook } = useBooks();
  const { members, addMember, updateMember, deleteMember } = useMembers();
  const { peminjaman, addPeminjaman, updatePeminjaman, deletePeminjaman } = usePeminjaman();

  const page = PAGE_TITLES[activePage];

  return (
    <div className="app-shell">
      <Sidebar active={activePage} onNavigate={setActivePage} />
      <div className="main-content">
        <div className="topbar">
          <div className="topbar-title">
            <h2>{page.title}</h2>
            <p>{page.subtitle}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%', background: 'var(--ink)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '13px', fontWeight: 600, color: 'var(--gold-light)'
            }}>P</div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ink)' }}>Pustakawan</div>
              <div style={{ fontSize: '11px', color: 'var(--ink-muted)' }}>Admin</div>
            </div>
          </div>
        </div>
        <div className="page-body">
          {activePage === 'dashboard' && (
            <Dashboard books={books} members={members} peminjaman={peminjaman} onNavigate={setActivePage} />
          )}
          {activePage === 'buku' && (
            <BooksPage books={books} onAdd={addBook} onUpdate={updateBook} onDelete={deleteBook} />
          )}
          {activePage === 'anggota' && (
            <MembersPage members={members} onAdd={addMember} onUpdate={updateMember} onDelete={deleteMember} />
          )}
          {activePage === 'peminjaman' && (
            <PeminjamanPage
              peminjaman={peminjaman} books={books} members={members}
              onAdd={addPeminjaman} onUpdate={updatePeminjaman} onDelete={deletePeminjaman}
            />
          )}
        </div>
      </div>
    </div>
  );
}
