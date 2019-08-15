import React from 'react';
import { Translate } from 'react-localize-redux';
import FlashAppSeasonManager from '../components/FlashAppSeason/FlashAppSeasonManager';

const FlashAppSeasonPage = () => (
    <div>
      <h1>
        <Translate id="flashAppSeasonPage.h1" />
      </h1>
      <div className="instructions">
        <h4>
          <Translate id="instructions" />
        </h4>
        <Translate id="flashAppSeasonPage.intro" />
      </div>
      <FlashAppSeasonManager />
    </div>
);

export { FlashAppSeasonPage };
