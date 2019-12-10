import React, { useState, useEffect } from 'react';
import { Modal, Button, Table } from 'antd';
import { useSelector } from 'react-redux';
import { Translate } from 'react-localize-redux';
import { convertArrayToCSV } from 'convert-array-to-csv';
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

  const downloadCsv = () => {
    const headers = [
      <Translate id="user" />,
      <Translate id="email" />,
      <Translate id="prize" />,
      <Translate id="date" />,
      <Translate id="used" />,
    ];
    const data = winnings.map(w => [
      `${w.user.firstname} ${w.user.lastname}`,
      w.user.email,
      w.prize.model.name,
      w.date,
      w.used ? <Translate id="yes" /> : <Translate id="no" />,
    ]);

    const csv = convertArrayToCSV(data, {
      headers,
      separator: ';',
    });

    console.log({ csv });
  };

  const columns = generateColumns(componentConfig, 'winningComponent');

  return (
    <div>
      <Button type="primary" onClick={() => setVisible(true)}>
        <Translate id="qrcodeWinnings.showWinnings" />
      </Button>
      <Modal
        visible={visible}
        width="80%"
        onCancel={() => setVisible(false)}
        onOk={() => setVisible(false)}
      >
        {winnings.length > 0 && (
          <Button type="primary" onClick={downloadCsv}>
            <Translate id="qrcodeWinnings.downloadCsv" />
          </Button>
        )}
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
