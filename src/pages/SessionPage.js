import React from 'react';
import { Translate } from 'react-localize-redux';
import SessionManager from '../components/Session/SessionManager';

const SessionPage = () => (
    <div>
      <h1>
        <Translate id="sessionPage.h1" />
      </h1>
      <div className="instructions">
        <h4>
          <Translate id="instructions" />
        </h4>
        <Translate id="sessionPage.intro" />
      </div>
      <SessionManager />
    </div>
);

export { SessionPage };
