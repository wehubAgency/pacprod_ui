import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'antd';
import { Translate } from 'react-localize-redux';
import ARGameLinkRules from '../ARGameLink/ARGameLinkRules';

const propTypes = {
  infos: PropTypes.object.isRequired,
};

const ARGameRulesCell = ({ infos }) => {
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
        <Translate id="mapCell.openRulesManager" />
      </Button>
      <Modal width={800} visible={visible} footer={null} maskClosable onCancel={onCancel}>
        <ARGameLinkRules argameLink={infos} setVisible={setVisible} />
      </Modal>
    </div>
  );
};

ARGameRulesCell.propTypes = propTypes;

export { ARGameRulesCell };
