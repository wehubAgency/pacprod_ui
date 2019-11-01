import React from 'react';
import { Translate } from 'react-localize-redux';
import ARTargetManager from '../components/ARTarget/ARTargetManager';

const ARTargetPage = () => (
  <div>
    <h1>
      <Translate id="arTargetPage.h1" />
    </h1>
    <div className="instructions">
      <h4>
        <Translate id="instructions" />
      </h4>
      <Translate id="arTargetPage.instructions" />
    </div>
    <ARTargetManager />
  </div>
);

export { ARTargetPage };
