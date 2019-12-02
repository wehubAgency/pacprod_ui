import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Modal, Table } from 'antd';
import generateColumns from '../../services/generateColumns';

const propTypes = {
  userWinnings: PropTypes.arrayOf(PropTypes.object).isRequired,
  setUserWinnings: PropTypes.func.isRequired,
};

const UserWinnings = ({ userWinnings, setUserWinnings }) => {
  const { componentConfig } = useSelector(
    ({ general: { config } }) => config.entities.userWinnings,
  );

  const columns = generateColumns(componentConfig, 'userWinningsComponent');

  return (
    <Modal
      width="80%"
      visible={Boolean(userWinnings.length)}
      onCancel={() => setUserWinnings([])}
    >
      <Table columns={columns} rowKey="id" dataSource={userWinnings} />
    </Modal>
  );
};

UserWinnings.propTypes = propTypes;

export default UserWinnings;
