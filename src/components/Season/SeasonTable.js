import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';
import generateColumns from '../../services/generateColumns';

const propTypes = {
  seasons: PropTypes.arrayOf(PropTypes.object).isRequired,
  config: PropTypes.shape().isRequired,
  openModal: PropTypes.func.isRequired,
  fetching: PropTypes.bool.isRequired,
};

const SeasonTable = ({
  seasons, config, openModal, fetching,
}) => {
  const { componentConfig } = config.entities.season;

  const actions = [
    {
      type: 'edit',
      func: (e) => {
        openModal('edit', e);
      },
    },
  ];

  const columns = generateColumns(componentConfig, 'seasonComponent', actions);

  return (
    <div style={{ marginTop: '50px' }}>
      <Table dataSource={seasons} columns={columns} rowKey="id" loading={fetching} />
    </div>
  );
};

SeasonTable.propTypes = propTypes;

export default SeasonTable;
