import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';
import { Translate } from 'react-localize-redux';
import generateColumns from '../../services/generateColumns';
import iaxios from '../../axios';

const propTypes = {
  locations: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  setLocations: PropTypes.func.isRequired,
  componentConfig: PropTypes.shape().isRequired,
  openModal: PropTypes.func.isRequired,
  fetching: PropTypes.bool.isRequired,
};

const LocationTable = ({
  locations, setLocations, componentConfig, openModal, fetching,
}) => {
  const removeArtist = (id) => {
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
      type: 'remove',
      func: removeArtist,
      confirm: <Translate id="locationComponent.confirmRemove" />,
    },
  ];

  const columns = generateColumns(componentConfig, 'locationComponent', actions);

  return (
    <div style={{ marginTop: '50px' }}>
      <Table dataSource={locations} columns={columns} rowKey="id" loading={fetching} />
    </div>
  );
};

LocationTable.propTypes = propTypes;

export default LocationTable;
