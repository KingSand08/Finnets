'use client';
import React, { useState, useEffect } from 'react';
import style from './settingcontrol.module.css';
import DeleteButton from './DeleteButton';

export const SettingSelectionControl = ({ title, list = [] }) => {
  return (
    <div className={style.selection_container}>
      <h4>{title}</h4>
      <form>
        <select className={style.button}>
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

export const SettingColorControl = ({ title, baseColorCode }) => {
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
      <form>
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

export const SettingSwitchControl = ({ title, defaultOn = true }) => {
  const [isOn, setIsOn] = useState(defaultOn);
  const handleToggle = () => setIsOn((prev) => !prev);

  return (
    <div className={style.selection_container}>
      <h4>{title}</h4>
      <form>
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
