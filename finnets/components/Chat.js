'use client';
import style from '@/components/chat.module.css';
import Image from 'next/image';
import { useState, useRef } from 'react';

export default function Chat({ initial_messages }) {
  const [messages, setMessages] = useState(initial_messages);
  const inputRef = useRef(null);

  const handleSend = () => {
    const text = inputRef.current?.value.trim();
    if (!text) return;
    setMessages((prev) => [...prev, [text, true]]);
    inputRef.current.value = '';
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={style.chat_page}>
      <div className={style.chat_header}>
        <h1>Chat Messages</h1>
      </div>
      <div>
        <div className={style.message_section}>
          {messages.map(([message, sent], idx) => (
            <div
              key={idx}
              className={`${style.message} ${
                sent ? style.sent : style.received
              }`}
            >
              {message}
            </div>
          ))}
        </div>
        <div className={style.input_section}>
          <input
            className={style.message_input}
            placeholder='Enter your question here.'
            onKeyDown={handleKeyDown}
            ref={inputRef}
          />
          <button onClick={handleSend} className={style.send_button}>
            <div
              style={{ position: 'relative', width: '2.5em', height: '2.5em' }}
            >
              <Image
                src='/icons/send-button.png'
                alt='send button'
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
