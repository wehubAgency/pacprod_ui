import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Transfer, Button } from 'antd';
import { withLocalize, Translate } from 'react-localize-redux';
import iaxios from '../../axios';

const propTypes = {
  quiz: PropTypes.shape().isRequired,
  setQuiz: PropTypes.func.isRequired,
  sessions: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  translate: PropTypes.func.isRequired,
};

const QuizSessionsForm = ({
  quiz, setQuiz, sessions, translate,
}) => {
  const [targetKeys, setTargetKeys] = useState([]);

  useEffect(() => {
    setTargetKeys(quiz.sessions.map(s => s.id));
  }, [quiz]);

  const handleChange = (nextTargetKeys) => {
    setTargetKeys(nextTargetKeys);
  };

  const updateSessions = () => {
    iaxios()
      .patch(`/quiz/${quiz.id}/sessions`, { sessions: targetKeys })
      .then((res) => {
        if (res !== 'error') {
          setQuiz(res.data);
        }
      });
  };

  return (
    <div>
      <Transfer
        dataSource={sessions.map(s => ({ ...s, key: s.id }))}
        titles={[
          translate('quizSessionsForm.sessionsWithout'),
          translate('quizSessionsForm.sessionsWith'),
        ]}
        targetKeys={targetKeys}
        render={item => <span>{item.name}</span>}
        onChange={handleChange}
      />
      <Button type="primary" onClick={updateSessions}>
        <Translate id="update" />
      </Button>
    </div>
  );
};

QuizSessionsForm.propTypes = propTypes;

export default withLocalize(QuizSessionsForm);
