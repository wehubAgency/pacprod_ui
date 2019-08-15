import React from 'react';
import { Translate } from 'react-localize-redux';
import PaidprizeManager from '../components/Paidprize/PaidprizeManager';

const PaidprizePage = () => (
  <div>
    <h1>
      <Translate id="paidprizePage.h1" />
    </h1>
    <div className="instructions">
      <h4>
        <Translate id="instructions" />
      </h4>
      <Translate id="paidprizePage.instructions" />
    </div>
    <PaidprizeManager />
  </div>
);

export { PaidprizePage };
