import React from 'react';
import { Translate } from 'react-localize-redux';
import FlashAppManager from '../components/FlashApp/FlashAppManager';

const FlashAppPage = () => (
    <div>
      <h1>
        <Translate id="flashAppPage.h1" />
      </h1>
      <div className="instructions">
        <h4>
          <Translate id="instructions" />
        </h4>
        <Translate id="flashAppPage.instructions" />
      </div>
      <FlashAppManager />
    </div>
);

export { FlashAppPage };
