import React from 'react';
import { Translate } from 'react-localize-redux';
import CircusVoteManager from '../components/CircusVote/CircusVoteManager';

const CircusVotePage = () => (
  <div>
    <h1>
      <Translate id="circusVotePage.h1" />
    </h1>
    <div className="instructions">
      <h4>
        <Translate id="instructions" />
      </h4>
      <Translate id="circusVotePage.instructions" />
    </div>
    <CircusVoteManager />
  </div>
);

export { CircusVotePage };
