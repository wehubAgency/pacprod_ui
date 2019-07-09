import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Table } from 'antd';
import generateColumns from '../../services/generateColumns';

const propTypes = {
  qrcodes: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  selectQrcode: PropTypes.func.isRequired,
  general: PropTypes.shape({
    config: PropTypes.shape().isRequired,
  }).isRequired,
};

const QrcodeTable = ({ qrcodes, selectQrcode, general: { config } }) => {
  const { componentConfig } = config.entities.qrcode;

  const chooseQrcode = (e) => {
    selectQrcode(e.currentTarget.dataset.id);
  };

  const actions = [
    {
      type: 'edit',
      func: (e) => {
        chooseQrcode(e);
      },
    },
  ];

  const columns = generateColumns(componentConfig, 'qrcodeComponent', actions);
  return (
    <div>
      <Table dataSource={qrcodes} columns={columns} rowKey="id" pagination={{ pageSize: 3 }} />
    </div>
  );
};

QrcodeTable.propTypes = propTypes;

const mapStateToProps = ({ general }) => ({ general });

export default connect(
  mapStateToProps,
  {},
)(QrcodeTable);
