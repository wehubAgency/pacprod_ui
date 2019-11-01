import React from 'react';
import { Translate } from 'react-localize-redux';
import ARExpoLinkManager from '../components/ARExpoLink/ARExpoLinkManager';

const ARExpoPage = () => (
  <div>
    <h1>
      <Translate id="arexpoPage.h1" />
    </h1>
    <div className="instructions">
      <h4>
        <Translate id="instructions" />
      </h4>
      <Translate id="arexpoPage.instructions" />
    </div>
    <ARExpoLinkManager />
  </div>
);

export { ARExpoPage };
