import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { Translate } from 'react-localize-redux';
import PaidprizeTable from './PaidprizeTable';
import PaidprizeForm from './PaidprizeForm';
import { useFetchData } from '../../hooks';

const PaidprizeManager = () => {
  const [paidprizes, setPaidprizes] = useState([]);
  const [selectedPaidprize, selectPaidprize] = useState('');
  const [formMode, setFormMode] = useState('create');
  const [modalVisible, setModalVisible] = useState(false);

  const { data, fetching } = useFetchData('/paidprizes');

  useEffect(() => {
    setPaidprizes(data);
  }, [data]);

  const openModal = (mode = 'create', e) => {
    setFormMode(mode);
    setModalVisible(true);
    if (e && e.currentTarget.dataset.id) {
      selectPaidprize(e.currentTarget.dataset.id);
    }
  };

  const tableProps = {
    paidprizes,
    setPaidprizes,
    openModal,
    fetching,
  };

  const formProps = {
    inModal: true,
    setModalVisible,
    modalVisible,
    formMode,
    paidprizes,
    setPaidprizes,
    selectedPaidprize,
    selectPaidprize,
  };

  return (
    <div>
      <Button type="primary" icon="plus" onClick={() => openModal()}>
        <span>
          <Translate id="addPrize" />
        </span>
      </Button>
      <PaidprizeForm {...formProps} />
      <PaidprizeTable {...tableProps} />
    </div>
  );
};

export default PaidprizeManager;
