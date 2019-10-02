import React from 'react';
import { Translate } from 'react-localize-redux';
import UserManager from '../components/User/UserManager';

const UserPage = () => (
  <div>
    <h1>
      <Translate id="userPage.h1" />
    </h1>
    <div className="instructions">
      <h4>
        <Translate id="instructions" />
      </h4>
      <Translate id="userPage.instructions" />
    </div>
    <UserManager />
  </div>
);

export { UserPage };
