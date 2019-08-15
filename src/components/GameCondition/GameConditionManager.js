import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import { Translate } from 'react-localize-redux';
import GameConditionForm from './GameConditionForm';
import GameConditionTable from './GameConditionTable';
import { useFetchData } from '../../hooks';

const GameConditionManager = () => {
  const [gameConditions, setGameConditions] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [selectedGameCondition, selectGameCondition] = useState('');

  const { data, fetching } = useFetchData('/gameconditions');

  useEffect(() => {
    setGameConditions(data);
  }, [data]);

  const openModal = (mode = 'create', e) => {
    setFormMode(mode);
    setModalVisible(true);
    if (e && e.currentTarget.dataset.id) {
      selectGameCondition(e.currentTarget.dataset.id);
    }
  };

  const formProps = {
    inModal: true,
    formMode,
    modalVisible,
    setModalVisible,
    gameConditions,
    setGameConditions,
    selectedGameCondition,
  };

  const tableProps = {
    openModal,
    gameConditions,
    setGameConditions,
    fetching,
  };

  return (
    <div>
      <Button type="primary" icon="plus" onClick={() => openModal()}>
        <span>
          <Translate id="createGameConditions" />
        </span>
      </Button>
      <div style={{ marginTop: 50 }}>
        <GameConditionTable {...tableProps} />
        <GameConditionForm {...formProps} />
      </div>
    </div>
  );
};

export default GameConditionManager;
