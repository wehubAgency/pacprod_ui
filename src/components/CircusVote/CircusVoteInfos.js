import React from 'react';
import PropTypes from 'prop-types';
import { Tabs, Typography } from 'antd';
import { Translate } from 'react-localize-redux';
import CircusVoteSettingsManager from '../CircusVoteSettings/CircusVoteSettingsManager';
import CircusVoteSessionManager from './CircusVoteSessionManager';
import PrizeManager from '../Prize/PrizeManager';
import ParticipationPrize from '../ParticipationPrize/ParticipationPrize';
import CircusVoteDraw from './CircusVoteDraw';

const propTypes = {
  vote: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
  setAllVotes: PropTypes.func.isRequired,
  allVotes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const CircusVoteInfos = ({ vote, setAllVotes, allVotes }) => (
    <div style={{ marginTop: 50 }}>
      <Typography.Title level={3}>{vote.name}</Typography.Title>
      <Typography.Text strong>
        <Translate id="description" />:
      </Typography.Text>
      <p>{vote.description ? vote.description : <Translate id="nodata" />}</p>
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab={<Translate id="gameRules" />} key="1">
          <CircusVoteSettingsManager vote={vote} setAllVotes={setAllVotes} allVotes={allVotes} />
        </Tabs.TabPane>
        <Tabs.TabPane tab={<Translate id="prizes" />} key="2">
          <PrizeManager prizesOwner={vote} className="circusVote" entityName="votePrize" />
          <ParticipationPrize
            url={`circusvotes/${vote.id}`}
            prizes={vote.prizes}
            initialPrize={vote.participationPrize}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab={<Translate id="sessions" />} key="3">
          <CircusVoteSessionManager vote={vote} setAllVotes={setAllVotes} allVotes={allVotes} />
        </Tabs.TabPane>
        <Tabs.TabPane tab={<Translate id="randomDrawing" />} key="4">
          <CircusVoteDraw vote={vote} setAllVotes={setAllVotes} />
        </Tabs.TabPane>
      </Tabs>
    </div>
);

CircusVoteInfos.propTypes = propTypes;

export default CircusVoteInfos;
