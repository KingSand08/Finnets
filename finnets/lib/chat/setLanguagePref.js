import { getSettingPreference, setSettingCookie } from '../cookies/Cookie';

export async function setLanguagePref(prevState, formData) {
  try {
    const lang = formData.get('lang');
    if (typeof lang !== 'string' || lang.length === 0) return prevState;

    const saved = await setSettingCookie(prevState, 'language_pref', lang);
    return saved;
  } catch (e) {
    console.log(e);
    return prevState;
  }
}

export async function getLanguagePref() {
  try {
    const v = await getSettingPreference('language_pref');
    return v.replace(/%20/g, ' ') || null;
  } catch (e) {
    return null;
  }
}
