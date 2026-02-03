import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { AUTH_COOKIE, AUTH_COOKIE_BASE, isSecureCookie } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get(AUTH_COOKIE);
  
  if (authToken) {
    const supabase = createAdminClient();
    // Sign out from Supabase
    await supabase.auth.signOut();
  }
  
  const res = NextResponse.json({ ok:true });
  res.cookies.set(AUTH_COOKIE, '', {
    ...AUTH_COOKIE_BASE,
    httpOnly: true,
    secure: isSecureCookie(),
    maxAge: 0,
  });
  return res;
}
