import Link from 'next/link';
import style from './taskbar.module.css';
import SvgComponent from './SvgComponent';

const Taskbar = () => {
  return (
    <>
      <div className={style.taskbar_container} />
      <div className={style.taskbar}>
        <a href="/finnets/">
          <SvgComponent src='/icons/home.svg' />
          <p>Home</p>
        </a>
        <Link href={'/finnets/chat'}>
          <SvgComponent src='/icons/chat.svg' />
          <p>Chat</p>
        </Link>
        <Link href={'/finnets/settings'}>
          <SvgComponent src='/icons/settings.svg' />
          <p>Settings</p>
        </Link>
      </div>
    </>
  );
};

export default Taskbar;
