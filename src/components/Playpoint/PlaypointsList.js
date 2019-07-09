import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Empty, Card, Icon, Popconfirm } from 'antd';
import { Translate } from 'react-localize-redux';
import PlaypointInfos from './PlaypointInfos';
import QrcodeManager from '../QRCode/QrcodeManager';
import iaxios from '../../axios';

const propTypes = {
  playpoints: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  openModal: PropTypes.func.isRequired,
  selectPlaypoint: PropTypes.func.isRequired,
  setPlaypoints: PropTypes.func.isRequired,
  selectedPlaypoint: PropTypes.string.isRequired,
  selectedCompany: PropTypes.string.isRequired,
};

const PlaypointsList = ({
  playpoints,
  setPlaypoints,
  openModal,
  selectPlaypoint,
  selectedPlaypoint,
  selectedCompany,
}) => {
  const [managerVisible, setManagerVisible] = useState(false);

  const editPlaypoint = (id) => {
    selectPlaypoint(id);
    openModal('edit');
  };

  const togglePlaypoint = (id) => {
    iaxios()
      .patch(`/playpoints/${id}/enabled`, {
        enabled: !playpoints.find((p) => p.id === id).enabled,
      })
      .then((res) => {
        if (res !== 'error') {
          const playpointIndex = playpoints.findIndex((p) => p.id === id);
          const newPlaypoints = [...playpoints];
          newPlaypoints.splice(playpointIndex, 1, res.data);
          setPlaypoints(newPlaypoints);
        }
      });
  };

  const deletePlaypoint = (id) => {
    iaxios()
      .delete(`/playpoints/${id}`, { params: { company: selectedCompany } })
      .then((res) => {
        if (res !== 'error') {
          const playpointIndex = playpoints.findIndex((p) => p.id === id);
          const newPlaypoints = [...playpoints];
          newPlaypoints.splice(playpointIndex, 1);
          setPlaypoints(newPlaypoints);
        }
      });
  };

  const openQrcodeManager = (id) => {
    setManagerVisible(true);
    selectPlaypoint(id);
  };

  const renderPlaypoints = () =>
    playpoints.map((p) => (
      <Card
        key={p.id}
        style={{
          width: 300,
          margin: '5px',
        }}
        cover={<img src={p.logo} alt={p.name} />}
        actions={[
          <Icon type="edit" onClick={() => editPlaypoint(p.id)} />,
          <Icon type="stop" onClick={() => togglePlaypoint(p.id)} />,
          <Popconfirm
            title={<Translate id="playpointsList.confirmDelete" />}
            onConfirm={() => deletePlaypoint(p.id)}
            okText={<Translate id="yes" />}
            cancelText={<Translate id="no" />}
          >
            <Icon type="delete" />
          </Popconfirm>,
          <Icon type="qrcode" onClick={() => openQrcodeManager(p.id)} />,
        ]}
      >
        <Meta title={p.name} description={<PlaypointInfos playpoint={p} />} />
        {!p.enabled && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 48,
              left: 0,
              backgroundColor: 'rgba(0,0,0,0.6)',
            }}
          >
            <span
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                color: 'white',
                fontSize: '2rem',
              }}
            >
              <Translate id="disabled" />
            </span>
          </div>
        )}
      </Card>
    ));

  const { Meta } = Card;

  const managerProps = {
    playpoint: playpoints.find((p) => p.id === selectedPlaypoint),
    managerVisible,
    setManagerVisible,
  };

  if (playpoints.length === 0) {
    return <Empty />;
  }
  return (
    <div style={{ display: 'flex', padding: '5px' }}>
      {renderPlaypoints()}
      <QrcodeManager {...managerProps} />
    </div>
  );
};

PlaypointsList.propTypes = propTypes;

export default PlaypointsList;
