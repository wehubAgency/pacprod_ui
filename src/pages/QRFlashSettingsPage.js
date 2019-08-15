import React from 'react';
import { Translate } from 'react-localize-redux';
import QRFlashSettingsManager from '../components/QRFlash/QRFlashSettingManager';

const QRFlashSettingsPage = () => (
  <div>
    <h1>
      <Translate id="qrflashSettingsPage.h1" />
    </h1>
    <div className="instructions">
      <h4>
        <Translate id="instructions" />
      </h4>
      <Translate id="qrflashSettingsPage.instructions" />
    </div>
    <QRFlashSettingsManager />
  </div>
);

export { QRFlashSettingsPage };
