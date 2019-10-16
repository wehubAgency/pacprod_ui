import React, { useState, useEffect } from 'react';
import { Translate } from 'react-localize-redux';
import { Button } from 'antd';
import { useFetchData } from '../../hooks';
import ARObjectTable from './ARObjectTable';
import ARObjectForm from './ARObjectForm';

const ARObjectManager = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [arobjects, setArobjects] = useState([]);
  const [selectedArobject, selectArobject] = useState('');

  const { data, fetching } = useFetchData('/arobjects');

  useEffect(() => {
    setArobjects(data);
  }, [data]);

  const openModal = (mode, e) => {
    setModalVisible(true);
    setFormMode(mode);
    if (e && e.currentTarget.dataset.id) {
      selectArobject(e.currentTarget.dataset.id);
    }
  };

  const tableProps = {
    openModal,
    arobjects,
    setArobjects,
    fetching,
  };

  const formProps = {
    inModal: true,
    formMode,
    modalVisible,
    setModalVisible,
    arobjects,
    setArobjects,
    selectedArobject,
  };

  return (
    <div>
      <Button type="primary" icon="plus" onClick={() => openModal('create')}>
        <span>
          <Translate id="createArobject" />
        </span>
      </Button>
      <ARObjectTable {...tableProps} />
      <ARObjectForm {...formProps} />
    </div>
  );
};

export default ARObjectManager;
