'use client';

const { useEffect } = require('react');

const CookieWatcher = ({ cookieName, cookieVal, cookieDefVal, cssName }) => {
  useEffect(() => {
    console.log(
      '{',
      cookieName,
      ': (val) ',
      cookieVal,
      '; (def)',
      cookieDefVal,
      '}'
    );
    const root = document.documentElement;
    if (!cookieVal && cssName) {
      root.style.setProperty(cssName, cookieDefVal);
    } else if (cssName) {
      if (cookieName.includes('font')) {
        root.style.setProperty(
          cssName,
          `${cookieVal}, Arial, Helvetica, sans-serif`
        );
      } else {
        root.style.setProperty(cssName, cookieVal);
      }
    }
  }, [cookieName, cookieVal, cookieDefVal, cssName]);
};

export default CookieWatcher;
