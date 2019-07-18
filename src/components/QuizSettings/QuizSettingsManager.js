import React from 'react';
import { Translate } from 'react-localize-redux';
import { Card } from 'antd';
import QuizSettingsForm from './QuizSettingsForm';

const QuizSettingsManager = ({ quiz, allQuiz, setAllQuiz }) => {
  const settingsFormProps = {
    formMode: 'edit',
    quiz,
    allQuiz,
    setAllQuiz,
  };

  return (
    <div>
      <Card title={<Translate id="quizSettings.gameMode" />} bordered={false}>
        <QuizSettingsForm {...settingsFormProps} />
      </Card>
    </div>
  );
};

export default QuizSettingsManager;
