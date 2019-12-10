import React, { useState, useEffect } from 'react';
import { Modal, Button, Table } from 'antd';
import { useSelector } from 'react-redux';
import { Translate, withLocalize } from 'react-localize-redux';
import { convertArrayToCSV } from 'convert-array-to-csv';
import { useFetchData } from '../../hooks';
import generateColumns from '../../services/generateColumns';

const QrcodeWinnings = ({ qrcode, translate }) => {
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
    const header = [
      translate('user'),
      translate('email'),
      translate('prize'),
      translate('date'),
      translate('used'),
    ];
    const csvData = winnings.map(w => [
      `${w.user.firstname} ${w.user.lastname}`,
      w.user.email,
      w.prize.model.name,
      w.createdAt,
      w.used ? translate('yes') : translate('no'),
    ]);

    const csv = convertArrayToCSV(csvData, {
      header,
      separator: ';',
    });

    const encodedUri = window.encodeURI(
      `data:text/csv;charset=utf-8,%EF%BB%BF,${csv}`,
    );
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${qrcode.name}.csv`);
    document.body.appendChild(link);
    link.click();
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
        {/* {winnings.length > 0 && ( */}
        <Button type="primary" onClick={downloadCsv}>
          <Translate id="qrcodeWinnings.downloadCsv" />
        </Button>
        {/* )} */}
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

export default withLocalize(QrcodeWinnings);
