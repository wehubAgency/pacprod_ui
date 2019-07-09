import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Translate } from 'react-localize-redux';
import { Button, Typography } from 'antd';
import PlaypointsList from './PlaypointsList';
import PlaypointForm from './PlaypointForm';

const propTypes = {
  playpoints: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  setPlaypoints: PropTypes.func.isRequired,
  selectPlaypoint: PropTypes.func.isRequired,
  selectedPlaypoint: PropTypes.string.isRequired,
  selectedCompany: PropTypes.string.isRequired,
};

const PlaypointSection = ({
  playpoints,
  setPlaypoints,
  selectPlaypoint,
  selectedPlaypoint,
  selectedCompany,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [formMode, setFormMode] = useState('create');

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

  const { Title } = Typography;

  const listProps = {
    playpoints,
    setPlaypoints,
    openModal,
    selectPlaypoint,
    selectedPlaypoint,
    selectedCompany,
  };

  return (
    <div>
      <Title level={2}>
        <Translate id="playpointSection.title" />
      </Title>
      <Button icon="plus" onClick={() => openModal()}>
        <span>
          <Translate id="createPlaypoint" />
        </span>
      </Button>
      <PlaypointsList {...listProps} />
      <PlaypointForm {...formProps} />
    </div>
  );
};

PlaypointSection.propTypes = propTypes;

export default PlaypointSection;
