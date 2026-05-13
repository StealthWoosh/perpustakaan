'use client';

import { useState } from 'react';
import { Plus, Search, Pencil, Trash2, ArrowLeftRight, X, RotateCcw } from 'lucide-react';
import { Book, Member, Peminjaman } from '../types';

interface PeminjamanPageProps {
  peminjaman: Peminjaman[];
  books: Book[];
  members: Member[];
  onAdd: (p: Omit<Peminjaman, 'id'>) => void;
  onUpdate: (id: string, p: Partial<Peminjaman>) => void;
  onDelete: (id: string) => void;
}

const today = () => new Date().toISOString().split('T')[0];
const daysLater = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().split('T')[0];
};

const DENDA_PER_DAY = 1000;

export default function PeminjamanPage({ peminjaman, books, members, onAdd, onUpdate, onDelete }: PeminjamanPageProps) {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Peminjaman | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState('Semua');
  const [form, setForm] = useState({
    bookId: '', memberId: '',
    tanggalPinjam: today(), tanggalKembali: daysLater(14),
    status: 'Dipinjam' as Peminjaman['status'], denda: 0,
    tanggalDikembalikan: ''
  });

  const filtered = peminjaman.filter(p => {
    const book = books.find(b => b.id === p.bookId);
    const member = members.find(m => m.id === p.memberId);
    const matchSearch = book?.judul.toLowerCase().includes(search.toLowerCase()) ||
      member?.nama.toLowerCase().includes(search.toLowerCase()) || false;
    const matchStatus = filterStatus === 'Semua' || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const openAdd = () => {
    setForm({ bookId: '', memberId: '', tanggalPinjam: today(), tanggalKembali: daysLater(14), status: 'Dipinjam', denda: 0, tanggalDikembalikan: '' });
    setEditTarget(null);
    setModalOpen(true);
  };

  const openEdit = (p: Peminjaman) => {
    setForm({
      bookId: p.bookId, memberId: p.memberId,
      tanggalPinjam: p.tanggalPinjam, tanggalKembali: p.tanggalKembali,
      status: p.status, denda: p.denda,
      tanggalDikembalikan: p.tanggalDikembalikan || ''
    });
    setEditTarget(p);
    setModalOpen(true);
  };

  const handleKembali = (p: Peminjaman) => {
    const returned = today();
    const due = new Date(p.tanggalKembali);
    const ret = new Date(returned);
    const diff = Math.floor((ret.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
    const denda = diff > 0 ? diff * DENDA_PER_DAY : 0;
    onUpdate(p.id, {
      status: denda > 0 ? 'Terlambat' : 'Dikembalikan',
      tanggalDikembalikan: returned,
      denda
    });
  };

  const handleSave = () => {
    if (!form.bookId || !form.memberId) return;
    if (editTarget) {
      onUpdate(editTarget.id, form);
    } else {
      onAdd({ ...form, tanggalDikembalikan: form.tanggalDikembalikan || undefined });
    }
    setModalOpen(false);
  };

  const formatRupiah = (n: number) => n === 0 ? '-' : `Rp ${n.toLocaleString('id-ID')}`;

  return (
    <div>
      <div className="tab-nav">
        {['Semua', 'Dipinjam', 'Dikembalikan', 'Terlambat'].map(s => (
          <button key={s} className={`tab-btn${filterStatus === s ? ' active' : ''}`} onClick={() => setFilterStatus(s)}>{s}</button>
        ))}
      </div>

      <div className="table-container">
        <div className="table-header">
          <h3>Data Peminjaman <span style={{ color: 'var(--ink-muted)', fontFamily: 'DM Sans', fontSize: '14px', fontWeight: 400 }}>({filtered.length} transaksi)</span></h3>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div className="search-box">
              <Search />
              <input placeholder="Cari buku atau anggota..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <button className="btn btn-primary" onClick={openAdd}>
              <Plus /> Tambah Peminjaman
            </button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <ArrowLeftRight />
            <h3>Belum ada data peminjaman</h3>
            <p>Catat transaksi peminjaman buku baru</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Buku</th>
                <th>Peminjam</th>
                <th>Tgl Pinjam</th>
                <th>Tgl Kembali</th>
                <th>Status</th>
                <th>Denda</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => {
                const book = books.find(b => b.id === p.bookId);
                const member = members.find(m => m.id === p.memberId);
                return (
                  <tr key={p.id}>
                    <td style={{ color: 'var(--ink-muted)', fontSize: '13px' }}>{i + 1}</td>
                    <td>
                      <div style={{ fontWeight: 500, color: 'var(--ink)', fontSize: '13px', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {book?.judul ?? <span style={{ color: 'var(--rust)' }}>Buku dihapus</span>}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>{book?.pengarang}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500, color: 'var(--ink)', fontSize: '13px' }}>{member?.nama ?? <span style={{ color: 'var(--rust)' }}>Anggota dihapus</span>}</div>
                      <div style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>{member?.kelas}</div>
                    </td>
                    <td style={{ fontSize: '13px', color: 'var(--ink-muted)' }}>{p.tanggalPinjam}</td>
                    <td style={{ fontSize: '13px', color: p.status === 'Terlambat' ? 'var(--rust)' : 'var(--ink-muted)' }}>
                      {p.tanggalDikembalikan ?? p.tanggalKembali}
                    </td>
                    <td>
                      <span className={`badge ${p.status === 'Dikembalikan' ? 'badge-green' : p.status === 'Terlambat' ? 'badge-red' : 'badge-gold'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '13px', color: p.denda > 0 ? 'var(--rust)' : 'var(--ink-muted)', fontWeight: p.denda > 0 ? 500 : 400 }}>
                      {formatRupiah(p.denda)}
                    </td>
                    <td>
                      <div className="actions">
                        {p.status === 'Dipinjam' && (
                          <button className="btn btn-ghost btn-sm" title="Kembalikan buku" onClick={() => handleKembali(p)}>
                            <RotateCcw style={{ width: '14px', height: '14px' }} />
                          </button>
                        )}
                        <button className="btn btn-ghost btn-sm" onClick={() => openEdit(p)}><Pencil /></button>
                        <button className="btn btn-danger btn-sm" onClick={() => setDeleteConfirm(p.id)}><Trash2 /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModalOpen(false)}>
          <div className="modal">
            <div className="modal-head">
              <h3>{editTarget ? 'Edit Peminjaman' : 'Tambah Peminjaman'}</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setModalOpen(false)}><X /></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Buku *</label>
                <select value={form.bookId} onChange={e => setForm({ ...form, bookId: e.target.value })}>
                  <option value="">-- Pilih Buku --</option>
                  {books.map(b => <option key={b.id} value={b.id}>{b.judul} — {b.pengarang} (stok: {b.stok})</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Anggota *</label>
                <select value={form.memberId} onChange={e => setForm({ ...form, memberId: e.target.value })}>
                  <option value="">-- Pilih Anggota --</option>
                  {members.filter(m => m.aktif).map(m => <option key={m.id} value={m.id}>{m.nama} — {m.kelas}</option>)}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Tanggal Pinjam</label>
                  <input type="date" value={form.tanggalPinjam} onChange={e => setForm({ ...form, tanggalPinjam: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Tanggal Kembali</label>
                  <input type="date" value={form.tanggalKembali} onChange={e => setForm({ ...form, tanggalKembali: e.target.value })} />
                </div>
              </div>
              {editTarget && (
                <div className="form-row">
                  <div className="form-group">
                    <label>Status</label>
                    <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as Peminjaman['status'] })}>
                      <option value="Dipinjam">Dipinjam</option>
                      <option value="Dikembalikan">Dikembalikan</option>
                      <option value="Terlambat">Terlambat</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Denda (Rp)</label>
                    <input type="number" min="0" step="1000" value={form.denda} onChange={e => setForm({ ...form, denda: Number(e.target.value) })} />
                  </div>
                </div>
              )}
            </div>
            <div className="modal-foot">
              <button className="btn btn-ghost" onClick={() => setModalOpen(false)}>Batal</button>
              <button className="btn btn-primary" onClick={handleSave}>
                {editTarget ? 'Simpan Perubahan' : 'Catat Peminjaman'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setDeleteConfirm(null)}>
          <div className="modal" style={{ maxWidth: '400px' }}>
            <div className="modal-head">
              <h3>Hapus Data Peminjaman</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setDeleteConfirm(null)}><X /></button>
            </div>
            <div className="modal-body">
              <p style={{ color: 'var(--ink-soft)', fontSize: '15px' }}>Apakah kamu yakin ingin menghapus data peminjaman ini?</p>
            </div>
            <div className="modal-foot">
              <button className="btn btn-ghost" onClick={() => setDeleteConfirm(null)}>Batal</button>
              <button className="btn btn-danger" onClick={() => { onDelete(deleteConfirm); setDeleteConfirm(null); }}>
                <Trash2 /> Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
