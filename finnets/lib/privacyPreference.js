'use server';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'privacy_db_access';
const ENABLED = 'enabled';
const DISABLED = 'disabled';

export async function getPrivacyPreference() {
	try {
		const store = await cookies();
		const value = store.get(COOKIE_NAME)?.value;
		// Default to enabled (allow access) if not set
		return value !== DISABLED;
	} catch {
		return true;
	}
}

export async function setPrivacyPreference(prevState, formData) {
	try {
		const value = formData.get('value');
		const enabled = value === 'on';
		const store = await cookies();
		store.set(COOKIE_NAME, enabled ? ENABLED : DISABLED, {
			httpOnly: false,
			sameSite: 'lax',
			secure: process.env.NODE_ENV === 'production',
			path: '/',
			maxAge: 60 * 60 * 24 * 365,
		});
		return enabled ? ENABLED : DISABLED;
	} catch {
		return prevState;
	}
}

