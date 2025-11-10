'use client';
import React, { useState, useEffect, useActionState } from 'react';
import style from './settingcontrol.module.css';
import DeleteButton from './DeleteButton';

export const SettingSelectionControl = ({
  title,
  func,
  list = [],
  prevStatus = 'Font 1',
}) => {
  const [status, action, isPending] = useActionState(func, prevStatus);

  return (
    <div className={style.selection_container}>
      <h4>{title}</h4>
      <form action={action} key={status}>
        <select
          name='value'
          defaultValue={status}
          onChange={(e) => e.currentTarget.form?.requestSubmit()}
          disabled={isPending}
        >
          {list.map((val) => (
            <option key={val} value={val}>
              {val}
            </option>
          ))}
        </select>
      </form>
    </div>
  );
};

export const SettingColorControl = ({
  title,
  func, // server action that reads "userColor"
  baseColorCode, // e.g. "#112233" or "--heading-color"
  prevStatus = null, // saved hex like "#112233" (or null)
}) => {
  const [state, action, isPending] = useActionState(func, '');

  const [color, setColor] = useState(() => (isHex ? baseColorCode : ''));

  useEffect(() => {
    const codeUsed = prevStatus ? prevStatus : baseColorCode;
    const isHex = typeof codeUsed === 'string' && codeUsed.startsWith('#');

    if (!codeUsed || isHex) return;

    const id = setTimeout(() => {
      const next =
        getComputedStyle(document.documentElement)
          .getPropertyValue(codeUsed)
          .trim() || '';

      // Guard to avoid unnecessary renders
      setColor((prev) => (prev === next ? prev : next));
    }, 0);

    return () => clearTimeout(id);
  }, [prevStatus, baseColorCode]);

  return (
    // Remount when the authoritative value changes so initial state recomputes
    <div
      className={style.selection_container}
      key={prevIsHex ? prevStatus : baseColorCode}
    >
      <h4>{title}</h4>
      <form action={action} className={style.color_control}>
        <label>
          <span suppressHydrationWarning>{color}</span>
        </label>
        <input
          type='color'
          name='userColor'
          value={isHex6(color) ? color : '#000000'} // safe fallback
          onChange={(e) => {
            const next = e.target.value; // "#aabbcc"
            setColor(next); // optimistic UI
            e.currentTarget.form?.requestSubmit(); // fire server action
          }}
          disabled={isPending}
        />
      </form>
    </div>
  );
};

const isHex6 = (s) => typeof s === 'string' && /^#[0-9A-Fa-f]{6}$/.test(s);
export const SettingSwitchControl = ({
  title,
  func = {},
  prevStatus = false,
}) => {
  const [status, action, isPending] = useActionState(func, '');

  const [isOn, setIsOn] = useState(prevStatus);

  // Sync local state with server state when prevStatus changes
  useEffect(() => {
    setIsOn(prevStatus);
  }, [prevStatus]);

  const handleToggle = (e) => {
    setIsOn((prev) => !prev);
    const form = e.currentTarget?.form;
    form.requestSubmit();
    setIsOn(status);
  };

  return (
    <div className={style.selection_container}>
      <h4>{title}</h4>
      <form action={action}>
        <label className={style.switch}>
          <input
            name='value'
            type='checkbox'
            checked={isOn}
            disabled={isPending}
            onChange={handleToggle}
          />
          <span className={style.slider}></span>
        </label>
      </form>
    </div>
  );
};

export const DeleteButtonSection = () => {
  return (
    <div className={style.selection_container}>
      <h4>Delete all user data stored on Finnet</h4>
      <DeleteButton />
    </div>
  );
};
