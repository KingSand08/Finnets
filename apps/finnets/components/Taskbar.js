import Link from 'next/link';
import style from './taskbar.module.css';
import SvgComponent from './SvgComponent';

const Taskbar = () => {
  return (
    <>
      <div className={style.taskbar_container} />
      <div className={style.taskbar}>
        <Link href={'/'}>
          <SvgComponent src='/icons/home.svg' />
          <p>Home</p>
        </Link>
        <Link href={'/chat'}>
          <SvgComponent src='/icons/chat.svg' />
          <p>Chat</p>
        </Link>
        <Link href={'/settings'}>
          <SvgComponent src='/icons/settings.svg' />
          <p>Settings</p>
        </Link>
      </div>
    </>
  );
};

export default Taskbar;
