import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';
import generateColumns from '../../services/generateColumns';
import iaxios from '../../axios';

const propTypes = {
  apps: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  setApps: PropTypes.func.isRequired,
  config: PropTypes.shape().isRequired,
  openModal: PropTypes.func.isRequired,
};

const AppTable = ({
  apps, setApps, config, openModal,
}) => {
  const { componentConfig } = config.entities.app;

  const toggleApp = (id) => {
    iaxios('super_admin')
      .patch(`/apps/${id}/enabled`, {
        enabled: !apps.find(a => a.id === id).enabled,
      })
      .then((res) => {
        if (res !== 'error') {
          const index = apps.findIndex(a => a.id === res.data.id);
          const newApps = [...apps];
          newApps.splice(index, 1, res.data);
          setApps({ apps: newApps });
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
      func: toggleApp,
    },
  ];
  const columns = generateColumns(componentConfig, 'appComponent', actions);

  return (
    <div style={{ marginTop: '50px' }}>
      <Table dataSource={apps} columns={columns} rowKey="id" />
    </div>
  );
};

AppTable.propTypes = propTypes;

export default AppTable;
