'use server';

import { updateSession } from '@/lib/auth/updateSession';
import { pageRedirections } from '@/lib/auth/pageRedirections';
import { NextResponse } from 'next/server';

export async function middleware(request) {
  await pageRedirections(request);
  const redirect = await pageRedirections(request);
  if (redirect) return redirect;
  const updatedRes = await updateSession(request);
  return updatedRes ?? NextResponse.next();
}
