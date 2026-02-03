import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST() {
  const supabase = await createClient();
  
  // Sign out from Supabase - this automatically clears the session cookies
  await supabase.auth.signOut();
  
  return NextResponse.json({ ok:true });
}
