import {
  // DeleteButtonSection,
  SettingColorControl,
  SettingSelectionControl,
  SettingSwitchControl,
} from '@/components/Settings/SettingControl';
import SettingControlSection from '@/components/Settings/SettingControlSection';
import fontList from '@/data/fontSupport.json';
import style from './settingspage.module.css';
import {
  getPrivacyPreference,
  setPrivacyPreference,
  getFontHeadings,
  setFontHeadings,
  getFontBody,
  setFontBody,
  getBodyColor,
  setBodyColor,
  getHeadingColor,
  setHeadingColor,
  getBackgroundColor,
  setBackgroundColor,
  getForegroundColor,
  setForegroundColor,
  getLanguagePreference,
  setLanguagePreference,
  getContrastPreference,
  setContrastPreference,
  setSearchPreference,
  getSearchPreference,
  getReceivedColor,
  setReceivedColor,
  resetBackgroundColor,
  resetForegroundColor,
  resetReceivedColor,
  resetHeadingColor,
  resetBodyColor,
  setFont,
} from '@/lib/settings/settingControls';

const SettingsPage = async () => {
  const fonts = Array.isArray(fontList)
    ? fontList.map((o) => (typeof o === 'string' ? o : o?.name)).filter(Boolean)
    : [];

  const allowDbAccess = await getPrivacyPreference();
  const fontHeadings = await getFontHeadings();
  const fontBody = await getFontBody();
  const colorHeadings = await getHeadingColor();
  const colorBody = await getBodyColor();
  const colorBackground = await getBackgroundColor();
  const colorForeground = await getForegroundColor();
  const langPref = await getLanguagePreference();
  const constrastPref = await getContrastPreference();
  const searchPref = await getSearchPreference();
  const colorReceived = await getReceivedColor();

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
            {/* <h3>User Data</h3>
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
            </div> */}
          </SettingControlSection>
        </div>

        <div className={style.section}>
          <h2>Finnet UI Control</h2>
          <SettingControlSection>
            <h3>Fonts</h3>
            <div className={style.selection_options}>
              {/* <SettingSelectionControl
                list={fonts}
                title='Headings'
                func={setFontHeadings}
                prevStatus={fontHeadings}
              />
              <SettingSelectionControl
                list={fonts}
                title='Body'
                func={setFontBody}
                prevStatus={fontBody}
              /> */}
              <SettingSelectionControl
                list={fonts}
                title='Text'
                func={setFont}
                prevStatus={fontBody}
              />
            </div>
          </SettingControlSection>
          <SettingControlSection>
            <h3>Colors</h3>
            <div className={style.selection_options}>
              {/* <SettingColorControl
                title='Background'
                func={setBackgroundColor}
                resetFunc={resetBackgroundColor}
                baseColorCode='--background'
                prevStatus={colorBackground}
              /> */}
              <SettingColorControl
                title='Foreground'
                func={setForegroundColor}
                resetFunc={resetForegroundColor}
                baseColorCode='--foreground'
                prevStatus={colorForeground}
              />
              {/* <SettingColorControl
                title='Received Messages'
                func={setReceivedColor}
                resetFunc={resetReceivedColor}
                baseColorCode='--received-color'
                prevStatus={colorReceived}
              />
              <SettingColorControl
                title='Heading'
                func={setHeadingColor}
                resetFunc={resetHeadingColor}
                baseColorCode='--heading-text-color'
                prevStatus={colorHeadings}
              />
              <SettingColorControl
                title='Body'
                func={setBodyColor}
                resetFunc={resetBodyColor}
                baseColorCode='--body-text-color'
                prevStatus={colorBody}
              /> */}
            </div>
          </SettingControlSection>
        </div>
        <div className={style.section}>
          <h2>Finnet Accessibility Control</h2>
          <SettingControlSection>
            <div className={style.selection_options}>
              <SettingSwitchControl
                title='Enable Language Switch Button'
                func={setLanguagePreference}
                prevStatus={langPref}
              />
              <SettingSwitchControl
                title='Enable High Contrast Mode'
                func={setContrastPreference}
                prevStatus={constrastPref}
              />
              <SettingSwitchControl
                title='Enable Page Searching'
                func={setSearchPreference}
                prevStatus={searchPref}
              />
            </div>
          </SettingControlSection>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
