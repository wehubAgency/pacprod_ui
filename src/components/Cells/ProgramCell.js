import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, List, Avatar } from 'antd';
import { Translate } from 'react-localize-redux';

const propTypes = {
  infos: PropTypes.shape({
    shows: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

const ProgramCell = ({ infos: { shows }, infos }) => {
  const [visible, setVisible] = useState(false);

  const displayProgram = () => {
    setVisible(true);
  };

  const onCancel = () => {
    setVisible(false);
  };

  const renderShows = (show) => (
    <List.Item>
      <List.Item.Meta
        avatar={<Avatar src={show.image} />}
        title={show.name}
        description={show.description}
      />
    </List.Item>
  );

  return (
    <div>
      <Button type="default" onClick={displayProgram}>
        <Translate id="programCell.button" />
      </Button>
      <Modal
        visible={visible}
        footer={null}
        maskClosable
        destroyOnClose
        onCancel={onCancel}
      >
        <List dataSource={shows} renderItem={renderShows} />
      </Modal>
    </div>
  );
};

ProgramCell.propTypes = propTypes;

export { ProgramCell };
