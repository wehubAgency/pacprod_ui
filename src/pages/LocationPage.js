import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Translate } from 'react-localize-redux';
import { Button } from 'antd';
import LocationTable from '../components/Location/LocationTable';
import LocationForm from '../components/Location/LocationForm';
import iaxios from '../axios';

const propTypes = {
  general: PropTypes.shape({
    config: PropTypes.shape().isRequired,
  }).isRequired,
};

const _LocationPage = ({
  general: { config, currentApp, currentEntity, currentSeason },
}) => {
  const [formMode, setFormMode] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLocation, selectLocation] = useState('');
  const [locations, setLocations] = useState([]);

  const { componentConfig } = config.entities.location;

  useEffect(() => {
    setFetching(true);
    const ax = iaxios();
    ax.get('/location').then((res) => {
      if (res !== 'error') {
        setLocations(res.data);
      }
      setFetching(false);
    });
    return () => ax.source.cancel();
  }, [currentApp, currentEntity, currentSeason]);

  const openModal = (mode, e) => {
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
    componentConfig,
    openModal,
    fetching,
  };

  return (
    <div>
      <h1>
        <Translate id="locationPage.h1" />
      </h1>
      <div className="instructions">
        <h4>
          <Translate id="instructions" />
        </h4>
        <Translate id="locationPage.intro" />
      </div>
      <Button type="primary" icon="plus" onClick={() => openModal('create')}>
        <span>
          <Translate id="createLocation" />
        </span>
      </Button>
      <LocationTable {...tableProps} />
      <LocationForm {...formProps} />
    </div>
  );
};

_LocationPage.propTypes = propTypes;

const mapStateToProps = ({ general }) => ({ general });

export const LocationPage = connect(
  mapStateToProps,
  {},
)(_LocationPage);
