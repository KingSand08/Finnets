'use client';
import { useEffect, useRef } from 'react';

const CookieWatcher = ({
  cookieName,
  cookieVal,
  cookieDefVal,
  cssName,
  contrastVal,
}) => {
  const lastApplied = useRef(null);

  useEffect(() => {
    const root = document.documentElement;

    const isContrastEnabled = () => {
      const m = document.cookie.match(/(?:^|; )contrast_pref=([^;]*)/);
      const v = m ? decodeURIComponent(m[1]).toLowerCase() : null;
      return v === 'true' || v === '1' || v === 'on' || v === 'enabled';
    };

    const applyDefault = () => {
      if (isContrastEnabled()) {
        applyContrast();
        return;
      }

      if (cookieDefVal != null && cookieDefVal !== '') {
        // Only write if the value actually changed and isn't already set inline
        if (
          lastApplied.current !== cookieDefVal &&
          root.style.getPropertyValue(cssName).trim() !== cookieDefVal
        ) {
          if (cookieName.includes('font'))
            root.style.setProperty(
              cssName,
              `${cookieDefVal}, Arial, Helvetica, sans-serif`
            );
          else root.style.setProperty(cssName, cookieDefVal);
          lastApplied.current = cookieDefVal;
        }
      } else {
        // No default: remove the inline variable to fall back to stylesheet
        if (lastApplied.current !== null) {
          // Only if we previously applied something
          root.style.removeProperty(cssName);
          lastApplied.current = null;
        }
      }
      return;
    };

    const apply = (val) => {
      if (isContrastEnabled()) {
        applyContrast();
        return;
      }

      if (val == null || val === '') {
        applyDefault();
        return;
      }

      // Only write if changed and not already equal to the inline value
      if (
        lastApplied.current !== val &&
        root.style.getPropertyValue(cssName).trim() !== val
      ) {
        if (cookieName.includes('font'))
          root.style.setProperty(
            cssName,
            `${val}, Arial, Helvetica, sans-serif`
          );
        else if (cookieName.includes('color')) {
          const fixedColor = val.replace(/%23/g, '#');
          root.style.setProperty(cssName, fixedColor);
        } else root.style.setProperty(cssName, val);
        lastApplied.current = val;
      }
    };

    const applyContrast = (val) => {
      // Only write if changed and not already equal to the inline value
      if (
        lastApplied.current !== val &&
        root.style.getPropertyValue(cssName).trim() !== val
      ) {
        if (cookieName.includes('font'))
          root.style.setProperty(
            cssName,
            `${cookieDefVal}, Arial, Helvetica, sans-serif`
          );
        else root.style.setProperty(cssName, contrastVal);
        lastApplied.current = val;
      }
    };

    // Apply once right after hydration using the SSR-provided cookie value
    apply(cookieVal);

    // Watch for cookie changes after mount
    let cleanup = () => {};

    if ('cookieStore' in window && window.cookieStore?.get) {
      const onChange = async (e) => {
        const touchedContrast =
          e.changed?.some((c) => c.name === 'contrast_pref') ||
          e.deleted?.some((c) => c.name === 'contrast_pref');

        if (touchedContrast) {
          if (isContrastEnabled()) {
            applyContrast();
          } else {
            const c = await window.cookieStore.get(cookieName);
            apply(c?.value ?? null);
          }
          return;
        }

        if (
          !isContrastEnabled() &&
          (e.changed?.some((c) => c.name === cookieName) ||
            e.deleted?.some((c) => c.name === cookieName))
        ) {
          const c = await window.cookieStore.get(cookieName);
          apply(c?.value ?? null);
        }
      };

      window.cookieStore.addEventListener('change', onChange);
      cleanup = () =>
        window.cookieStore.removeEventListener('change', onChange);
    } else {
      let prevVal = cookieVal ?? null;
      let prevContrast = isContrastEnabled();

      const readBoth = () => {
        const m = document.cookie.match(
          new RegExp(
            '(?:^|; )' +
              cookieName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') +
              '=([^;]*)'
          )
        );
        const v = m ? decodeURIComponent(m[1]) : null;
        const contrast = isContrastEnabled();

        if (contrast !== prevContrast) {
          prevContrast = contrast;
          if (contrast) {
            applyContrast(); // ON -> override/revert
          } else {
            apply(v); // OFF -> resume normal
          }
        }

        if (!contrast && v !== prevVal) {
          prevVal = v;
          apply(v);
        }
      };

      const id = setInterval(readBoth, 2000);
      document.addEventListener('visibilitychange', readBoth);
      readBoth();
      cleanup = () => {
        clearInterval(id);
        document.removeEventListener('visibilitychange', readBoth);
      };
    }

    return cleanup;
  }, [cookieName, cookieVal, cookieDefVal, cssName, contrastVal]);
};

export default CookieWatcher;
