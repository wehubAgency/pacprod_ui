import React from 'react';
import { Translate } from 'react-localize-redux';
import PrizeInfosManager from '../components/PrizeInfos/PrizeInfosManager';

const PrizeInfosPage = () => (
    <div>
      <h1>
        <Translate id="prizePage.h1" />
      </h1>
      <div className="instructions">
        <h4>
          <Translate id="instructions" />
        </h4>
        <Translate id="prizePage.instructions" />
      </div>
      <PrizeInfosManager />
    </div>
);

export { PrizeInfosPage };
