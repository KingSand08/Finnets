import DeleteButton from '@/components/DeleteButton';
import SettingControl, {
  SettingColorControl,
  SettingSelectionControl,
  SettingSwitchControl,
} from '@/components/SettingControl';
import SettingControlSection from '@/components/SettingControlSection';
import React from 'react';

const SettingsPage = () => {
  return (
    <>
      <h1>Settings</h1>
      <h2>Finnet Privacy Control</h2>
      <SettingControlSection>
        <h3>User Data</h3>
        <SettingSwitchControl />
        <SettingSwitchControl />
        <SettingSelectionControl />
        <DeleteButton />
      </SettingControlSection>
      <h2>Finnet UI Control</h2>
      <SettingControlSection>
        <h3>Fonts</h3>
        <SettingSelectionControl />
        <SettingSelectionControl />
      </SettingControlSection>
      <SettingControlSection>
        <h3>Colors</h3>
        <SettingColorControl />
        <SettingColorControl />
        <SettingColorControl />
        <SettingColorControl />
      </SettingControlSection>
      <h2>Finnet Accessibility Control</h2>
      <SettingControlSection>
        <SettingSwitchControl />
        <SettingSwitchControl />
        <SettingSwitchControl />
      </SettingControlSection>
    </>
  );
};

export default SettingsPage;
