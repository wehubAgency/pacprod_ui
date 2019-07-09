import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Table, Switch } from 'antd';
import { Translate } from 'react-localize-redux';
import generateColumns from '../../services/generateColumns';
import iaxios from '../../axios';

const propTypes = {
  paidprizes: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  setPaidprizes: PropTypes.func.isRequired,
  config: PropTypes.shape().isRequired,
  openModal: PropTypes.func.isRequired,
  fetching: PropTypes.bool.isRequired,
};

const PaidprizeTable = ({
  paidprizes, setPaidprizes, config, openModal, fetching,
}) => {
  const { componentConfig } = config.entities.paidprize;
  const [showDisabled, setShowDisabled] = useState(false);

  const deletePaidprize = (id) => {
    iaxios()
      .delete(`/paidprizes/${id}`)
      .then((res) => {
        if (res !== 'error') {
          const index = paidprizes.findIndex(p => p.id === res.data.id);
          const newPaidprize = [...paidprizes];
          newPaidprize.splice(index, 1);
          setPaidprizes(newPaidprize);
        }
      });
  };

  const togglePrize = (id) => {
    iaxios()
      .patch(`/paidprizes/${id}/enabled`, { enabled: !paidprizes.find(p => p.id === id).enabled })
      .then((res) => {
        if (res !== 'error') {
          const index = paidprizes.findIndex(p => p.id === res.data.id);
          const newPaidprize = [...paidprizes];
          newPaidprize.splice(index, 1, res.data);
          setPaidprizes(newPaidprize);
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
      func: deletePaidprize,
      confirm: <Translate id="paidprizeComponent.confirmRemove" />,
    },
  ];
  const columns = generateColumns(componentConfig, 'paidprizeComponent', actions);

  return (
    <div style={{ marginTop: 25 }}>
      <div style={{ margin: '15px 0' }}>
        <Switch checked={showDisabled} onChange={v => setShowDisabled(v)} />
        <span style={{ marginLeft: 10 }}>
          <Translate id="showDisabled" />
        </span>
      </div>
      <Table
        dataSource={paidprizes.filter(p => p.enabled === !showDisabled)}
        columns={columns}
        rowKey="id"
        loading={fetching}
      />
    </div>
  );
};

PaidprizeTable.propTypes = propTypes;

export default PaidprizeTable;
