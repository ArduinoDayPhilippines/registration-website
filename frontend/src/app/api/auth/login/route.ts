import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

type LoginBody = { email?: string; password?: string };

export async function POST(req: Request) {
  let body: LoginBody = {};
  try { body = await req.json() as LoginBody; } catch {}
  const { email, password } = body || {} as LoginBody;
  
  if (!email || !password) {
    return NextResponse.json({ ok:false, error:'Missing email or password' }, { status:400 });
  }

  const supabase = await createClient();
  
  // Sign in with Supabase - this automatically sets the session cookies
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.session) {
    return NextResponse.json({ ok:false, error: error?.message || 'Invalid credentials' }, { status:401 });
  }

  return NextResponse.json({ ok:true });
}
