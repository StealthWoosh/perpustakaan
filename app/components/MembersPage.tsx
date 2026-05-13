'use client';

import { useState } from 'react';
import { Plus, Search, Pencil, Trash2, Users, X, UserCheck, UserX } from 'lucide-react';
import { Member } from '../types';

interface MembersPageProps {
  members: Member[];
  onAdd: (m: Omit<Member, 'id'>) => void;
  onUpdate: (id: string, m: Partial<Member>) => void;
  onDelete: (id: string) => void;
}

const emptyForm = {
  nama: '', nis: '', kelas: '', email: '', telepon: '', alamat: '',
  tanggalDaftar: new Date().toISOString().split('T')[0], aktif: true
};

const KELAS_OPTIONS = [
  'X MIPA 1', 'X MIPA 2', 'X MIPA 3', 'X IPS 1', 'X IPS 2',
  'XI MIPA 1', 'XI MIPA 2', 'XI MIPA 3', 'XI IPS 1', 'XI IPS 2',
  'XII MIPA 1', 'XII MIPA 2', 'XII IPA 1', 'XII IPA 2', 'XII IPS 1', 'XII IPS 2',
];

export default function MembersPage({ members, onAdd, onUpdate, onDelete }: MembersPageProps) {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Member | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState('Semua');

  const filtered = members.filter(m => {
    const matchSearch = m.nama.toLowerCase().includes(search.toLowerCase()) ||
      m.nis.includes(search) || m.kelas.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'Semua' || (filterStatus === 'Aktif' ? m.aktif : !m.aktif);
    return matchSearch && matchStatus;
  });

  const openAdd = () => {
    setForm({ ...emptyForm });
    setEditTarget(null);
    setModalOpen(true);
  };

  const openEdit = (m: Member) => {
    setForm({ nama: m.nama, nis: m.nis, kelas: m.kelas, email: m.email, telepon: m.telepon, tanggalDaftar: m.tanggalDaftar, aktif: m.aktif, alamat: m.alamat, });
    setEditTarget(m);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.nama.trim() || !form.nis.trim()) return;
    if (editTarget) {
      onUpdate(editTarget.id, form);
    } else {
      onAdd(form);
    }
    setModalOpen(false);
  };

  const getInitials = (nama: string) => nama.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();

  return (
    <div>
      <div className="tab-nav">
        {['Semua', 'Aktif', 'Tidak Aktif'].map(s => (
          <button key={s} className={`tab-btn${filterStatus === s ? ' active' : ''}`} onClick={() => setFilterStatus(s)}>{s}</button>
        ))}
      </div>

      <div className="table-container">
        <div className="table-header">
          <h3>Daftar Anggota <span style={{ color: 'var(--ink-muted)', fontFamily: 'DM Sans', fontSize: '14px', fontWeight: 400 }}>({filtered.length} anggota)</span></h3>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div className="search-box">
              <Search />
              <input placeholder="Cari nama, NIS, atau kelas..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <button className="btn btn-primary" onClick={openAdd}>
              <Plus /> Tambah Anggota
            </button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <Users />
            <h3>Belum ada anggota</h3>
            <p>Tambahkan anggota perpustakaan baru</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Anggota</th>
                <th>NIS</th>
                <th>Kelas</th>
                <th>Kontak</th>
                <th>Tgl Daftar</th>
                <th>Status</th>
                <th>Alamat</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m, i) => (
                <tr key={m.id}>
                  <td style={{ color: 'var(--ink-muted)', fontSize: '13px' }}>{i + 1}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '34px', height: '34px', borderRadius: '50%', background: 'var(--gold-pale)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '12px', fontWeight: 600, color: 'var(--gold)', flexShrink: 0
                      }}>
                        {getInitials(m.nama)}
                      </div>
                      <span style={{ fontWeight: 500, color: 'var(--ink)' }}>{m.nama}</span>
                    </div>
                  </td>
                  <td style={{ fontSize: '13px', fontFamily: 'monospace', color: 'var(--ink-muted)' }}>{m.nis}</td>
                  <td>{m.kelas}</td>
                  <td>
                    <div style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>
                      <div>{m.email}</div>
                      <div>{m.telepon}</div>
                    </div>
                  </td>
                  <td style={{ fontSize: '13px', color: 'var(--ink-muted)' }}>{m.tanggalDaftar}</td>
                  <td>
                    <span className={`badge ${m.aktif ? 'badge-green' : 'badge-gray'}`}>
                      {m.aktif ? 'Aktif' : 'Non-Aktif'}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>
                      <div>{m.alamat}</div>
                    </div>
                  </td>
                  <td>
                    <div className="actions">
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(m)}><Pencil /></button>
                      <button className="btn btn-danger btn-sm" onClick={() => setDeleteConfirm(m.id)}><Trash2 /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModalOpen(false)}>
          <div className="modal">
            <div className="modal-head">
              <h3>{editTarget ? 'Edit Anggota' : 'Tambah Anggota Baru'}</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setModalOpen(false)}><X /></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Nama Lengkap *</label>
                <input value={form.nama} onChange={e => setForm({ ...form, nama: e.target.value })} placeholder="Masukkan nama lengkap" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>NIS *</label>
                  <input value={form.nis} onChange={e => setForm({ ...form, nis: e.target.value })} placeholder="Nomor Induk Siswa" />
                </div>
                <div className="form-group">
                  <label>Kelas</label>
                  <select value={form.kelas} onChange={e => setForm({ ...form, kelas: e.target.value })}>
                    <option value="">Pilih kelas</option>
                    {KELAS_OPTIONS.map(k => <option key={k} value={k}>{k}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="email@sekolah.ac.id" />
                </div>
                <div className="form-group">
                  <label>Telepon</label>
                  <input value={form.telepon} onChange={e => setForm({ ...form, telepon: e.target.value })} placeholder="08xxxxxxxxxx" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Tanggal Daftar</label>
                  <input type="date" value={form.tanggalDaftar} onChange={e => setForm({ ...form, tanggalDaftar: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select value={form.aktif ? 'aktif' : 'nonaktif'} onChange={e => setForm({ ...form, aktif: e.target.value === 'aktif' })}>
                    <option value="aktif">Aktif</option>
                    <option value="nonaktif">Non-Aktif</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Alamat</label>
                  <input value={form.alamat} onChange={e => setForm({ ...form, alamat: e.target.value })} placeholder="Alamat" />
                </div>
              </div>
            </div>
            <div className="modal-foot">
              <button className="btn btn-ghost" onClick={() => setModalOpen(false)}>Batal</button>
              <button className="btn btn-primary" onClick={handleSave}>
                {editTarget ? 'Simpan Perubahan' : 'Tambah Anggota'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setDeleteConfirm(null)}>
          <div className="modal" style={{ maxWidth: '400px' }}>
            <div className="modal-head">
              <h3>Hapus Anggota</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setDeleteConfirm(null)}><X /></button>
            </div>
            <div className="modal-body">
              <p style={{ color: 'var(--ink-soft)', fontSize: '15px' }}>
                Apakah kamu yakin ingin menghapus anggota <strong>{members.find(m => m.id === deleteConfirm)?.nama}</strong>?
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
