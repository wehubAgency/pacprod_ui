import React, { useState, useEffect } from 'react';
import { Button, Row, Col } from 'antd';
import { Translate } from 'react-localize-redux';
import QrcodeList from './QrcodeList';
import QrcodeInfos from './QrcodeInfos';
import QrcodeForm from './QrcodeForm';
import { useFetchData } from '../../hooks';

const QrcodeManager = () => {
  const [qrcodes, setQrcodes] = useState([]);
  const [selectedQrcode, selectQrcode] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [formMode, setFormMode] = useState('create');

  const { data, fetching } = useFetchData('/qrcodes');

  useEffect(() => {
    setQrcodes(data);
    if (data.findIndex(d => d.id === selectedQrcode) === -1) {
      selectQrcode('');
    }
  }, [data]);

  const openModal = (mode = 'create') => {
    setFormMode(mode);
    setModalVisible(true);
  };

  const formProps = {
    inModal: true,
    formMode,
    modalVisible,
    setModalVisible,
    qrcodes,
    setQrcodes,
    selectQrcode,
    selectedQrcode,
  };

  return (
    <div>
      <Button type="primary" icon="plus" onClick={() => openModal()}>
        <span>
          <Translate id="createQrcode" />
        </span>{' '}
      </Button>
      <Row style={{ marginTop: 50 }} gutter={24}>
        <Col xl={{ span: 6 }}>
          <QrcodeList
            qrcodes={qrcodes}
            selectQrcode={selectQrcode}
            selectedQrcode={selectedQrcode}
            fetching={fetching}
          />
        </Col>
        <Col xl={{ span: 18 }}>
          {selectedQrcode && (
            <QrcodeInfos
              qrcode={qrcodes.find(q => q.id === selectedQrcode)}
              qrcodes={qrcodes}
              setQrcodes={setQrcodes}
              selectQrcode={selectQrcode}
              openModal={openModal}
            />
          )}
        </Col>
      </Row>
      <QrcodeForm {...formProps} />
    </div>
  );
};

export default QrcodeManager;
