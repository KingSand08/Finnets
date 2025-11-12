'use client';
import React, { useState } from 'react';
import SvgComponent from './SvgComponent';
import style from './laguagebutton.module.css';
import { setLanguagePref } from '@/lib/chat/setLanguagePref';

const LanguageButton = ({ supportedLangs = [{ language: 'English' }] }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        className={style.lang_button}
        onClick={() => setOpen((prev) => !prev)}
      >
        <SvgComponent src='icons/translate.svg' noColor={true} size='3em' />
      </button>
      {open && (
        <aside className={style.modal_page}>
          <div
            className={`${style.modal} ${open ? style.modalActive : ''}`}
            role='dialog'
            aria-modal='true'
          >
            {supportedLangs.map((lang) => {
              return (
                <form
                  key={lang.language}
                  action={async (formData) => {
                    const status = await setLanguagePref('', formData);
                    console.log(status);
                    setOpen(false);
                  }}
                  className={style.form}
                >
                  <input type='hidden' name='lang' value={lang.language} />
                  <button className={style.button} type='submit'>
                    <p>{lang.language}</p>
                  </button>
                </form>
              );
            })}
          </div>
        </aside>
      )}
    </>
  );
};

export default LanguageButton;
