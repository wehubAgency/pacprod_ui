import React, { useState, useEffect } from 'react';
import { Translate } from 'react-localize-redux';
import { Button } from 'antd';
import { useFetchData } from '../../hooks';
import ARTargetTable from './ARTargetTable';
import ARTargetForm from './ARTargetForm';

const ARTargetManager = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [arTargets, setArTargets] = useState([]);
  const [selectedArTarget, selectArTarget] = useState('');

  const { data, fetching } = useFetchData('/artargets');

  useEffect(() => {
    setArTargets(data);
  }, [data]);

  const openModal = (mode, e) => {
    setModalVisible(true);
    setFormMode(mode);
    if (e && e.currentTarget.dataset.id) {
      selectArTarget(e.currentTarget.dataset.id);
    }
  };

  const tableProps = {
    openModal,
    arTargets,
    setArTargets,
    fetching,
  };

  const formProps = {
    inModal: true,
    formMode,
    modalVisible,
    setModalVisible,
    arTargets,
    setArTargets,
    selectedArTarget,
  };

  return (
    <div>
      <Button type="primary" icon="plus" onClick={() => openModal('create')}>
        <span>
          <Translate id="createArTarget" />
        </span>
      </Button>
      <ARTargetTable {...tableProps} />
      <ARTargetForm {...formProps} />
    </div>
  );
};

export default ARTargetManager;
