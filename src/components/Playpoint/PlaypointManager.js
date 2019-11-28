import React, { useState, useEffect } from 'react';
import { Button, Typography, Empty } from 'antd';
import { Translate } from 'react-localize-redux';
import PlaypointsList from './PlaypointsList';
import PlaypointForm from './PlaypointForm';

const PlaypointManager = ({ selectedCompany, ...props }) => {
  const [playpoints, setPlaypoints] = useState(props.playpoints);
  const [selectedPlaypoint, selectPlaypoint] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [formMode, setFormMode] = useState('create');

  useEffect(() => {
    setPlaypoints(props.playpoints);
  }, [props.playpoints]);

  const openModal = (mode = 'create') => {
    setModalVisible(true);
    setFormMode(mode);
  };

  const formProps = {
    inModal: true,
    modalVisible,
    setModalVisible,
    formMode,
    playpoints,
    setPlaypoints,
    selectPlaypoint,
    selectedPlaypoint,
    selectedCompany,
  };

  const listProps = {
    playpoints,
    setPlaypoints,
    openModal,
    selectPlaypoint,
    selectedPlaypoint,
    selectedCompany,
  };

  const { Title } = Typography;

  return (
    <div>
      <div>
        <Title level={2}>
          <Translate id="playpointManager.playpoints" />
        </Title>
        <Button icon="plus" onClick={() => openModal()}>
          <span>
            <Translate id="createPlaypoint" />
          </span>
        </Button>
        {!playpoints ? (
          <Empty />
        ) : (
          <div>
            <PlaypointsList {...listProps} />
            <PlaypointForm {...formProps} />
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaypointManager;
