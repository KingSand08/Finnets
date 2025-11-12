'use client';
import { useEffect, useRef } from 'react';

const CookieWatcher = ({ cookieName, cookieVal, cookieDefVal, cssName }) => {
  const lastApplied = useRef(null);

  useEffect(() => {
    const root = document.documentElement;

    const apply = (val) => {
      // If cookie missing or empty, consider default or remove override
      if (val == null || val === '') {
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
      }

      // Only write if changed and not already equal to the inline value
      if (
        lastApplied.current !== val &&
        root.style.getPropertyValue(cssName).trim() !== next
      ) {
        if (cookieName.includes('font'))
          root.style.setProperty(
            cssName,
            `${val}, Arial, Helvetica, sans-serif`
          );
        else root.style.setProperty(cssName, val);
        lastApplied.current = val;
      }
    };

    // Apply once right after hydration using the SSR-provided cookie value
    apply(cookieVal);

    // Watch for cookie changes after mount
    let cleanup = () => {};

    if ('cookieStore' in window && window.cookieStore?.get) {
      // If the Cookie Store API is available
      const onChange = (e) => {
        // Handler for cookie change events
        if (
          e.changed?.some((c) => c.name === cookieName) ||
          e.deleted?.some((c) => c.name === cookieName)
        ) {
          // If only changed or deleted then reapply with new value
          window.cookieStore
            .get(cookieName)
            .then((c) => apply(c?.value ?? null));
        }
      };
      window.cookieStore.addEventListener('change', onChange); // Subscribe to changes
      cleanup = () =>
        window.cookieStore.removeEventListener('change', onChange); // Unsubscribe on unmount
    } else {
      // Fallback when Cookie Store API isn't available

      // Track previous raw cookie value to detect changes
      let prev = null;
      const read = () => {
        // Polling reader for the cookie value
        const m = document.cookie.match(
          // Regex to extract the cookie value
          new RegExp(
            '(?:^|; )' +
              cookieName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') +
              '=([^;]*)'
          )
        );

        // Decode or null if missing
        const val = m ? decodeURIComponent(m[1]) : null;

        if (val !== prev) {
          // If changed since last read
          prev = val; // Update tracker
          apply(val); // Apply new value
        }
      };
      // Poll every 2 sec
      const id = setInterval(read, 2000);
      // Also re-check on tab focus
      document.addEventListener('visibilitychange', read);
      // Initial read immediately
      read();
      cleanup = () => {
        // Cleanup polling + event listener on unmount
        clearInterval(id);
        document.removeEventListener('visibilitychange', read);
      };
    }
    // Ensure we clean up listeners/intervals
    return cleanup;
  }, [cookieName, cookieVal, cookieDefVal, cssName]);
};

export default CookieWatcher;
