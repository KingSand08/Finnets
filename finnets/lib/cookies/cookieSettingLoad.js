import { getSettingPreference, setSettingCookie } from './Cookie';

export async function cookieSettingLoad(settings) {
  const results = await Promise.all(
    settings.map(async ({ name, def, cssName }) => {
      const cookiePref = (await getSettingPreference(name)) ?? null;
      // console.log('{', name, ': ', cookiePref, '}', '|| def: ', def);
      return {
        name: name,
        val: cookiePref,
        def: def,
        cssName: cssName ?? null,
      };
    })
  );

  return results;
}

export default cookieSettingLoad;
