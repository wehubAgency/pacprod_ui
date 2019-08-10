import React from 'react';
import { Translate } from 'react-localize-redux';
import ArtistManager from '../components/Artist/ArtistManager';

const ArtistPage = () => (
    <div>
      <h1>
        <Translate id="artistPage.h1" />
      </h1>
      <div className="instructions">
        <h4>
          <Translate id="instructions" />
        </h4>
        <Translate id="artistPage.intro" />
      </div>
      <ArtistManager />
    </div>
);

export { ArtistPage };
