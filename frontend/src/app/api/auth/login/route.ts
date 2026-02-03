import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { AUTH_COOKIE, AUTH_COOKIE_BASE, AUTH_MAX_AGE_SECONDS, isSecureCookie } from '@/lib/auth';

export const runtime = 'nodejs';

type LoginBody = { email?: string; password?: string };

export async function POST(req: Request) {
  let body: LoginBody = {};
  try { body = await req.json() as LoginBody; } catch {}
  const { email, password } = body || {} as LoginBody;
  
  if (!email || !password) {
    return NextResponse.json({ ok:false, error:'Missing email or password' }, { status:400 });
  }

  const supabase = createAdminClient();
  
  // Sign in with Supabase
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.session) {
    return NextResponse.json({ ok:false, error: error?.message || 'Invalid credentials' }, { status:401 });
  }

  // Store the access token in a cookie
  const res = NextResponse.json({ ok:true });
  res.cookies.set(AUTH_COOKIE, data.session.access_token, {
    ...AUTH_COOKIE_BASE,
    httpOnly: true,
    secure: isSecureCookie(),
    maxAge: AUTH_MAX_AGE_SECONDS,
  });
  return res;
}
