import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Table, Switch } from 'antd';
import { Translate } from 'react-localize-redux';
import generateColumns from '../../services/generateColumns';
import iaxios from '../../axios';

const propTypes = {
  shows: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  setShows: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  fetching: PropTypes.bool.isRequired,
};

const ShowTable = ({
  shows, setShows, openModal, fetching,
}) => {
  const { componentConfig } = useSelector(({ general: { config } }) => config.entities.show);
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

  const removeShow = (id) => {
    iaxios()
      .delete(`/shows/${id}`)
      .then((res) => {
        if (res !== 'error') {
          const index = shows.findIndex(s => s.id === res.data.id);
          const newShows = [...shows];
          newShows.splice(index, 1);
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
    {
      type: 'remove',
      func: removeShow,
      confirm: <Translate id="showComponent.confirmRemove" />,
    },
  ];

  const columns = generateColumns(componentConfig, 'showComponent', actions);

  return (
    <div style={{ marginTop: '50px' }}>
      <Switch checked={showDisabled} onChange={v => setShowDisabled(v)} />
      <span style={{ marginLeft: 15 }}>
        <Translate id="showDisabled" />
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
