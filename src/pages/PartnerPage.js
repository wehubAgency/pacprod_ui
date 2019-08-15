import React from 'react';
import { Translate } from 'react-localize-redux';
import PartnerManager from '../components/Partner/PartnerManager';

const PartnerPage = () => (
    <div>
      <h1>
        <Translate id="partnerPage.h1" />
      </h1>
      <div className="instructions">
        <h4>
          <Translate id="instructions" />
        </h4>
        <Translate id="partnerPage.instructions" />
      </div>
      <PartnerManager />
    </div>
);

export { PartnerPage };
