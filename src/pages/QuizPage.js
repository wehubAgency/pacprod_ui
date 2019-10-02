import React from 'react';
import { Translate } from 'react-localize-redux';
import QuizManager from '../components/Quiz/QuizManager';

const QuizPage = () => (
    <div>
      <h1>
        <Translate id="quizPage.h1" />
      </h1>
      <div className="instructions">
        <h4>
          <Translate id="instructions" />
        </h4>
        <Translate id="quizPage.instructions" />
      </div>
      <QuizManager />
    </div>
);

export { QuizPage };
