import React, { useState, useEffect } from 'react';
import { Translate } from 'react-localize-redux';
import { Button } from 'antd';
import PrizeInfosForm from './PrizeInfosForm';
import PrizeInfosTable from './PrizeInfosTable';
import { useFetchData } from '../../hooks';

const PrizeInfosManager = () => {
  const [prizeInfos, setPrizeInfos] = useState([]);
  const [selectedPrizeInfos, selectPrizeInfos] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [formMode, setFormMode] = useState('create');

  const { data, fetching } = useFetchData('/prizeinfos');

  useEffect(() => {
    setPrizeInfos(data);
  }, [data]);

  const openModal = (mode = 'create', e) => {
    setFormMode(mode);
    setModalVisible(true);
    if (e && e.currentTarget.dataset.id) {
      selectPrizeInfos(e.currentTarget.dataset.id);
    }
  };

  const formProps = {
    inModal: true,
    setModalVisible,
    modalVisible,
    formMode,
    prizeInfos,
    setPrizeInfos,
    selectedPrizeInfos,
    selectPrizeInfos,
  };

  const tableProps = {
    prizeInfos,
    setPrizeInfos,
    openModal,
    fetching,
  };

  return (
    <div>
      <Button type="primary" icon="plus" onClick={() => openModal()}>
        <span>
          <Translate id="createPrizeInfos" />
        </span>
      </Button>
      <PrizeInfosTable {...tableProps} />
      <PrizeInfosForm {...formProps} />
    </div>
  );
};

export default PrizeInfosManager;
