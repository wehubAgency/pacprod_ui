import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Table, Switch } from 'antd';
import { Translate } from 'react-localize-redux';
import generateColumns from '../../services/generateColumns';
import iaxios from '../../axios';

const propTypes = {
  prizeInfos: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  setPrizeInfos: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  fetching: PropTypes.bool.isRequired,
};

const PrizeInfosTable = ({
  prizeInfos, setPrizeInfos, openModal, fetching,
}) => {
  const { componentConfig } = useSelector(({ general: { config } }) => config.entities.prizeInfos);
  const [showDisabled, setShowDisabled] = useState(false);

  const deletePrizeInfos = (id) => {
    iaxios()
      .delete(`/prizeinfos/${id}`)
      .then((res) => {
        if (res !== 'error') {
          const index = prizeInfos.findIndex(p => p.id === res.data.id);
          const newPrizeInfos = [...prizeInfos];
          newPrizeInfos.splice(index, 1);
          setPrizeInfos(newPrizeInfos);
        }
      });
  };

  const togglePrize = (id) => {
    iaxios()
      .patch(`/prizeinfos/${id}/enabled`, { enabled: !prizeInfos.find(p => p.id === id).enabled })
      .then((res) => {
        if (res !== 'error') {
          const index = prizeInfos.findIndex(p => p.id === res.data.id);
          const newPrizeInfos = [...prizeInfos];
          newPrizeInfos.splice(index, 1, res.data);
          setPrizeInfos(newPrizeInfos);
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
      func: togglePrize,
    },
    {
      type: 'remove',
      func: deletePrizeInfos,
      confirm: <Translate id="prizeInfosComponent.confirmRemove" />,
    },
  ];
  const columns = generateColumns(componentConfig, 'prizeInfosComponent', actions);

  return (
    <div style={{ marginTop: 25 }}>
      <div style={{ margin: '15px 0' }}>
        <Switch checked={showDisabled} onChange={v => setShowDisabled(v)} />
        <span style={{ marginLeft: 10 }}>
          <Translate id="showDisabled" />
        </span>
      </div>
      <Table
        dataSource={prizeInfos.filter(p => p.enabled === !showDisabled)}
        columns={columns}
        rowKey="id"
        loading={fetching}
      />
    </div>
  );
};

PrizeInfosTable.propTypes = propTypes;

export default PrizeInfosTable;
