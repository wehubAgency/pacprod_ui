import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Table, Switch } from 'antd';
import { Translate } from 'react-localize-redux';
import generateColumns from '../../services/generateColumns';
import iaxios from '../../axios';

const propTypes = {
  argameLinks: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  setArgameLinks: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  fetching: PropTypes.bool.isRequired,
};

const ARGameLinkTable = ({
  argameLinks, setArgameLinks, openModal, fetching,
}) => {
  const [showDisabled, setShowDisabled] = useState(false);
  const { componentConfig } = useSelector(({ general: { config } }) => config.entities.argameLink);
  const { currentApp } = useSelector(({ general }) => general);

  const removeArgameLink = (id) => {
    iaxios()
      .delete(`/argamelinks/${id}`, { params: { appId: currentApp.id } })
      .then((res) => {
        if (res !== 'error') {
          const index = argameLinks.findIndex(a => a.id === res.data.id);
          const newArgameLinks = [...argameLinks];
          newArgameLinks.splice(index, 1);
          setArgameLinks(newArgameLinks);
        }
      });
  };

  const toggleArgameLink = (id) => {
    const argameLink = argameLinks.find(a => a.id === id);
    iaxios()
      .patch(`/argamelinks/${argameLink.id}/enabled`, {
        enabled: !argameLink.enabled,
        appId: currentApp.id,
      })
      .then((res) => {
        if (res !== 'error') {
          const index = argameLinks.findIndex(a => a.id === res.data.id);
          const newArgameLinks = [...argameLinks];
          newArgameLinks.splice(index, 1, res.data);
          setArgameLinks(newArgameLinks);
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
      func: toggleArgameLink,
    },
    {
      type: 'remove',
      func: removeArgameLink,
      confirm: <Translate id="ArgameLinkComponent.confirmRemove" />,
    },
  ];

  const columns = generateColumns(componentConfig, 'argameLinkComponent', actions);

  return (
    <div style={{ marginTop: '50px' }}>
      <Switch checked={showDisabled} onChange={v => setShowDisabled(v)} />
      <span style={{ marginLeft: 15 }}>
        <Translate id="showDisabled" />
      </span>
      <Table
        dataSource={argameLinks.filter(a => a.enabled === !showDisabled)}
        columns={columns}
        rowKey="id"
        loading={fetching}
      />
    </div>
  );
};

ARGameLinkTable.propTypes = propTypes;

export default ARGameLinkTable;
