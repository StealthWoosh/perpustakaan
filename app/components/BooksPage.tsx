'use client';

import { useState } from 'react';
import { Plus, Search, Pencil, Trash2, BookOpen, X } from 'lucide-react';
import { Book, BookCategory } from '../types';

const CATEGORIES: BookCategory[] = ['Fiksi', 'Non-Fiksi', 'Sains', 'Sejarah', 'Teknologi', 'Sastra', 'Matematika', 'Biologi'];

interface BooksPageProps {
  books: Book[];
  onAdd: (b: Omit<Book, 'id' | 'createdAt'>) => void;
  onUpdate: (id: string, b: Partial<Book>) => void;
  onDelete: (id: string) => void;
}

const emptyForm = {
  judul: '', pengarang: '', isbn: '', kategori: 'Fiksi' as BookCategory,
  tahunTerbit: new Date().getFullYear(), stok: 1, deskripsi: ''
};

export default function BooksPage({ books, onAdd, onUpdate, onDelete }: BooksPageProps) {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Book | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [filterKat, setFilterKat] = useState('Semua');

  const filtered = books.filter(b => {
    const matchSearch = b.judul.toLowerCase().includes(search.toLowerCase()) ||
      b.pengarang.toLowerCase().includes(search.toLowerCase());
    const matchKat = filterKat === 'Semua' || b.kategori === filterKat;
    return matchSearch && matchKat;
  });

  const openAdd = () => {
    setForm({ ...emptyForm });
    setEditTarget(null);
    setModalOpen(true);
  };

  const openEdit = (b: Book) => {
    setForm({ judul: b.judul, pengarang: b.pengarang, isbn: b.isbn, kategori: b.kategori, tahunTerbit: b.tahunTerbit, stok: b.stok, deskripsi: b.deskripsi });
    setEditTarget(b);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.judul.trim() || !form.pengarang.trim()) return;
    if (editTarget) {
      onUpdate(editTarget.id, form);
    } else {
      onAdd(form);
    }
    setModalOpen(false);
  };

  return (
    <div>
      {/* Filter tabs */}
      <div className="tab-nav">
        {['Semua', ...CATEGORIES].map(kat => (
          <button key={kat} className={`tab-btn${filterKat === kat ? ' active' : ''}`} onClick={() => setFilterKat(kat)}>
            {kat}
          </button>
        ))}
      </div>

      <div className="table-container">
        <div className="table-header">
          <h3>Koleksi Buku <span style={{ color: 'var(--ink-muted)', fontFamily: 'DM Sans', fontSize: '14px', fontWeight: 400 }}>({filtered.length} judul)</span></h3>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div className="search-box">
              <Search />
              <input placeholder="Cari judul atau pengarang..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <button className="btn btn-primary" onClick={openAdd}>
              <Plus /> Tambah Buku
            </button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <BookOpen />
            <h3>Belum ada buku</h3>
            <p>Tambahkan koleksi buku pertama perpustakaan</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Judul & Pengarang</th>
                <th>ISBN</th>
                <th>Kategori</th>
                <th>Tahun</th>
                <th>Stok</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b, i) => (
                <tr key={b.id}>
                  <td style={{ color: 'var(--ink-muted)', fontSize: '13px' }}>{i + 1}</td>
                  <td>
                    <div style={{ fontWeight: 500, color: 'var(--ink)' }}>{b.judul}</div>
                    <div style={{ fontSize: '12px', color: 'var(--ink-muted)', marginTop: '2px' }}>{b.pengarang}</div>
                  </td>
                  <td style={{ fontSize: '12px', color: 'var(--ink-muted)', fontFamily: 'monospace' }}>{b.isbn}</td>
                  <td><span className="kategori-tag">{b.kategori}</span></td>
                  <td>{b.tahunTerbit}</td>
                  <td>
                    <span className={`badge ${b.stok > 3 ? 'badge-green' : b.stok > 0 ? 'badge-gold' : 'badge-red'}`}>
                      {b.stok} eks
                    </span>
                  </td>
                  <td>
                    <div className="actions">
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(b)}><Pencil /></button>
                      <button className="btn btn-danger btn-sm" onClick={() => setDeleteConfirm(b.id)}><Trash2 /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal form */}
      {modalOpen && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModalOpen(false)}>
          <div className="modal">
            <div className="modal-head">
              <h3>{editTarget ? 'Edit Buku' : 'Tambah Buku Baru'}</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setModalOpen(false)}><X /></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Judul Buku *</label>
                <input value={form.judul} onChange={e => setForm({ ...form, judul: e.target.value })} placeholder="Masukkan judul buku" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Pengarang *</label>
                  <input value={form.pengarang} onChange={e => setForm({ ...form, pengarang: e.target.value })} placeholder="Nama pengarang" />
                </div>
                <div className="form-group">
                  <label>ISBN</label>
                  <input value={form.isbn} onChange={e => setForm({ ...form, isbn: e.target.value })} placeholder="ISBN buku" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Kategori</label>
                  <select value={form.kategori} onChange={e => setForm({ ...form, kategori: e.target.value as BookCategory })}>
                    {CATEGORIES.map(k => <option key={k} value={k}>{k}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Tahun Terbit</label>
                  <input type="number" min="1900" max={new Date().getFullYear()} value={form.tahunTerbit} onChange={e => setForm({ ...form, tahunTerbit: Number(e.target.value) })} />
                </div>
              </div>
              <div className="form-group">
                <label>Jumlah Stok</label>
                <input type="number" min="0" value={form.stok} onChange={e => setForm({ ...form, stok: Number(e.target.value) })} />
              </div>
              <div className="form-group">
                <label>Deskripsi</label>
                <textarea rows={3} value={form.deskripsi} onChange={e => setForm({ ...form, deskripsi: e.target.value })} placeholder="Deskripsi singkat buku..." style={{ resize: 'vertical' }} />
              </div>
            </div>
            <div className="modal-foot">
              <button className="btn btn-ghost" onClick={() => setModalOpen(false)}>Batal</button>
              <button className="btn btn-primary" onClick={handleSave}>
                {editTarget ? 'Simpan Perubahan' : 'Tambah Buku'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setDeleteConfirm(null)}>
          <div className="modal" style={{ maxWidth: '400px' }}>
            <div className="modal-head">
              <h3>Hapus Buku</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setDeleteConfirm(null)}><X /></button>
            </div>
            <div className="modal-body">
              <p style={{ color: 'var(--ink-soft)', fontSize: '15px' }}>
                Apakah kamu yakin ingin menghapus buku <strong>{books.find(b => b.id === deleteConfirm)?.judul}</strong>? Tindakan ini tidak dapat dibatalkan.
              </p>
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
