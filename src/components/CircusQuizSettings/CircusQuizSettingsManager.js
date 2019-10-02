import React from 'react';
import { Translate } from 'react-localize-redux';
import { Card } from 'antd';
import CircusQuizSettingsForm from './CircusQuizSettingsForm';

const CircusQuizSettingsManager = ({ quiz, allQuiz, setAllQuiz }) => {
  const settingsFormProps = {
    formMode: 'edit',
    quiz,
    allQuiz,
    setAllQuiz,
  };

  return (
    <div>
      <Card title={<Translate id="quizSettings.gameMode" />} bordered={false}>
        <CircusQuizSettingsForm {...settingsFormProps} />
      </Card>
    </div>
  );
};

export default CircusQuizSettingsManager;
