import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Table, Switch } from 'antd';
import { Translate } from 'react-localize-redux';
import generateColumns from '../../services/generateColumns';
import iaxios from '../../axios';

const propTypes = {
  coins: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      enabled: PropTypes.bool.isRequired,
    }),
  ).isRequired,
  setCoins: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
};

const CoinTable = ({ coins, setCoins, openModal }) => {
  const [showDisabled, setShowDisabled] = useState(false);
  const { componentConfig } = useSelector(({ general: { config } }) => config.entities.coin);

  const removeCoin = (id) => {
    iaxios()
      .delete(`/coins/${id}`)
      .then((res) => {
        if (res !== 'error') {
          const index = coins.find(a => a.id === res.data.id);
          const newCoins = [...coins];
          newCoins.splice(index, 1);
          setCoins(newCoins);
        }
      });
  };

  const toggleCoin = (id) => {
    iaxios()
      .patch(`coins/${id}/enabled`, { enabled: !coins.find(c => c.id === id).enabled })
      .then((res) => {
        if (res !== 'error') {
          const index = coins.findIndex(c => c.id === res.data.id);
          const newCoins = [...coins];
          newCoins.splice(index, 1, res.data);
          setCoins(newCoins);
        }
      });
  };

  const actions = [
    {
      type: 'edit',
      func: (e) => {
        openModal('edit', e);
      },
    },
    {
      type: 'disable',
      func: toggleCoin,
    },
    {
      type: 'remove',
      func: removeCoin,
      confirm: <Translate id="coinComponent.confirmRemove" />,
    },
  ];
  const columns = generateColumns(componentConfig, 'coinComponent', actions);

  return (
    <div style={{ marginTop: '50px' }}>
      <div>
        <Switch checked={showDisabled} onChange={v => setShowDisabled(v)} />
        <span style={{ marginLeft: 15 }}>
          <Translate id="showDisabled" />
        </span>
      </div>
      <Table
        dataSource={coins.filter(c => c.enabled !== showDisabled)}
        columns={columns}
        rowKey="id"
      />
    </div>
  );
};

CoinTable.propTypes = propTypes;

export default CoinTable;
