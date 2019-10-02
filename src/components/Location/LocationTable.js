import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Table, Switch } from 'antd';
import { Translate } from 'react-localize-redux';
import generateColumns from '../../services/generateColumns';
import iaxios from '../../axios';

const propTypes = {
  locations: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  setLocations: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  fetching: PropTypes.bool.isRequired,
};

const LocationTable = ({
  locations, setLocations, openModal, fetching,
}) => {
  const { componentConfig } = useSelector(({ general: { config } }) => config.entities.location);
  const [showDisabled, setShowDisabled] = useState(false);

  const toggleLocation = (id) => {
    const location = locations.find(l => l.id === id);
    iaxios()
      .patch(`/locations/${id}/enabled`, { enabled: !location.enabled })
      .then((res) => {
        if (res !== 'error') {
          const index = locations.findIndex(l => l.id === res.data.id);
          const newLocations = [...locations];
          newLocations.splice(index, 1, res.data);
          setLocations(newLocations);
        }
      });
  };

  const removeLocation = (id) => {
    iaxios()
      .delete(`/locations/${id}`)
      .then((res) => {
        if (res !== 'error') {
          const locationIndex = locations.findIndex(l => l.id === res.data.id);
          const newLocations = [...locations];
          newLocations.splice(locationIndex, 1);
          setLocations(newLocations);
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
      func: toggleLocation,
    },
    {
      type: 'remove',
      func: removeLocation,
      confirm: <Translate id="locationComponent.confirmRemove" />,
    },
  ];

  const columns = generateColumns(componentConfig, 'locationComponent', actions);

  return (
    <div style={{ marginTop: '50px' }}>
      <Switch checked={showDisabled} onChange={v => setShowDisabled(v)} />
      <span style={{ marginLeft: 15 }}>
        <Translate id="showDisabled" />
      </span>
      <Table
        dataSource={locations.filter(l => l.enabled === !showDisabled)}
        columns={columns}
        rowKey="id"
        loading={fetching}
      />
    </div>
  );
};

LocationTable.propTypes = propTypes;

export default LocationTable;
