import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import { Translate } from 'react-localize-redux';
import TargetTime from '../TargetTime/TargetTime';

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

export { TimeSlotCell };
