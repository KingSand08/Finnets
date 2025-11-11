import { getPrivacyPreference } from '@/lib/settings/settingControls';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // don't cache

export async function GET() {
  try {
    const value = await getPrivacyPreference('chat_priv');
    if (value === null) {
      return NextResponse.json(false);
    }
    return NextResponse.json(value);
  } catch (err) {
    console.error('getPrivacyStatus error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch privacy status' },
      { status: 500 }
    );
  }
}
