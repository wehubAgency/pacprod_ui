import React from 'react';
import { Translate } from 'react-localize-redux';
import ProgramManager from '../components/Program/ProgramManager';

const ProgramPage = () => (
    <div>
      <h1>
        <Translate id="programPage.h1" />
      </h1>
      <div className="instructions">
        <h4>
          <Translate id="instructions" />
        </h4>
        <Translate id="programPage.intro" />
      </div>
      <ProgramManager />
    </div>
);

export { ProgramPage };
