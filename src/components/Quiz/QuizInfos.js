import React from 'react';
import PropTypes from 'prop-types';
import { Tabs, message, Typography } from 'antd';
import { Translate, withLocalize } from 'react-localize-redux';
import QuestionsManager from '../Questions/QuestionsManager';
import iaxios from '../../axios';
import QuizSettingsManager from '../QuizSettings/QuizSettingsManager';
import GameConditionTransfer from '../GameCondition/GameConditionTransfer';
import PrizeManager from '../Prize/PrizeManager';
import QuizDraw from './QuizDraw';

const propTypes = {
  quiz: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
  setAllQuiz: PropTypes.func.isRequired,
  allQuiz: PropTypes.arrayOf(PropTypes.object).isRequired,
  translate: PropTypes.func.isRequired,
};

const QuizInfos = ({
  quiz, setAllQuiz, allQuiz, translate,
}) => {
  const patchGameConditions = (ids) => {
    iaxios()
      .patch(`/quiz/${quiz.id}/gameconditions`, { gameConditions: ids })
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
    <div style={{ marginTop: 50 }}>
      <Typography.Title level={3}>{quiz.name}</Typography.Title>
      <Typography.Text strong>
        <Translate id="description" />:
      </Typography.Text>
      <p>{quiz.description ? quiz.description : <Translate id="nodata" />}</p>
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab={<Translate id="questions" />} key="1">
          <QuestionsManager quiz={quiz.id} />
        </Tabs.TabPane>
        <Tabs.TabPane tab={<Translate id="prizes" />} key="2">
          <PrizeManager prizesOwner={quiz} className="quiz" entityName="quizPrize" />
        </Tabs.TabPane>
        <Tabs.TabPane tab={<Translate id="gameRules" />} key="3">
          <QuizSettingsManager quiz={quiz} setAllQuiz={setAllQuiz} allQuiz={allQuiz} />
        </Tabs.TabPane>
        <Tabs.TabPane tab={<Translate id="gameConditions" />} key="4">
          <GameConditionTransfer game={quiz} patchGameConditions={patchGameConditions} />
        </Tabs.TabPane>
        <Tabs.TabPane tab={<Translate id="randomDrawing" />} key="5">
          <QuizDraw quiz={quiz} setAllQuiz={setAllQuiz} />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

QuizInfos.propTypes = propTypes;

export default withLocalize(QuizInfos);
