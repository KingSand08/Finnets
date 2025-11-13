'use client';
import React, { useState, useEffect, useActionState } from 'react';
import style from './settingcontrol.module.css';
import DeleteButton from './DeleteButton';
import SvgComponent from '../SvgComponent';

export const SettingSelectionControl = ({
  title,
  func,
  list = [],
  prevStatus = 'Ubuntu',
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
  func,
  resetFunc,
  baseColorCode,
  prevStatus,
}) => {
  const [state, action, isPending] = useActionState(func, '');

  const isBaseHex =
    typeof baseColorCode === 'string' && baseColorCode.startsWith('#');

  const [color, setColor] = useState(() => (isBaseHex ? baseColorCode : ''));

  useEffect(() => {
    // If cookie exists use that color
    if (typeof prevStatus === 'string' && prevStatus.startsWith('#')) {
      const id = setTimeout(() => {
        const next = prevStatus;

        // Guard to avoid unnecessary renders
        setColor((prev) => (prev === next ? prev : next));
      }, 0);
      return () => clearTimeout(id);
    }
    // If default color from css isnt found then leave
    if (!baseColorCode || isBaseHex) return;

    // Retrieve color from vss and apply it
    const id = setTimeout(() => {
      const next =
        getComputedStyle(document.documentElement)
          .getPropertyValue(baseColorCode)
          .trim() || '';

      // Guard to avoid unnecessary renders
      setColor((prev) => (prev === next ? prev : next));
    }, 0);
    return () => clearTimeout(id);
  }, [title, prevStatus, baseColorCode, isBaseHex]);

  return (
    <div className={style.selection_container}>
      <h4>{title}</h4>
      <div className={style.selection_area}>
        <ResetColorButton
          resetAction={resetFunc}
          defaultValue={baseColorCode}
          onResetClient={setColor}
        />
        <form action={action} className={style.color_control}>
          <label>
            <span suppressHydrationWarning>{color}</span>
          </label>
          <input
            type='color'
            id='myColorPicker'
            name='userColor'
            value={color || '#000000'}
            onChange={(e) => {
              const next = e.target.value;
              setColor(next);
              e.currentTarget.form?.requestSubmit();
            }}
            disabled={isPending}
          />
        </form>
      </div>
    </div>
  );
};

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

export default function ResetColorButton({
  resetAction,
  defaultValue,
  onResetClient,
}) {
  const [submitting, setSubmitting] = useState(false);

  const computeDefaultHex = () => {
    if (typeof defaultValue === 'string' && defaultValue.startsWith('#'))
      return defaultValue;
    if (typeof defaultValue === 'string' && defaultValue) {
      const root = document.documentElement;
      const v = getComputedStyle(root).getPropertyValue(defaultValue).trim();
      return v || '#000000';
    }
    return '#000000';
  };

  return (
    <form
      action={async (formData) => {
        setSubmitting(true);
        const next = computeDefaultHex();
        onResetClient?.(next);
        await resetAction('', formData);
        setSubmitting(false);
      }}
    >
      <input type='hidden' name='intent' value='reset' />
      <button
        type='submit'
        disabled={submitting}
        className={style.reset_button}
      >
        <SvgComponent src='/icons/reset.svg' color='--foreground' />
      </button>
    </form>
  );
}
