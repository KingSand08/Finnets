'use client';
import { deleteUserData } from '@/lib/settings/deleteUserData';
import style from './deletebutton.module.css';

const DeleteButton = () => {
  return (
    <form action={deleteUserData}>
      <button className={style.button} type='submit'>
        Delete Data
      </button>
    </form>
  );
};

export default DeleteButton;
