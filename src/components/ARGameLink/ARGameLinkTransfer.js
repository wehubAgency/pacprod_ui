import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Modal, Spin, Transfer, Button, Typography,
} from 'antd';
import iaxios from '../../axios';
import PrizeManager from '../Prize/PrizeManager';

const propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  playpoint: PropTypes.shape(),
  playpoints: PropTypes.arrayOf(PropTypes.object).isRequired,
  setPlaypoints: PropTypes.func.isRequired,
};

const defaultProps = {
  playpoint: null,
};

const ARGameLinkTransfer = ({
  visible, setVisible, playpoint, playpoints, setPlaypoints,
}) => {
  const [gamelinks, setGamelinks] = useState([]);
  const [selectedGamelink, selectGamelink] = useState('');
  const [targetKeys, setTargetKeys] = useState([]);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (playpoint) {
      setFetching(true);
      const ax = iaxios();
      ax.get('/argamelinks').then((res) => {
        if (res !== 'error') {
          setGamelinks(res.data);
        }
        setFetching(false);
      });
      setTargetKeys(playpoint.arGameLinks.map(q => q.id));
      return () => ax.source.cancel();
    }
    return () => {};
  }, [playpoint]);

  const closeManager = () => {
    setVisible(false);
  };

  const patchPlaypoint = () => {
    iaxios()
      .patch(`/playpoints/${playpoint.id}/argamelinks`, {
        argamelinks: targetKeys,
      })
      .then((res) => {
        if (res !== 'error') {
          const index = playpoints.findIndex(p => p.id === res.data.id);
          const newPlaypoints = [...playpoints];
          newPlaypoints.splice(index, 1, res.data);
          setPlaypoints(newPlaypoints);
          closeManager();
        }
      });
  };

  const showPrizes = (id, e) => {
    e.stopPropagation();
    selectGamelink(id);
  };

  if (!playpoint) {
    return null;
  }
  return (
    <Modal
      visible={visible}
      onCancel={() => closeManager()}
      onOk={() => patchPlaypoint()}
      width="750px"
    >
      {fetching ? (
        <Spin />
      ) : (
        <div>
          <Transfer
            dataSource={gamelinks.map(q => ({ ...q, key: q.id }))}
            showSearch
            targetKeys={targetKeys}
            filterOption={(inputValue, option) => option.description.indexOf(inputValue) > -1}
            onChange={newTargetKeys => setTargetKeys(newTargetKeys)}
            render={item => (
              <span className="qrcode-item">
                <span style={{ marginRight: 15 }}>{item.target.name}</span>
                <Button
                  shape="circle"
                  type="dashed"
                  icon="gift"
                  onClick={e => showPrizes(item.id, e)}
                />
              </span>
            )}
          />
          {selectedGamelink && (
            <div style={{ marginTop: 25 }}>
              <Typography.Title level={4} style={{ textAlign: 'center' }}>
                {gamelinks.find(g => g.id === selectedGamelink).name}
              </Typography.Title>
              <PrizeManager
                prizesOwner={gamelinks.find(g => g.id === selectedGamelink)}
                className="arGameLink"
                entityName="prize"
              />
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};

ARGameLinkTransfer.propTypes = propTypes;
ARGameLinkTransfer.defaultProps = defaultProps;

export default ARGameLinkTransfer;
