import { NextResponse } from 'next/server';

const SUPABASE_URL = 'https://tqvbkrfcbvbjsubbllfc.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const headers = () => ({
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
});

// PUT /api/members/[id]
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();

  const payload = {
    nama: body.nama,
    nis: Number(body.nis),
    kelas: body.kelas,
    email: body.email,
    telepon: Number(body.telepon),
    status: body.aktif ? 'Aktif' : 'Tidak Aktif',
    alamat: body.alamat,
  };

  const res = await fetch(`${SUPABASE_URL}/rest/v1/members?id=eq.${id}`, {
    method: 'PATCH',
    headers: {
      ...headers(),
      'Prefer': 'return=representation',
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

// DELETE /api/members/[id]
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const res = await fetch(`${SUPABASE_URL}/rest/v1/members?id=eq.${id}`, {
    method: 'DELETE',
    headers: headers(),
  });

  return NextResponse.json({ success: true }, { status: res.status });
}
