import React from 'react';
import PropTypes from 'prop-types';
import { Tabs, Typography } from 'antd';
import { Translate } from 'react-localize-redux';
import QuestionsManager from '../Questions/QuestionsManager';
import CircusQuizSettingsManager from '../CircusQuizSettings/CircusQuizSettingsManager';
import CircusQuizSessionManager from './CircusQuizSessionManager';
import PrizeManager from '../Prize/PrizeManager';
import CircusQuizDraw from './CircusQuizDraw';
import MagicFinaleManager from '../MagicFinale/MagicFinaleManager';
import ParticipationPrize from '../ParticipationPrize/ParticipationPrize';

const propTypes = {
  quiz: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
  setAllQuiz: PropTypes.func.isRequired,
  allQuiz: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const CircusQuizInfos = ({ quiz, setAllQuiz, allQuiz }) => (
  <div style={{ marginTop: 50 }}>
    <Typography.Title level={3}>{quiz.name}</Typography.Title>
    <Typography.Text strong>
      <Translate id="description" />:
    </Typography.Text>
    <p>{quiz.description ? quiz.description : <Translate id="nodata" />}</p>
    <Tabs defaultActiveKey="1">
      <Tabs.TabPane tab={<Translate id="questions" />} key="1">
        <QuestionsManager quiz={quiz.id} circusQuiz />
      </Tabs.TabPane>
      <Tabs.TabPane tab={<Translate id="prizes" />} key="2">
        <PrizeManager
          prizesOwner={quiz}
          className="circusQuiz"
          entityName="quizPrize"
        />
        <ParticipationPrize
          url={`circusquiz/${quiz.id}`}
          prizes={quiz.prizes}
          initialPrize={quiz.participationPrize}
        />
      </Tabs.TabPane>
      <Tabs.TabPane tab={<Translate id="gameRules" />} key="3">
        <CircusQuizSettingsManager
          quiz={quiz}
          setAllQuiz={setAllQuiz}
          allQuiz={allQuiz}
        />
      </Tabs.TabPane>
      <Tabs.TabPane tab={<Translate id="sessions" />} key="4">
        <CircusQuizSessionManager
          quiz={quiz}
          setAllQuiz={setAllQuiz}
          allQuiz={allQuiz}
        />
      </Tabs.TabPane>
      <Tabs.TabPane tab={<Translate id="randomDrawing" />} key="5">
        <CircusQuizDraw quiz={quiz} setAllQuiz={setAllQuiz} />
      </Tabs.TabPane>
      {quiz.settings.magicFinale && (
        <Tabs.TabPane tab={<Translate id="magicFinale" />} key="6">
          <MagicFinaleManager game={quiz} setAllQuiz={setAllQuiz} />
        </Tabs.TabPane>
      )}
    </Tabs>
  </div>
);

CircusQuizInfos.propTypes = propTypes;

export default CircusQuizInfos;
