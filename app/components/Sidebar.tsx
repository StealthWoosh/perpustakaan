'use client';

import { BookOpen, Users, ArrowLeftRight, LayoutDashboard, GraduationCap } from 'lucide-react';

interface SidebarProps {
  active: string;
  onNavigate: (page: string) => void;
}

export default function Sidebar({ active, onNavigate }: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, section: 'Utama' },
    { id: 'buku', label: 'Koleksi Buku', icon: BookOpen, section: 'Kelola' },
    { id: 'anggota', label: 'Anggota', icon: Users, section: 'Kelola' },
    { id: 'peminjaman', label: 'Peminjaman', icon: ArrowLeftRight, section: 'Transaksi' },
  ];

  const sections = [...new Set(navItems.map(i => i.section))];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <GraduationCap size={22} color="var(--gold)" />
          <h1>Perpustakaan<br />Sekolah</h1>
        </div>
        <p>Sistem Manajemen Buku</p>
      </div>
      <nav className="sidebar-nav">
        {sections.map(section => (
          <div key={section}>
            <p className="nav-section-label">{section}</p>
            {navItems.filter(i => i.section === section).map(item => (
              <button
                key={item.id}
                className={`nav-item${active === item.id ? ' active' : ''}`}
                onClick={() => onNavigate(item.id)}
              >
                <item.icon />
                {item.label}
              </button>
            ))}
          </div>
        ))}
      </nav>
      <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)', lineHeight: '1.5' }}>
          SMA Negeri 1 Nusantara<br />
          Tahun Ajaran 2024/2025
        </p>
      </div>
    </aside>
  );
}
