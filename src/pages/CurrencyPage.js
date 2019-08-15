import React from 'react';
import { Translate } from 'react-localize-redux';
import CurrencyManager from '../components/Coin/CurrencyManager';

const CurrencyPage = () => (
    <div>
      <h1>
        <Translate id="currencyPage.h1" />
      </h1>
      <div className="instructions">
        <h4>
          <Translate id="instructions" />
        </h4>
        <Translate id="currencyPage.instructions" />
      </div>
      <CurrencyManager />
    </div>
);

export { CurrencyPage };
