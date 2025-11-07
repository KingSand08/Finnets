'use client';
import style from '@/components/chat.module.css';
import Image from 'next/image';
import { useState, useRef } from 'react';

export default function Chat({ initial_messages, cust_context }) {
  const [messages, setMessages] = useState(initial_messages);
  const inputRef = useRef(null);
  const [context, setContext] = useState(cust_context);

  const [sendStatus, setSendStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const addNewMessage = (text, isRecieve) => {
    setMessages((prev) => [...prev, [text, isRecieve]]);
  };

  const SendChatPrompt = async (userText, context) => {
    var data = await fetch('/api/watsonx', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: userText, 
        context,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          addNewMessage(data.message, false);
          setSendStatus(false);
          setIsLoading(false);
        } else {
          setIsLoading(false);
          setIsError(true);
        }
      });
  };

  const handleSend = async () => {
    const text = inputRef.current?.value.trim();
    if (!text) return;

    setSendStatus(true);
    setIsLoading(true);
    addNewMessage(text, true);
    inputRef.current.value = '';
    await SendChatPrompt(text, context);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !sendStatus) {
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
          {isLoading && (
            <div className={`${style.message} ${style.received}`}>
              <div className={style.message_loading} />
            </div>
          )}
          {isError && (
            <div
              className={`${style.message} ${style.received} ${style.message_error}`}
            >
              Finnet AI is having trouble and cannot respond at this time.
              Sorry, try again later, goodbye! 👋
            </div>
          )}
        </div>
        <div className={style.input_section}>
          <input
            className={style.message_input}
            placeholder='Enter your question here.'
            onKeyDown={handleKeyDown}
            ref={inputRef}
            disabled={sendStatus}
          />
          <button
            onClick={handleSend}
            className={style.send_button}
            disabled={sendStatus}
          >
            <div>
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
