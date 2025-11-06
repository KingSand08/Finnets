import Link from 'next/link';
import SvgComponent from './SvgComponent';
import style from './taskbar.module.css';

const Taskbar = () => {
  return (
    <>
      <div className={style.taskbar_container} />
      <div className={style.taskbar}>
        <Link href={'/'}>
          <SvgComponent
            src='/icons/home.svg'
            title='home'
            fill='#FFFFFF'
            width={50}
            height={50}
          />
          <p>Home</p>
        </Link>
        <Link href={'/chat'}>
          <SvgComponent
            src='/icons/chat.svg'
            title='Finnets chat'
            fill='#FFFFFF'
            width={50}
            height={50}
          />
          <p>Chat</p>
        </Link>
        {/*//! ADD SETTINGS LATER */}
        <Link href={'/settings'}>
          <SvgComponent
            src='/icons/settings.svg'
            title='settings'
            fill='#FFFFFF'
            width={50}
            height={50}
          />
          <p>Settings</p>
        </Link>
      </div>
    </>
  );
};

export default Taskbar;
