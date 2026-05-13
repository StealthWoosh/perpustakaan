import { NextResponse } from 'next/server';

const SUPABASE_URL = 'https://tqvbkrfcbvbjsubbllfc.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const headers = () => ({
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
});

// GET /api/members
export async function GET() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/members?select=*&order=id.asc`, {
    headers: headers(),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

// POST /api/members
export async function POST(request: Request) {
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

  const res = await fetch(`${SUPABASE_URL}/rest/v1/members`, {
    method: 'POST',
    headers: {
      ...headers(),
      'Prefer': 'return=representation',
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
