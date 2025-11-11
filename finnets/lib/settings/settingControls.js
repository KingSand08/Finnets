'use server';
import { revalidatePath } from 'next/cache';
import { getSettingPreference, setSettingCookie } from '../setCookie';

const ENABLED = 'enabled';
const DISABLED = 'disabled';

export async function getPrivacyPreference() {
  const value = await getSettingPreference('chat_privacy');
  return value !== DISABLED;
}

export async function setPrivacyPreference(prevState, formData) {
  const enabled = formData.get('value') === 'on';
  const vars = enabled ? ENABLED : DISABLED;
  const value = await setSettingCookie(prevState, 'chat_privacy', vars);
  revalidatePath('/settings');
  return value;
}

export async function setFontHeadings(prevState, formData) {
  try {
    const font = formData.get('value');
    if (typeof font !== 'string' || font.length === 0) return prevState;

    const saved = await setSettingCookie(prevState, 'font_heading', font);

    revalidatePath('/settings');

    return saved;
  } catch {
    return prevState;
  }
}

export async function getFontHeadings() {
  try {
    const v = await getSettingPreference('font_heading');
    return v;
  } catch {
    return null;
  }
}

export async function setFontBody(prevState, formData) {
  try {
    const font = formData.get('value');
    if (typeof font !== 'string' || font.length === 0) return prevState;

    const saved = await setSettingCookie(prevState, 'font_body', font);

    revalidatePath('/settings');

    return saved;
  } catch {
    return prevState;
  }
}

export async function getFontBody() {
  try {
    const v = await getSettingPreference('font_body');
    return v;
  } catch {
    return null;
  }
}

export async function getBackgroundColor() {
  try {
    const v = await getSettingPreference('color_background');
    return v.replace(/%23/g, '#') || null;
  } catch {
    return null;
  }
}

export async function getForegroundColor() {
  try {
    const v = await getSettingPreference('color_foreground');
    return v.replace(/%23/g, '#') || null;
  } catch {
    null;
  }
}

export async function getHeadingColor() {
  try {
    const v = await getSettingPreference('color_heading');
    return v.replace(/%23/g, '#');
  } catch {
    return null;
  }
}
export async function getBodyColor() {
  try {
    const v = await getSettingPreference('color_body');
    return v.replace(/%23/g, '#');
  } catch {
    return 'null';
  }
}

function isValidHex6(s) {
  return typeof s === 'string' && /^#[0-9A-Fa-f]{6}$/.test(s);
}

export async function setBackgroundColor(prevState, formData) {
  try {
    const color = formData.get('userColor');
    if (!isValidHex6(color)) return prevState;
    const saved = await setSettingCookie(prevState, 'color_background', color);
    revalidatePath('/settings');
    return saved;
  } catch {
    return prevState;
  }
}

export async function setForegroundColor(prevState, formData) {
  try {
    const color = formData.get('userColor');
    if (!isValidHex6(color)) return prevState;
    const saved = await setSettingCookie(prevState, 'color_foreground', color);
    revalidatePath('/settings');
    return saved;
  } catch {
    return prevState;
  }
}

export async function setHeadingColor(prevState, formData) {
  try {
    const color = formData.get('userColor');
    if (!isValidHex6(color)) return prevState;
    const saved = await setSettingCookie(prevState, 'color_heading', color);
    revalidatePath('/settings');
    return saved;
  } catch {
    return prevState;
  }
}

export async function setBodyColor(prevState, formData) {
  try {
    const color = formData.get('userColor');
    if (!isValidHex6(color)) return prevState;
    const saved = await setSettingCookie(prevState, 'color_body', color);
    revalidatePath('/settings');
    return saved;
  } catch {
    return prevState;
  }
}

export async function getLanguagePreference() {
  const value = await getSettingPreference('lang_pref');
  return value !== DISABLED;
}

export async function setLanguagePreference(prevState, formData) {
  const enabled = formData.get('value') === 'on';
  const vars = enabled ? ENABLED : DISABLED;
  const value = await setSettingCookie(prevState, 'lang_pref', vars);
  revalidatePath('/settings');
  return value;
}

export async function getContrastPreference() {
  const value = await getSettingPreference('contrast_pref');
  return value !== DISABLED;
}

export async function setContrastPreference(prevState, formData) {
  const enabled = formData.get('value') === 'on';
  const vars = enabled ? ENABLED : DISABLED;
  const value = await setSettingCookie(prevState, 'contrast_pref', vars);
  revalidatePath('/settings');
  return value;
}

export async function getSearchPreference() {
  const value = await getSettingPreference('contrast_pref');
  return value !== DISABLED;
}

export async function setSearchPreference(prevState, formData) {
  const enabled = formData.get('value') === 'on';
  const vars = enabled ? ENABLED : DISABLED;
  const value = await setSettingCookie(prevState, 'contrast_pref', vars);
  revalidatePath('/settings');
  return value;
}
