import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Table, Switch } from 'antd';
import { Translate } from 'react-localize-redux';
import generateColumns from '../../services/generateColumns';
import iaxios from '../../axios';

const propTypes = {
  partners: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  setPartners: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  config: PropTypes.shape().isRequired,
  fetching: PropTypes.bool.isRequired,
};

const PartnerTable = ({
  partners,
  setPartners,
  openModal,
  config,
  fetching,
}) => {
  const { componentConfig } = config.entities.partner;
  const [showDisabled, setShowDisabled] = useState(false);

  const togglePartner = (id) => {
    const partner = partners.find((a) => a.id === id);
    iaxios()
      .patch(`/partners/${partner.id}/enabled`, { enabled: !partner.enabled })
      .then((res) => {
        if (res !== 'error') {
          const partnerIndex = partners.findIndex((s) => s.id === res.data.id);
          const newPartners = [...partners];
          newPartners.splice(partnerIndex, 1, res.data);
          setPartners(newPartners);
        }
      });
  };

  const removePartner = (id) => {
    iaxios()
      .delete(`/partners/${id}`)
      .then((res) => {
        if (res !== 'error') {
          const index = partners.findIndex((p) => p.id === res.data.id);
          const newPartners = [...partners];
          newPartners.splice(index, 1);
          setPartners(newPartners);
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
      func: togglePartner,
    },
    {
      type: 'remove',
      func: removePartner,
      confirm: <Translate id="partnerComponent.confirmRemove" />,
    },
  ];

  const columns = generateColumns(componentConfig, 'partnerComponent', actions);

  return (
    <div style={{ marginTop: '50px' }}>
      <Switch checked={showDisabled} onChange={(v) => setShowDisabled(v)} />
      <span style={{ marginLeft: 15 }}>
        <Translate id="showDisabled" />
      </span>
      <Table
        dataSource={partners.filter((s) => s.enabled === !showDisabled)}
        columns={columns}
        rowKey="id"
        loading={fetching}
      />
    </div>
  );
};

PartnerTable.propTypes = propTypes;

export default PartnerTable;
