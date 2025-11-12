'use server';

import CookieWatcher from './CookieWatcher';
import cookieSettingLoad from '@/lib/cookies/cookieSettingLoad';

const CookieWatchHandler = async () => {
  const settingsToGet = [
    { name: 'chat_privacy', def: false },
    {
      name: 'font_heading',
      def: 'Ubuntu, Arial, Helvetica, sans-serif',
      cssName: '--language-font-headers',
    },
    {
      name: 'font_body',
      def: 'Ubuntu, Arial, Helvetica, sans-serif',
      cssName: '--language-font',
    },
    { name: 'color_background', def: '#f8f8f9', cssName: '--background' },
    { name: 'color_foreground', def: '#3a84ff', cssName: '--foreground' },
    { name: 'color_heading', def: '#000712', cssName: '--heading-text-color' },
    { name: 'color_body', def: '#000712', cssName: '--body-text-color' },
    { name: 'lang_pref', def: true },
    { name: 'contrast_pref', def: true },
  ];

  const userSettingPrefs = (await cookieSettingLoad(settingsToGet)) ?? [];

  return (
    <>
      {userSettingPrefs.map(({ name, val, def, cssName }) => {
        return (
          <CookieWatcher
            key={name}
            cookieName={name}
            cookieVal={val}
            cookieDefVal={def}
            cssName={cssName}
          />
        );
      })}
    </>
  );
};

export default CookieWatchHandler;
