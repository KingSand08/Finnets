'use client';
import { useState } from 'react';
import ImageContainer from '../ImageContainer';
import style from './chatbotButton.module.css';
import FinnetsModal from '../FinnetModal';

const ChatBotButton = ({ btnSrcImg, src, title }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        className={style.chat_button}
        onClick={() => setOpen((prev) => !prev)}
      >
        <ImageContainer srcImg={btnSrcImg} alt='FinNets Companion Tool' />
      </button>

      <FinnetsModal
        srcFrame={src}
        open={open}
        onClose={() => setOpen(false)}
        title={title}
      />
    </>
  );
};

export default ChatBotButton;
