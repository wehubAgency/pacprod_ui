import React from 'react';
import { Translate } from 'react-localize-redux';
import QrcodeManager from '../components/QRCode/QrcodeManager';

const QrcodePage = () => (
    <div>
      <h1>
        <Translate id="qrcodePage.h1" />
      </h1>
      <div className="instructions">
        <h4>
          <Translate id="instructions" />
        </h4>
        <Translate id="qrcodePage.instructions" />
      </div>
      <QrcodeManager />
    </div>
);

export { QrcodePage };
