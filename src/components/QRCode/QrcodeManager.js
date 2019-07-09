import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Spin, Transfer, Button, Typography } from 'antd';
import { Translate } from 'react-localize-redux';
import iaxios from '../../axios';
import PrizeManager from '../Prize/PrizeManager';

const propTypes = {
  managerVisible: PropTypes.bool.isRequired,
  setManagerVisible: PropTypes.func.isRequired,
  playpoint: PropTypes.shape(),
};

const defaultProps = {
  playpoint: null,
};

const QrcodeManager = ({ managerVisible, setManagerVisible, playpoint }) => {
  const [qrcodes, setQrcodes] = useState([]);
  const [selectedQrcode, selectQrcode] = useState('');
  const [targetKeys, setTargetKeys] = useState([]);
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
    setTargetKeys(playpoint.qrcodes.map((q) => q.id));
    return () => ax.source.cancel();
  }, [playpoint]);

  const closeManager = () => {
    setManagerVisible(false);
  };

  const patchPlaypoint = () => {
    iaxios()
      .patch(`/playpoints/${playpoint.id}/qrcodes`, {
        qrcodes: targetKeys,
      })
      .then((res) => {
        if (res !== 'error') {
          closeManager();
        }
      });
  };

  const showPrizes = (id, e) => {
    e.stopPropagation();
    selectQrcode(id);
  };

  if (!playpoint) {
    return null;
  }
  return (
    <Modal
      title={<Translate id="qrcodeManager.title" />}
      visible={managerVisible}
      onCancel={() => closeManager()}
      onOk={() => patchPlaypoint()}
      width="600px"
    >
      {fetching ? (
        <Spin />
      ) : (
        <div>
          <Transfer
            dataSource={qrcodes.map((q) => ({ ...q, key: q.id }))}
            showSearch
            targetKeys={targetKeys}
            filterOption={(inputValue, option) =>
              option.description.indexOf(inputValue) > -1
            }
            onChange={(newTargetKeys) => setTargetKeys(newTargetKeys)}
            render={(item) => (
              <span className="qrcode-item">
                <span style={{ marginRight: 15 }}>{item.name}</span>
                <Button
                  shape="circle"
                  type="dashed"
                  icon="gift"
                  onClick={(e) => showPrizes(item.id, e)}
                />
              </span>
            )}
          />
          {selectedQrcode && (
            <div style={{ marginTop: 25 }}>
              <Typography.Title level={4} style={{ textAlign: 'center' }}>
                {qrcodes.find((q) => q.id === selectedQrcode).name}
              </Typography.Title>
              <PrizeManager
                qrcode={qrcodes.find((q) => q.id === selectedQrcode)}
              />
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};

QrcodeManager.propTypes = propTypes;
QrcodeManager.defaultProps = defaultProps;

export default QrcodeManager;
