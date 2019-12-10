import React, { useState, useEffect } from 'react';
import { Modal, Button, Table } from 'antd';
import { useSelector } from 'react-redux';
import { Translate } from 'react-localize-redux';
import { useFetchData } from '../../hooks';
import generateColumns from '../../services/generateColumns';

const QrcodeWinnings = ({ qrcode }) => {
  const [winnings, setWinnings] = useState([]);
  const [visible, setVisible] = useState(false);

  const { componentConfig } = useSelector(
    ({ general: { config } }) => config.entities.winning,
  );

  const { data, fetching } = useFetchData(`/qrcodes/${qrcode.id}/winnings`);

  useEffect(() => {
    setWinnings(data);
  }, [data]);

  const columns = generateColumns(componentConfig, 'winningComponent');

  return (
    <div>
      <Button type="primary" onClick={() => setVisible(true)}>
        <Translate id="qrcodeWinnings.showWinnings" />
      </Button>
      <Modal visible={visible} width="80%">
        <Table
          dataSource={winnings}
          columns={columns}
          rowKey="id"
          loading={fetching}
        />
      </Modal>
    </div>
  );
};

export default QrcodeWinnings;
