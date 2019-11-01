import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'antd';
import { Translate } from 'react-localize-redux';
import PrizeManager from '../Prize/PrizeManager';

const propTypes = {
  infos: PropTypes.object.isRequired,
};

const ARGamePrizesCell = ({ infos }) => {
  const [visible, setVisible] = useState(false);

  const openModal = () => {
    setVisible(true);
  };

  const onCancel = () => {
    setVisible(false);
  };

  return (
    <div>
      <Button type="default" onClick={openModal}>
        <Translate id="mapCell.openPrizeManager" />
      </Button>
      <Modal width={800} visible={visible} footer={null} maskClosable onCancel={onCancel}>
        <PrizeManager prizesOwner={infos} className="arGameLink" entityName="prize" />
      </Modal>
    </div>
  );
};

ARGamePrizesCell.propTypes = propTypes;

export { ARGamePrizesCell };
