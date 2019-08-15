import React from 'react';
import { Translate } from 'react-localize-redux';
import FiltersManager from '../components/Selfie/FiltersManager';

const SelfiePage = () => (
    <div>
      <h1>
        <Translate id="selfiePage.h1" />
      </h1>
      <div className="instructions">
        <h4>
          <Translate id="instructions" />
        </h4>
        <Translate id="selfiePage.instructions" />
      </div>
      <FiltersManager />
    </div>
);

export { SelfiePage };
