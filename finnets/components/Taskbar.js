import Link from 'next/link';
import style from './taskbar.module.css';
import SvgComponent from './SvgComponent';

const Taskbar = () => {
  const baseURL = process.env.NODE_ENV === 'production' ? '/finnets' : '';

  return (
    <>
      <div className={style.taskbar_container} />
      <div className={style.taskbar}>
        <Link href={`${baseURL}/`}>
          <SvgComponent src='/icons/home.svg' />
          <p>Home</p>
        </Link>
        <Link href={`${baseURL}/chat`}>
          <SvgComponent src='/icons/chat.svg' />
          <p>Chat</p>
        </Link>
        <Link href={`${baseURL}/settings`}>
          <SvgComponent src='/icons/settings.svg' />
          <p>Settings</p>
        </Link>
      </div>
    </>
  );
};

export default Taskbar;
