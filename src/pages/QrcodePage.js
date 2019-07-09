import React, { useState, useEffect } from 'react';
import { Button, Row, Col } from 'antd';
import { Translate } from 'react-localize-redux';
import { connect } from 'react-redux';
import QrcodeList from '../components/QRCode/QrcodeList';
import QrcodeInfos from '../components/QRCode/QrcodeInfos';
import QrcodeForm from '../components/QRCode/QrcodeForm';
import iaxios from '../axios';

const _QrcodePage = ({
  general: { currentApp, currentEntity, currentSeason },
}) => {
  const [qrcodes, setQrcodes] = useState([]);
  const [selectedQrcode, selectQrcode] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    setFetching(true);
    const ax = iaxios();
    ax.get('/qrcode').then((res) => {
      if (res !== 'error') {
        setQrcodes(res.data);
      }
      setFetching(false);
    });
    return () => ax.source.cancel();
  }, [currentApp, currentEntity, currentSeason]);

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
      <h1>
        <Translate id="qrcodePage.h1" />
      </h1>
      <div className="instructions">
        <h4>
          <Translate id="instructions" />
        </h4>
        <Translate id="qrcodePage.instructions" />
      </div>
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
              qrcode={qrcodes.find((q) => q.id === selectedQrcode)}
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

const mapStateToProps = ({ general }) => ({ general });

export const QrcodePage = connect(
  mapStateToProps,
  {},
)(_QrcodePage);
