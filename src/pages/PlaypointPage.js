import React from 'react';
import { Translate } from 'react-localize-redux';
import PlaypointManager from '../components/Playpoint/PlaypointManager';

const PlaypointPage = () => (
    <div>
      <h1>
        <Translate id="playpointPage.h1" />
      </h1>
      <div className="instructions">
        <h4>
          <Translate id="instructions" />
        </h4>
        <Translate id="playpointPage.instructions" />
      </div>
      <PlaypointManager />
    </div>
);

export { PlaypointPage };
