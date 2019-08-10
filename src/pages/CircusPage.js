import React from 'react';
import { Translate } from 'react-localize-redux';
import CircusManager from '../components/Circus/CircusManager';

const CircusPage = () => (
    <div>
      <h1>
        <Translate id="circusPage.h1" />
      </h1>
      <div className="instructions">
        <h4>
          <Translate id="instructions" />
        </h4>
        <Translate id="circusPage.intro" />
      </div>
      <CircusManager />
    </div>
);

export { CircusPage };
