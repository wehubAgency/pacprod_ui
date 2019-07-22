import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import { Translate } from 'react-localize-redux';

const VideoCell = ({ infos }) => {
  const [visible, setVisible] = useState(false);
  const [src, setSrc] = useState(infos.length > 0 ? 0 : null);

  const openModal = () => {
    setVisible(true);
  };

  const onCancel = () => {
    setVisible(false);
  };

  const nextVideo = () => {
    if (src !== null) {
      if (src + 1 > infos.length) {
        setSrc(0);
      } else {
        setSrc(src + 1);
      }
    }
  };

  const previousVideo = () => {
    if (src !== null) {
      if (src - 1 < 0) {
        setSrc(infos.length);
      } else {
        setSrc(src - 1);
      }
    }
  };

  const buttonStyle = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
  };

  return (
    <div>
      <Button type="default" onClick={openModal}>
        <Translate id="mapCell.openVideo" />
      </Button>
      <Modal
        visible={visible}
        footer={null}
        maskClosable
        destroyOnClose
        onCancel={onCancel}
        width={700}
      >
        {src === null ? (
          <Translate id="mapCell.noVideo" />
        ) : (
          <div>
            <video
              style={{ margin: '50px auto', width: '80%', display: 'block' }}
              src={infos[src]}
              controls
            />
            <Button
              style={{ ...buttonStyle, right: 25 }}
              type="link"
              icon="right"
              onClick={nextVideo}
            />
            <Button
              style={{ ...buttonStyle, left: 25 }}
              type="link"
              icon="left"
              onClick={previousVideo}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export { VideoCell };
