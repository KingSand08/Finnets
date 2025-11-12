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
      contrastVal: '#000000',
    },
    {
      name: 'font_body',
      def: 'Ubuntu, Arial, Helvetica, sans-serif',
      cssName: '--language-font',
      contrastVal: '#000000',
    },
    {
      name: 'color_background',
      def: '#f8f8f9',
      cssName: '--background',
      contrastVal: '#ffffff',
    },
    {
      name: 'color_foreground',
      def: '#3a84ff',
      cssName: '--foreground',
      contrastVal: '#818589',
    },
    {
      name: 'color_heading',
      def: '#000712',
      cssName: '--heading-text-color',
      contrastVal: '#000000',
    },
    {
      name: 'color_body',
      def: '#000712',
      cssName: '--body-text-color',
      contrastVal: '#000000',
    },
    { name: 'lang_pref', def: true },
    { name: 'contrast_pref', def: false },
  ];

  const userSettingPrefs = (await cookieSettingLoad(settingsToGet)) ?? [];

  return (
    <>
      {userSettingPrefs.map(({ name, val, def, cssName, contrastVal }) => {
        return (
          <CookieWatcher
            key={name}
            cookieName={name}
            cookieVal={val}
            cookieDefVal={def}
            cssName={cssName}
            contrastVal={contrastVal}
          />
        );
      })}
    </>
  );
};

export default CookieWatchHandler;
