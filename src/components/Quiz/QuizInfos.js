import React, { useState, useEffect } from 'react';
import { Tabs, message } from 'antd';
import { Translate, withLocalize } from 'react-localize-redux';
import QuestionsManager from '../Questions/QuestionsManager';
import iaxios from '../../axios';
import QuizSettingsManager from '../QuizSettings/QuizSettingsManager';
import GameConditionManager from '../GameCondition/GameConditionManager';
import PrizeManager from '../Prize/PrizeManager';

const QuizInfos = ({ quiz, setAllQuiz, allQuiz, translate }) => {
  const [questions, setQuestions] = useState([]);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    setFetching(true);
    const ax = iaxios();
    ax.get('/questions', { params: { quiz: quiz.id } }).then((res) => {
      if (res !== 'error') {
        setQuestions(res.data);
      }
      setFetching(false);
    });
    return () => ax.source.cancel();
  }, [quiz]);

  const patchGameConditions = (ids) => {
    iaxios()
      .patch(`/quiz/${quiz.id}/gameconditions`, { gameConditions: ids })
      .then((res) => {
        if (res !== 'error') {
          const index = allQuiz.findIndex((q) => q.id === res.data.id);
          const newQuiz = [...allQuiz];
          newQuiz.splice(index, 1, res.data);
          setAllQuiz(newQuiz);
          message.success(translate('success'));
        }
      });
  };

  const questionsManagerProps = {
    questions,
    setQuestions,
    fetching,
    quiz: quiz.id,
  };

  return (
    <div style={{ marginTop: 50 }}>
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab={<Translate id="questions" />} key="1">
          <QuestionsManager {...questionsManagerProps} />
        </Tabs.TabPane>
        <Tabs.TabPane tab={<Translate id="prizes" />} key="2">
          <PrizeManager game={quiz} className="quiz" feature="quiz" />
        </Tabs.TabPane>
        <Tabs.TabPane tab={<Translate id="gameRules" />} key="3">
          <QuizSettingsManager
            quiz={quiz}
            setAllQuiz={setAllQuiz}
            allQuiz={allQuiz}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab={<Translate id="gameConditions" />} key="4">
          <GameConditionManager
            game={quiz}
            patchGameConditions={patchGameConditions}
          />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default withLocalize(QuizInfos);
