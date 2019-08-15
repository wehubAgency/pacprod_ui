import React from 'react';
import { Translate } from 'react-localize-redux';
import GameConditionManager from '../components/GameCondition/GameConditionManager';

const GameConditionsPage = () => (
    <div>
      <h1>
        <Translate id="gameConditionsPage.h1" />
      </h1>
      <div className="instructions">
        <h4>
          <Translate id="instructions" />
        </h4>
        <Translate id="gameConditionsPage.instructions" />
      </div>
      <GameConditionManager />
    </div>
);

export { GameConditionsPage };
