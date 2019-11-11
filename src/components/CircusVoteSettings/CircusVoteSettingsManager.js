import React from 'react';
import { Translate } from 'react-localize-redux';
import { Card } from 'antd';
import CircusVoteSettingsForm from './CircusVoteSettingsForm';

const CircusVoteSettingsManager = ({ vote, allVotes, setAllVotes }) => {
  const settingsFormProps = {
    formMode: 'edit',
    vote,
    allVotes,
    setAllVotes,
  };

  return (
    <div>
      <Card title={<Translate id="quizSettings.gameMode" />} bordered={false}>
        <CircusVoteSettingsForm {...settingsFormProps} />
      </Card>
    </div>
  );
};

export default CircusVoteSettingsManager;
