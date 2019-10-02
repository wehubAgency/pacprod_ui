import React from 'react';
import { Translate } from 'react-localize-redux';
import CircusQuizManager from '../components/CircusQuiz/CircusQuizManager';

const CircusQuizPage = () => (
  <div>
    <h1>
      <Translate id="circusQuizPage.h1" />
    </h1>
    <div className="instructions">
      <h4>
        <Translate id="instructions" />
      </h4>
      <Translate id="circusQuizPage.instructions" />
    </div>
    <CircusQuizManager />
  </div>
);

export { CircusQuizPage };
