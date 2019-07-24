import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Button } from 'antd';
import { Translate } from 'react-localize-redux';
import iaxios from '../axios';
import GameConditionForm from '../components/GameCondition/GameConditionForm';
import GameConditionTable from '../components/GameCondition/GameConditionTable';

const _GameConditionsPage = ({
  general: {
    currentApp, currentEntity, currentSeason, config,
  },
}) => {
  const [gameConditions, setGameConditions] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [selectedGameCondition, selectGameCondition] = useState('');

  const openModal = (mode = 'create', e) => {
    setFormMode(mode);
    setModalVisible(true);
    if (e && e.currentTarget.dataset.id) {
      selectGameCondition(e.currentTarget.dataset.id);
    }
  };

  useEffect(() => {
    setFetching(true);
    const ax = iaxios();
    ax.get('/gameconditions').then((res) => {
      if (res !== 'error') {
        setGameConditions(res.data);
      }
      setFetching(false);
    });

    return () => ax.source.cancel();
  }, [currentApp, currentEntity, currentSeason]);

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
    config,
    fetching,
  };

  return (
    <div>
      <h1>
        <Translate id="gameConditionsPage.h1" />
      </h1>
      <div className="instructions">
        <h4>
          <Translate id="instructions" />
        </h4>
        <Translate id="gameConditionsPage.instructions" />
      </div>
      <Button type="primary" icon="plus" onClick={() => openModal()}>
        <span>
          <Translate id="createGameConditions" />
        </span>
      </Button>
      <div style={{ marginTop: 50 }}>
        <div>
          <GameConditionTable {...tableProps} />
          <GameConditionForm {...formProps} />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ general }) => ({ general });

export const GameConditionsPage = connect(
  mapStateToProps,
  {},
)(_GameConditionsPage);
