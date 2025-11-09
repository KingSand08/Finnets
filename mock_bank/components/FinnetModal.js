'use client';
import { useEffect, useRef } from 'react';
import style from './finnetmodal.module.css';
import IframeContainer from './IframeContainer';
import ImageContainer from './ImageContainer';

export default function FinnetsModal({ srcFrame, open, onClose, titleFrame }) {
  const closeRef = useRef(null);
  const openerRef = useRef(null);

  useEffect(() => {
    if (open) {
      openerRef.current = document.activeElement;
      document.body.style.overflow = 'hidden';
      setTimeout(() => closeRef.current?.focus?.(), 80);
    } else {
      document.body.style.overflow = '';
      openerRef.current?.focus?.();
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape' && open) onClose?.();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <div className={style.backdrop} onClick={onClose} />
      <aside
        className={`${style.modal} ${open ? style.modalActive : ''}`}
        role='dialog'
        aria-modal='true'
      >
        <div className={style.close_button_container}>
          <button
            ref={closeRef}
            className={style.close_button}
            onClick={onClose}
            aria-label='Close'
          >
            <ImageContainer srcImg='/icons/back.png' alt='back button' w='40' />
          </button>
        </div>
        <IframeContainer key={srcFrame} src={srcFrame} title={titleFrame} />
      </aside>
    </>
  );
}
