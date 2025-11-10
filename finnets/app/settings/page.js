import {
  DeleteButtonSection,
  SettingColorControl,
  SettingSelectionControl,
  SettingSwitchControl,
} from '@/components/Settings/SettingControl';
import SettingControlSection from '@/components/Settings/SettingControlSection';
import fontList from '@/lib/fontSupport.json';
import style from './settingspage.module.css';
import { doNothingTemp } from '@/lib/doNothing';
import { getPrivacyPreference, setPrivacyPreference } from '@/lib/privacyPreference';

const SettingsPage = async () => {
  const fonts = Array.isArray(fontList)
    ? fontList.map((o) => (typeof o === 'string' ? o : o?.name)).filter(Boolean)
    : [];

  const allowDbAccess = await getPrivacyPreference();

  return (
    <div className={style.page}>
      <h1>Settings</h1>

      <div className={style.page_section}>
        <div className={style.section}>
          <h2>Finnet Privacy Control</h2>
          <SettingControlSection>
            <h3>AI Data Access</h3>
            <div className={style.selection_options}>
              <SettingSwitchControl
                title='Allow AI to access my bank data'
                func={setPrivacyPreference}
                prevStatus={allowDbAccess}
              />
            </div>
            <h3>User Data</h3>
            <div className={style.selection_options}>
              <SettingSwitchControl
                title='Use my data for personalized AI recommendations'
                func={doNothingTemp}
              />
              <SettingSwitchControl
                title='Track in-app activity to improve experience'
                func={doNothingTemp}
              />
              <SettingSelectionControl
                title='Auto-delete usage data after'
                func={doNothingTemp}
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
              <SettingSelectionControl
                list={fonts}
                title='Headings'
                func={doNothingTemp}
              />
              <SettingSelectionControl
                list={fonts}
                title='Body'
                func={doNothingTemp}
              />
            </div>
          </SettingControlSection>
          <SettingControlSection>
            <h3>Colors</h3>
            <div className={style.selection_options}>
              <SettingColorControl
                title='Background'
                func={doNothingTemp}
                baseColorCode='--background'
              />
              <SettingColorControl
                title='Foreground'
                func={doNothingTemp}
                baseColorCode='--foreground'
              />
              <SettingColorControl
                title='Heading'
                func={doNothingTemp}
                baseColorCode='#000000'
              />
              <SettingColorControl
                title='Body'
                func={doNothingTemp}
                baseColorCode='#000000'
              />
            </div>
          </SettingControlSection>
        </div>
        <div className={style.section}>
          <h2>Finnet Accessibility Control</h2>
          <SettingControlSection>
            <div className={style.selection_options}>
              <SettingSwitchControl
                title='Enable Language Switch Button'
                func={doNothingTemp}
              />
              <SettingSwitchControl
                title='Enable High Contrast Mode'
                func={doNothingTemp}
              />
              <SettingSwitchControl
                title='Enable Page Searching'
                func={doNothingTemp}
              />
            </div>
          </SettingControlSection>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
