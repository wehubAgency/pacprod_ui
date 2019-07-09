import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Translate } from 'react-localize-redux';
import { Card } from 'antd';
import QuizSettingsForm from '../components/QuizSettings/QuizSettingsForm';
import QuizSessionsForm from '../components/QuizSettings/QuizSessionsForm';
import iaxios from '../axios';

const _QuizSettingsPage = ({
  general: { currentApp, currentEntity, currentSeason },
}) => {
  const [quiz, setQuiz] = useState(null);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const sessionsReq = iaxios().get('/session');
    const quizReq = iaxios().get('/quiz');
    Promise.all([sessionsReq, quizReq]).then(([sessionsRes, quizRes]) => {
      if (sessionsRes !== 'error' && quizRes !== 'error') {
        setSessions(sessionsRes.data);
        setQuiz(quizRes.data);
      }
    });
  }, [currentApp, currentEntity, currentSeason]);

  const settingsFormProps = {
    formMode: 'edit',
    quiz,
    setQuiz,
  };

  const sessionFormProps = {
    quiz,
    setQuiz,
    sessions,
  };

  return (
    <div>
      <h1>
        <Translate id="quizSettingsPage.h1" />
      </h1>
      <div>
        <Translate id="quizSettingsPage.intro" />
      </div>
      {quiz && (
        <div>
          <Card
            title={<Translate id="quizSettingsPage.sessionsTitle" />}
            bordered={false}
          >
            <Translate id="quizSettingsPage.sessionsInfos" />
            <QuizSessionsForm {...sessionFormProps} />
          </Card>
          <Card
            title={<Translate id="quizSettingsPage.gameMode" />}
            bordered={false}
          >
            <QuizSettingsForm {...settingsFormProps} />
          </Card>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = ({ general }) => ({ general });

export const QuizSettingsPage = connect(
  mapStateToProps,
  {},
)(_QuizSettingsPage);
