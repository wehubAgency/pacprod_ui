import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'antd';
import { Translate } from 'react-localize-redux';
import Map from '../Map';

const propTypes = {
  infos: PropTypes.shape({
    coordinates: PropTypes.arrayOf(PropTypes.number).isRequired,
  }).isRequired,
};

const MapCell = (props) => {
  const [visible, setVisible] = useState(false);

  const displayMap = () => {
    setVisible(true);
  };

  const onCancel = () => {
    setVisible(false);
  };

  const [lng, lat] = props.infos.coordinates;

  return (
    <div>
      <Button type="default" onClick={displayMap}>
        <Translate id="mapCell.button" />
      </Button>
      <Modal
        visible={visible}
        footer={null}
        maskClosable
        destroyOnClose
        onCancel={onCancel}
      >
        <Map markers={[{ lat, lng }]} zoom={15} center={{ lat, lng }} />
      </Modal>
    </div>
  );
};

MapCell.propTypes = propTypes;

export { MapCell };
