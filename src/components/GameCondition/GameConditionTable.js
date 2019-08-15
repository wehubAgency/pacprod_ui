import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Table, Switch } from 'antd';
import { Translate } from 'react-localize-redux';
import generateColumns from '../../services/generateColumns';
import iaxios from '../../axios';

const propTypes = {
  gameConditions: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  setGameConditions: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  fetching: PropTypes.bool.isRequired,
};

const GameConditionTable = ({
  gameConditions, setGameConditions, openModal, fetching,
}) => {
  const [showDisabled, setShowDisabled] = useState(false);
  const { componentConfig } = useSelector(
    ({ general: { config } }) => config.entities.gameCondition,
  );

  const removeGameCondition = (id) => {
    iaxios()
      .delete(`/gameconditions/${id}`)
      .then((res) => {
        if (res !== 'error') {
          const index = gameConditions.findIndex(g => g.id === res.data.id);
          const newGameConditions = [...gameConditions];
          newGameConditions.splice(index, 1);
          setGameConditions(newGameConditions);
        }
      });
  };

  const toggleGameCondition = (id) => {
    iaxios()
      .patch(`/gameconditions/${id}/enabled`, {
        enabled: !gameConditions.find(g => g.id === id).enabled,
      })
      .then((res) => {
        if (res !== 'error') {
          const index = gameConditions.findIndex(g => g.id === res.data.id);
          const newGameConditions = [...gameConditions];
          newGameConditions.splice(index, 1, res.data);
          setGameConditions(newGameConditions);
        }
      });
  };

  const actions = [
    {
      type: 'edit',
      func: (e) => {
        openModal('edit', e);
      },
    },
    {
      type: 'disable',
      func: toggleGameCondition,
    },
    {
      type: 'remove',
      func: removeGameCondition,
      confirm: <Translate id="gameConditionComponent.confirmRemove" />,
    },
  ];
  const columns = generateColumns(componentConfig, 'gameConditionComponent', actions);

  return (
    <div style={{ marginTop: '50px' }}>
      <Switch checked={showDisabled} onChange={v => setShowDisabled(v)} />
      <span style={{ marginLeft: 15 }}>
        <Translate id="showDisabled" />
      </span>
      <Table
        dataSource={gameConditions.filter(g => g.enabled === !showDisabled)}
        columns={columns}
        rowKey="id"
        loading={fetching}
      />
    </div>
  );
};

GameConditionTable.propTypes = propTypes;

export default GameConditionTable;
