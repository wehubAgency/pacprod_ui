import React, { useState, useEffect } from 'react';
import { Spin, Button } from 'antd';
import { Translate } from 'react-localize-redux';
import CoinForm from './CoinForm';
import CoinTable from './CoinTable';
import { useFetchData } from '../../hooks';

const CurrencyManager = () => {
  const [coins, setCoins] = useState([]);
  const [selectedCoin, selectCoin] = useState('');
  const [formMode, setFormMode] = useState('create');
  const [modalVisible, setModalVisible] = useState(false);

  const { data, fetching } = useFetchData('/coins');

  useEffect(() => {
    setCoins(data);
  }, [data]);

  const openModal = (mode = 'create', e) => {
    setFormMode(mode);
    setModalVisible(true);
    if (e && e.currentTarget.dataset.id) {
      selectCoin(e.currentTarget.dataset.id);
    }
  };

  const formProps = {
    inModal: true,
    coins,
    setCoins,
    selectedCoin,
    modalVisible,
    setModalVisible,
    formMode,
  };

  const tableProps = {
    coins,
    setCoins,
    selectCoin,
    openModal,
  };

  return (
    <div>
      {fetching ? (
        <Spin />
      ) : (
        <div>
          <Button type="primary" icon="plus" onClick={() => openModal()}>
            <span>
              <Translate id="createCoin" />
            </span>
          </Button>
          <CoinTable {...tableProps} />
          <CoinForm {...formProps} />
        </div>
      )}
    </div>
  );
};

export default CurrencyManager;
