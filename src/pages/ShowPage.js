import React from 'react';
import { Translate } from 'react-localize-redux';
import { Link } from 'react-router-dom';
import ShowManager from '../components/Show/ShowManager';

const ShowPage = () => (
    <div>
      <h1>
        <Translate id="showPage.h1" />
      </h1>
      <div className="instructions">
        <h4>
          <Translate id="instructions" />
        </h4>
        <Translate id="showPage.intro" />
        <Link to="/artists" style={{ marginLeft: '15px' }}>
          <Translate id="createArtist" />
        </Link>
      </div>
      <ShowManager />
    </div>
);

export { ShowPage };
