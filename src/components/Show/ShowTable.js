import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Table, Switch } from 'antd';
import { Translate } from 'react-localize-redux';
import generateColumns from '../../services/generateColumns';
import iaxios from '../../axios';

const propTypes = {
  shows: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  setShows: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  config: PropTypes.shape().isRequired,
  fetching: PropTypes.bool.isRequired,
};

const ShowTable = ({
  shows, setShows, openModal, config, fetching,
}) => {
  const { componentConfig } = config.entities.show;
  const [showDisabled, setShowDisabled] = useState(false);

  const toggleShow = (id) => {
    const show = shows.find(a => a.id === id);
    iaxios()
      .patch(`/shows/${show.id}/enabled`, { enabled: !show.enabled })
      .then((res) => {
        if (res !== 'error') {
          const showIndex = shows.findIndex(s => s.id === res.data.id);
          const newShows = [...shows];
          newShows.splice(showIndex, 1, res.data);
          setShows(newShows);
        }
      });
  };

  const actions = [
    {
      type: 'edit',
      func: (e) => {
        openModal('edit', e);
      },
    },
    {
      type: 'disable',
      func: toggleShow,
    },
  ];

  const columns = generateColumns(componentConfig, 'showComponent', actions);

  return (
    <div style={{ marginTop: '50px' }}>
      <Switch checked={showDisabled} onChange={v => setShowDisabled(v)} />
      <span style={{ marginLeft: 15 }}>
        <Translate id="showTable.showDisabled" />
      </span>
      <Table
        dataSource={shows.filter(s => s.enabled === !showDisabled)}
        columns={columns}
        rowKey="id"
        loading={fetching}
      />
    </div>
  );
};

ShowTable.propTypes = propTypes;

export default ShowTable;
