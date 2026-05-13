'use client';

import { BookOpen, Users, ArrowLeftRight, AlertTriangle, TrendingUp } from 'lucide-react';
import { Book, Member, Peminjaman } from '../types';

interface DashboardProps {
  books: Book[];
  members: Member[];
  peminjaman: Peminjaman[];
  onNavigate: (page: string) => void;
}

export default function Dashboard({ books, members, peminjaman, onNavigate }: DashboardProps) {
  const totalBuku = books.reduce((sum, b) => sum + b.stok, 0);
  const anggotaAktif = members.filter(m => m.aktif).length;
  const sedangDipinjam = peminjaman.filter(p => p.status === 'Dipinjam').length;
  const terlambat = peminjaman.filter(p => p.status === 'Terlambat').length;

  const recentPeminjaman = peminjaman.slice(-5).reverse();

  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card gold">
          <div className="stat-label">Total Judul Buku</div>
          <div className="stat-number">{books.length}</div>
          <div className="stat-sub">{totalBuku} eksemplar tersedia</div>
        </div>
        <div className="stat-card sage">
          <div className="stat-label">Anggota Aktif</div>
          <div className="stat-number">{anggotaAktif}</div>
          <div className="stat-sub">dari {members.length} total anggota</div>
        </div>
        <div className="stat-card ink">
          <div className="stat-label">Sedang Dipinjam</div>
          <div className="stat-number">{sedangDipinjam}</div>
          <div className="stat-sub">buku aktif dipinjam</div>
        </div>
        <div className="stat-card rust">
          <div className="stat-label">Terlambat</div>
          <div className="stat-number">{terlambat}</div>
          <div className="stat-sub">perlu tindak lanjut</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Recent peminjaman */}
        <div className="table-container">
          <div className="table-header">
            <h3>Peminjaman Terbaru</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('peminjaman')}>
              Lihat Semua
            </button>
          </div>
          {recentPeminjaman.length === 0 ? (
            <div className="empty-state">
              <ArrowLeftRight />
              <p>Belum ada data peminjaman</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Anggota</th>
                  <th>Buku</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentPeminjaman.map(p => {
                  const book = books.find(b => b.id === p.bookId);
                  const member = members.find(m => m.id === p.memberId);
                  return (
                    <tr key={p.id}>
                      <td>{member?.nama ?? '-'}</td>
                      <td style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{book?.judul ?? '-'}</td>
                      <td>
                        <span className={`badge ${p.status === 'Dikembalikan' ? 'badge-green' : p.status === 'Terlambat' ? 'badge-red' : 'badge-gold'}`}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Kategori buku */}
        <div className="table-container">
          <div className="table-header">
            <h3>Buku per Kategori</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('buku')}>
              Kelola Buku
            </button>
          </div>
          <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {Object.entries(
              books.reduce((acc, b) => {
                acc[b.kategori] = (acc[b.kategori] || 0) + 1;
                return acc;
              }, {} as Record<string, number>)
            ).sort((a, b) => b[1] - a[1]).map(([kat, count]) => (
              <div key={kat} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '13px', color: 'var(--ink-soft)', minWidth: '90px' }}>{kat}</span>
                <div style={{ flex: 1, height: '6px', background: 'var(--cream)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${(count / books.length) * 100}%`,
                    background: 'var(--gold)',
                    borderRadius: '3px',
                    transition: 'width 0.5s ease'
                  }} />
                </div>
                <span style={{ fontSize: '13px', color: 'var(--ink-muted)', minWidth: '24px', textAlign: 'right' }}>{count}</span>
              </div>
            ))}
            {books.length === 0 && <p style={{ color: 'var(--ink-muted)', fontSize: '14px' }}>Belum ada data buku.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
