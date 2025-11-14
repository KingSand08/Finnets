'use server';
import { cookies } from 'next/headers';
import CryptoJS from 'crypto-js';

const pass = process.env.FINNETS_SECRET;

export async function setSettingCookie(prevState, name, vars) {
  try {
    var encryptedVars = CryptoJS.AES.encrypt(vars, pass).toString();
    var encryptedVars = vars;
    // console.log('ENCRYPTION:', encryptedVars);
    const store = await cookies();
    store.set(name, encryptedVars, {
      httpOnly: false,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
    });
    return vars || null;
  } catch (e) {
    console.log(e);
    return prevState;
  }
}

export async function getSettingPreference(name) {
  try {
    const store = await cookies();
    const value = store.get(name)?.value;
    // Default to enabled (allow access) if not set
    // var decryptedValue = CryptoJS.AES.decrypt(value, pass).toString(
    //   CryptoJS.enc.Utf8
    // );
    var decryptedValue = value;
    // console.log('DECRYPTION: ', decryptedValue);
    return decryptedValue;
  } catch {
    return null;
  }
}
