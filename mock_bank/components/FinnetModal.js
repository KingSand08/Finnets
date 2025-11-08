'use client';
import { useEffect, useRef } from 'react';
import styles from './finnetmodal.module.css';

export default function FinnetsModal({
  srcFrame,
  open,
  onClose,
  title = 'Chatbot',
}) {
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
      <div className={styles.backdrop} onClick={onClose} />

      <aside
        className={`${styles.modal} ${open ? styles.modalActive : ''}`}
        role='dialog'
        aria-modal='true'
      >
        <div className='h-full flex flex-col'>
          {/* HEADER */}
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <button
                ref={closeRef}
                onClick={onClose}
                className={styles.closeButton}
                aria-label='Close'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5 text-gray-700'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M15 19l-7-7 7-7'
                  />
                </svg>
              </button>
            </div>
            <div className={styles.powered}>Powered by Finnets</div>
          </div>

          {/* IFRAME */}
          <iframe
            title='Finnets Chatbot'
            src={srcFrame}
            sandbox='allow-scripts allow-same-origin allow-forms allow-popups'
            className={styles.iframe}
          />
        </div>
      </aside>
    </>
  );
}
