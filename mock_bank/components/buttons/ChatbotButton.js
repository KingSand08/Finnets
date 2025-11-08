'use client';
import { useState } from 'react';
import ImageContainer from '../ImageContainer';
import style from './chatbotButton.module.css';
import FinnetsModal from '../FinnetModal';

const ChatBotButton = ({ src }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        className={style.chat_button}
        onClick={() => setOpen((prev) => !prev)}
      >
        <ImageContainer srcImg='/finnets.png' alt='FinNets Companion Tool' />
      </button>

      <FinnetsModal
        srcFrame={src}
        open={open}
        onClose={() => setOpen(false)}
        title='Finnets Chatbot'
      />
    </>
  );
};

export default ChatBotButton;
