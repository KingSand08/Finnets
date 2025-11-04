'use client';
import signIn from '@/lib/auth/signIn.js';
import style from './login.module.css';
import Form from 'next/form';
import { useActionState } from 'react';

const LoginPage = () => {
  const [error, action, isLoading] = useActionState(signIn, '');

  return (
    <>
      <div className={style.page}>
        <h1>Login Page</h1>

        <Form className={style.form} action={action}>
          <label htmlFor='name'>Your First Name</label>
          <input id='name' name='name' placeholder='name...' />

          <label htmlFor='email'>Email</label>
          <input
            id='email'
            name='email'
            type='email'
            placeholder='example@domain.com'
            disabled={error}
          />
          <label htmlFor='password'>Password</label>
          <input
            id='password'
            name='password'
            type='password'
            placeholder='Password...'
            disabled={error}
          />
          <button type='submit'>Sign In</button>
        </Form>
        {isLoading && (
          <>
            <div className={style.loading_anim} />
          </>
        )}
        {error && (
          <>
            <div className={style.error}>
              Sorry, there was an error handling your information, try again
              later please!
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default LoginPage;
