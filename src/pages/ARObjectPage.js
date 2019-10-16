import React from 'react';
import { Translate } from 'react-localize-redux';
import ARObjectManager from '../components/ARObject/ARObjectManager';

const ARObjectPage = () => (
  <div>
    <h1>
      <Translate id="arobjectPage.h1" />
    </h1>
    <div className="instructions">
      <h4>
        <Translate id="instructions" />
      </h4>
      <Translate id="arobjectPage.instructions" />
    </div>
    <ARObjectManager />
  </div>
);

export { ARObjectPage };
