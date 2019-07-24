import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Spin, Button } from 'antd';
import { Translate } from 'react-localize-redux';
import CoinForm from '../components/Coin/CoinForm';
import CoinTable from '../components/Coin/CoinTable';
import iaxios from '../axios';

const _CurrencyPage = ({
  general: {
    currentApp, currentEntity, currentSeason, config,
  },
}) => {
  const [coins, setCoins] = useState([]);
  const [selectedCoin, selectCoin] = useState('');
  const [formMode, setFormMode] = useState('create');
  const [modalVisible, setModalVisible] = useState(false);
  const [fetching, setFetching] = useState(false);
  useEffect(() => {
    setFetching(true);
    const ax = iaxios();
    ax.get('/coins').then((res) => {
      if (res !== 'error') {
        setCoins(res.data);
      }
      setFetching(false);
    });
    return () => ax.source.cancel();
  }, [currentApp, currentEntity, currentSeason]);

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
    config,
    openModal,
  };

  return (
    <div>
      <h1>
        <Translate id="currencyPage.h1" />
      </h1>
      <div className="instructions">
        <h4>
          <Translate id="instructions" />
        </h4>
        <Translate id="currencyPage.instructions" />
      </div>
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

const mapStateToProps = ({ general }) => ({ general });

export const CurrencyPage = connect(
  mapStateToProps,
  {},
)(_CurrencyPage);
