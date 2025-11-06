import style from './settingcontrol.section.module.css';

const SettingControlSection = ({ children }) => {
  return <div className={style.section}> {children} </div>;
};

export default SettingControlSection;
