import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Transfer, Button, Typography } from 'antd';
import { Translate } from 'react-localize-redux';
import GameConditionInfos from './GameConditionInfos';
import iaxios from '../../axios';

const propTypes = {
  game: PropTypes.shape().isRequired,
  patchGameConditions: PropTypes.func.isRequired,
};

const GameConditionTransfer = ({ game, patchGameConditions }) => {
  const [gameConditions, setGameConditions] = useState([]);
  const [targetKeys, setTargetKeys] = useState([]);
  const [selectedGameCondition, selectGameCondition] = useState('');

  useEffect(() => {
    const ax = iaxios();
    ax.get('/gameconditions').then((res) => {
      setGameConditions(res.data);
    });
    setTargetKeys(game.gameConditions.map(g => g.id));
    /* eslint-disable-next-line */
  }, []);

  const showGameConditions = (id, e) => {
    e.stopPropagation();
    selectGameCondition(id);
  };

  const updateGameConditions = () => {
    patchGameConditions(targetKeys);
  };

  return (
    <div>
      <Transfer
        dataSource={gameConditions.map(g => ({ ...g, key: g.id }))}
        showSearch
        targetKeys={targetKeys}
        filterOption={(inputValue, option) => {
          const { name } = option;
          return name.toLowerCase().indexOf(inputValue.toLowerCase()) > -1;
        }}
        onChange={newTargetKeys => setTargetKeys(newTargetKeys)}
        render={item => (
          <span className="gamecondition-item">
            <span style={{ marginRight: 15 }}>{item.name}</span>
            <Button
              shape="circle"
              type="dashed"
              icon="sliders"
              onClick={e => showGameConditions(item.id, e)}
            />
          </span>
        )}
      />
      <Button
        style={{ margin: '25px auto', display: 'block' }}
        type="primary"
        onClick={updateGameConditions}
      >
        <span>
          <Translate id="updateGameConditions" />
        </span>
      </Button>
      {selectedGameCondition && (
        <div style={{ marginTop: 25 }}>
          <Typography.Title level={4} style={{ textAlign: 'center' }}>
            {gameConditions.find(g => g.id === selectedGameCondition).name}
          </Typography.Title>
          <GameConditionInfos
            gameCondition={gameConditions.find(g => g.id === selectedGameCondition)}
          />
        </div>
      )}
    </div>
  );
};

GameConditionTransfer.propTypes = propTypes;

export default GameConditionTransfer;
