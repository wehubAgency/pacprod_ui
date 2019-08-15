import React, { useState, useEffect } from 'react';
import { Translate } from 'react-localize-redux';
import { Button } from 'antd';
import LocationTable from './LocationTable';
import LocationForm from './LocationForm';
import { useFetchData } from '../../hooks';

const LocationManager = () => {
  const [formMode, setFormMode] = useState('create');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLocation, selectLocation] = useState('');
  const [locations, setLocations] = useState([]);

  const { data, fetching } = useFetchData('/locations');

  useEffect(() => {
    setLocations(data);
  }, [data]);

  const openModal = (mode = 'create', e) => {
    setModalVisible(true);
    setFormMode(mode);
    if (e && e.currentTarget.dataset.id) {
      selectLocation(e.currentTarget.dataset.id);
    }
  };

  const formProps = {
    inModal: true,
    formMode,
    modalVisible,
    setModalVisible,
    locations,
    setLocations,
    selectedLocation,
  };

  const tableProps = {
    locations,
    setLocations,
    openModal,
    fetching,
  };

  return (
    <div>
      <Button type="primary" icon="plus" onClick={() => openModal()}>
        <span>
          <Translate id="createLocation" />
        </span>
      </Button>
      <LocationTable {...tableProps} />
      <LocationForm {...formProps} />
    </div>
  );
};

export default LocationManager;
