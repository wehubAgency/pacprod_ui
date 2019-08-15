import React from 'react';
import { Translate } from 'react-localize-redux';
import LocationManager from '../components/Location/LocationManager';

const LocationPage = () => (
    <div>
      <h1>
        <Translate id="locationPage.h1" />
      </h1>
      <div className="instructions">
        <h4>
          <Translate id="instructions" />
        </h4>
        <Translate id="locationPage.intro" />
      </div>
      <LocationManager />
    </div>
);

export { LocationPage };
