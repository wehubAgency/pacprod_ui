import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import { Translate } from 'react-localize-redux';
import Carousel from 'react-images';

const GalleryCell = ({ infos }) => {
  const [visible, setVisible] = useState(false);

  const openGallery = () => {
    setVisible(true);
  };

  const onCancel = () => {
    setVisible(false);
  };

  return (
    <div>
      <Button type="default" onClick={openGallery}>
        <Translate id="mapCell.openGallery" />
      </Button>
      <Modal
        visible={visible}
        footer={null}
        maskClosable
        destroyOnClose
        onCancel={onCancel}
      >
        {infos.length > 0 ? (
          <Carousel
            views={infos.map((i) => ({
              src: i,
            }))}
          />
        ) : (
          <Translate id="mapCell.noImages" />
        )}
      </Modal>
    </div>
  );
};

export { GalleryCell };
