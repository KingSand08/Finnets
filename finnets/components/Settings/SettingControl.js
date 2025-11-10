'use client';
import React, { useState, useEffect, useActionState } from 'react';
import style from './settingcontrol.module.css';
import DeleteButton from './DeleteButton';

export const SettingSelectionControl = ({ title, func, list = [] }) => {
  const [error, action, isLoading] = useActionState(func, '');

  return (
    <div className={style.selection_container}>
      <h4>{title}</h4>
      <form action={action}>
        <select>
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

export const SettingColorControl = ({ title, func, baseColorCode }) => {
  const [error, action, isLoading] = useActionState(func, '');

  const isHex =
    typeof baseColorCode === 'string' && baseColorCode.startsWith('#');

  const [color, setColor] = useState(() => (isHex ? baseColorCode : ''));

  useEffect(() => {
    if (!baseColorCode || isHex) return;

    const id = setTimeout(() => {
      const next =
        getComputedStyle(document.documentElement)
          .getPropertyValue(baseColorCode)
          .trim() || '';

      // Guard to avoid unnecessary renders
      setColor((prev) => (prev === next ? prev : next));
    }, 0);

    return () => clearTimeout(id);
  }, [baseColorCode, isHex]);

  return (
    <div className={style.selection_container}>
      <h4>{title}</h4>
      <form action={action} className={style.color_control}>
        <label>
          <span suppressHydrationWarning>{color}</span>
        </label>
        <input
          type='color'
          id='myColorPicker'
          name='userColor'
          value={color || '#000000'}
          onChange={(e) => setColor(e.target.value)}
        />
      </form>
    </div>
  );
};

export const SettingSwitchControl = ({
  title,
  func = {},
  prevStatus = false,
}) => {
  const [error, action, isLoading] = useActionState(func, '');

  const [isOn, setIsOn] = useState(prevStatus);

  // Sync local state with server state when prevStatus changes
  useEffect(() => {
    setIsOn(prevStatus);
  }, [prevStatus]);

  const handleToggle = (e) => {
    const next = !isOn;
    setIsOn(next);
    // submit form with new value
    const form = e.currentTarget?.form;
    if (form) {
      const input = form.querySelector('input[name="value"]');
      if (input) input.value = next ? 'on' : 'off';
      form.requestSubmit();
    }
  };

  return (
    <div className={style.selection_container}>
      <h4>{title}</h4>
      <form action={action}>
        <input type='hidden' name='value' value={isOn ? 'on' : 'off'} />
        <label className={style.switch}>
          <input type='checkbox' checked={isOn} onChange={handleToggle} />
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
