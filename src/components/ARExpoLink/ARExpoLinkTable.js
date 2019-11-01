import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Table, Switch } from 'antd';
import { Translate } from 'react-localize-redux';
import generateColumns from '../../services/generateColumns';
import iaxios from '../../axios';

const propTypes = {
  arexpoLinks: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  setArexpoLinks: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  fetching: PropTypes.bool.isRequired,
};

const ARExpoLinkTable = ({
  arexpoLinks, setArexpoLinks, openModal, fetching,
}) => {
  const [showDisabled, setShowDisabled] = useState(false);
  const { componentConfig } = useSelector(({ general: { config } }) => config.entities.arexpoLink);
  const { currentApp } = useSelector(({ general }) => general);

  const removeArexpoLink = (id) => {
    iaxios()
      .delete(`/arexpolinks/${id}`, { params: { appId: currentApp.id } })
      .then((res) => {
        if (res !== 'error') {
          const index = arexpoLinks.findIndex(a => a.id === res.data.id);
          const newArexpoLinks = [...arexpoLinks];
          newArexpoLinks.splice(index, 1);
          setArexpoLinks(newArexpoLinks);
        }
      });
  };

  const toggleArexpoLink = (id) => {
    const arexpoLink = arexpoLinks.find(a => a.id === id);
    iaxios()
      .patch(`/arexpolinks/${arexpoLink.id}/enabled`, {
        enabled: !arexpoLink.enabled,
        appId: currentApp.id,
      })
      .then((res) => {
        if (res !== 'error') {
          const index = arexpoLinks.findIndex(a => a.id === res.data.id);
          const newArexpoLinks = [...arexpoLinks];
          newArexpoLinks.splice(index, 1, res.data);
          setArexpoLinks(newArexpoLinks);
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
      func: toggleArexpoLink,
    },
    {
      type: 'remove',
      func: removeArexpoLink,
      confirm: <Translate id="ArexpoLinkComponent.confirmRemove" />,
    },
  ];

  const columns = generateColumns(componentConfig, 'arexpoLinkComponent', actions);

  return (
    <div style={{ marginTop: '50px' }}>
      <Switch checked={showDisabled} onChange={v => setShowDisabled(v)} />
      <span style={{ marginLeft: 15 }}>
        <Translate id="showDisabled" />
      </span>
      <Table
        dataSource={arexpoLinks.filter(a => a.enabled === !showDisabled)}
        columns={columns}
        rowKey="id"
        loading={fetching}
      />
    </div>
  );
};

ARExpoLinkTable.propTypes = propTypes;

export default ARExpoLinkTable;
