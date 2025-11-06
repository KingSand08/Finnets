import {
  DeleteButtonSection,
  SettingColorControl,
  SettingSelectionControl,
  SettingSwitchControl,
} from '@/components/Settings/SettingControl';
import SettingControlSection from '@/components/Settings/SettingControlSection';
import fontList from '@/db/static/fontSupport.json';
import style from './settingspage.module.css';

const SettingsPage = () => {
  const fonts = Array.isArray(fontList)
    ? fontList.map((o) => (typeof o === 'string' ? o : o?.name)).filter(Boolean)
    : [];

  return (
    <div className={style.page}>
      <h1>Settings</h1>

      <div className={style.page_section}>
        <div className={style.section}>
          <h2>Finnet Privacy Control</h2>
          <SettingControlSection>
            <h3>User Data</h3>
            <div className={style.selection_options}>
              <SettingSwitchControl title='Use my data for personalized AI recommendations' />
              <SettingSwitchControl title='Track in-app activity to improve experience' />
              <SettingSelectionControl
                title='Auto-delete usage data after'
                list={['Never', 'Yes']}
              />
              <DeleteButtonSection />
            </div>
          </SettingControlSection>
        </div>

        <div className={style.section}>
          <h2>Finnet UI Control</h2>
          <SettingControlSection>
            <h3>Fonts</h3>
            <div className={style.selection_options}>
              <SettingSelectionControl list={fonts} title='Headings' />
              <SettingSelectionControl list={fonts} title='Body' />
            </div>
          </SettingControlSection>
          <SettingControlSection>
            <h3>Colors</h3>
            <div className={style.selection_options}>
              <SettingColorControl
                baseColorCode='--background'
                title='Background'
              />
              <SettingColorControl
                baseColorCode='--foreground'
                title='Foreground'
              />
              <SettingColorControl baseColorCode='#000000' title='Heading' />
              <SettingColorControl baseColorCode='#000000' title='Body' />
            </div>
          </SettingControlSection>
        </div>
        <div className={style.section}>
          <h2>Finnet Accessibility Control</h2>
          <SettingControlSection>
            <div className={style.selection_options}>
              <SettingSwitchControl title='Enable Language Switch Button' />
              <SettingSwitchControl title='Enable High Contrast Mode' />
              <SettingSwitchControl title='Enable Page Searching' />
            </div>
          </SettingControlSection>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
