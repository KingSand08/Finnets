'use client';
import React from 'react';
import ImageContainer from '../ImageContainer';
import style from './chatbotButton.module.css';

const ChatBotButton = () => {
  return (
    <>
      <button className={style.chat_button}>
        <ImageContainer srcImg='/finnets.png' alt='FinNets Companion Tool' />
      </button>
    </>
  );
};

export default ChatBotButton;
