import React from 'react';
import { Translate } from 'react-localize-redux';
import Form from '../Form';

const LocationForm = ({
  locations, setLocations, selectedLocation, ...props
}) => {
  const edit = () => {
    const location = locations.find(l => l.id === selectedLocation);
    const { coordinates } = location.location;
    return {
      ...location, lng: coordinates[0], lat: coordinates[1], ...location.address,
    };
  };

  const formProps = {
    ...props,
    data: locations,
    setData: setLocations,
    selectedData: selectedLocation,
    createUrl: '/locations',
    updateUrl: `/locations/${selectedLocation}`,
    customEdit: edit,
    entityName: 'location',
    formName: 'locationForm',
    modalTitle:
      props.formMode === 'create' ? (
        <Translate id="createLocation" />
      ) : (
        <Translate id="editLocation" />
      ),
    createText: <Translate id="createLocation" />,
  };

  return <Form {...formProps} />;
};

export default LocationForm;
