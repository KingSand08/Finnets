'use client';
import React from 'react';
import signin from '@/app/actions/signin';
import style from './login.module.css';
import { useState } from 'react';

const LoginPage = () => {
  const [isSending, setIsSending] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    const status = await signin(e);
    if (status) {
      setIsSending(false);
    } else {
      setIsError(true);
      setIsSending(false);
    }
  };

  return (
    <>
      <div className={style.page}>
        <h1>Login Page</h1>

        <form className={style.form} onSubmit={handleSubmit}>
          <label htmlFor='name'>Username</label>
          <input
            id='username'
            name='username'
            placeholder='Username...'
            disabled={isError}
          ></input>
          <label htmlFor='email'>Email</label>
          <input
            id='email'
            name='email'
            type='email'
            placeholder='example@domain.com'
            disabled={isError}
          ></input>
          <label htmlFor='password'>Password</label>
          <input
            id='password'
            name='password'
            type='password'
            placeholder='Password...'
            disabled={isError}
          ></input>
          <button type='submit'>Sign In</button>
        </form>
        {isSending && (
          <>
            <div className={style.loading_anim} />
          </>
        )}
        {isError && (
          <>
            <div className={style.error}>
              Sorry, there was an error handeling your information try again
              later please!
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default LoginPage;
