import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Transfer, Button, message } from 'antd';
import { withLocalize, Translate } from 'react-localize-redux';
import iaxios from '../../axios';
import { useFetchData } from '../../hooks';

const propTypes = {
  quiz: PropTypes.shape().isRequired,
  setAllQuiz: PropTypes.func.isRequired,
  allQuiz: PropTypes.arrayOf(PropTypes.object).isRequired,
  translate: PropTypes.func.isRequired,
};

const CircusQuizSessionsManager = ({
  quiz,
  allQuiz,
  setAllQuiz,
  translate,
}) => {
  const [sessions, setSessions] = useState([]);
  const [targetKeys, setTargetKeys] = useState([]);

  const { data } = useFetchData('/sessions');

  useEffect(() => {
    setSessions(data);
  }, [data]);

  useEffect(() => {
    setTargetKeys(quiz.sessions.map(s => s.id));
  }, [quiz]);

  const handleChange = (nextTargetKeys) => {
    setTargetKeys(nextTargetKeys);
  };

  const updateSessions = () => {
    iaxios()
      .patch(`/circusquiz/${quiz.id}/sessions`, { sessions: targetKeys })
      .then((res) => {
        if (res !== 'error') {
          const index = allQuiz.findIndex(q => q.id === res.data.id);
          const newQuiz = [...allQuiz];
          newQuiz.splice(index, 1, res.data);
          setAllQuiz(newQuiz);
          message.success(translate('success'));
        }
      });
  };

  return (
    <div>
      <Transfer
        dataSource={sessions
          .filter(s => s.enabled)
          .map(s => ({ ...s, key: s.id }))}
        titles={[
          translate('circusQuizSessionsForm.sessionsWithout'),
          translate('circusQuizSessionsForm.sessionsWith'),
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

CircusQuizSessionsManager.propTypes = propTypes;

export default withLocalize(CircusQuizSessionsManager);
