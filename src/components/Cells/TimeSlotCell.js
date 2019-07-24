import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'antd';
import { Translate } from 'react-localize-redux';
import TargetTime from '../TargetTime/TargetTime';

const propTypes = {
  infos: PropTypes.shape().isRequired,
};

const TimeSlotCell = ({ infos }) => {
  const [visible, setVisible] = useState(false);

  const onCancel = () => {
    setVisible(false);
  };

  const displayTimeslot = () => {
    setVisible(true);
  };
  return (
    <div>
      <Button type="default" onClick={displayTimeslot}>
        <span>
          <Translate id="mapCell.showTimeSlot" />
        </span>
      </Button>
      <Modal
        visible={visible}
        footer={null}
        maskClosable
        destroyOnClose
        onCancel={onCancel}
        width={700}
      >
        <TargetTime week={infos} readonly />
      </Modal>
    </div>
  );
};

TimeSlotCell.propTypes = propTypes;

export { TimeSlotCell };
