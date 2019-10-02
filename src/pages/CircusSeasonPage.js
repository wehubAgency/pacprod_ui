import React from 'react';
import { Translate } from 'react-localize-redux';
import CircusSeasonManager from '../components/CircusSeason/CircusSeasonManager';

const CircusSeasonPage = () => (
  <div>
    <h1>
      <Translate id="seasonPage.h1" />
    </h1>
    <div className="instructions">
      <h4>
        <Translate id="instructions" />
      </h4>
      <Translate id="seasonPage.intro" />
    </div>
    <CircusSeasonManager />
  </div>
);

export { CircusSeasonPage };
