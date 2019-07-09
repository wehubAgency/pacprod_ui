import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Translate } from 'react-localize-redux';
import { Button } from 'antd';
import ArtistTable from '../components/Artist/ArtistTable';
import ArtistForm from '../components/Artist/ArtistForm';
import iaxios from '../axios';

const propTypes = {
  general: PropTypes.shape({
    currentApp: PropTypes.shape().isRequired,
    currentEntity: PropTypes.shape().isRequired,
    currentSeason: PropTypes.shape().isRequired,
    config: PropTypes.shape().isRequired,
  }).isRequired,
};

const _ArtistPage = ({
  general: { currentEntity, currentApp, currentSeason, config },
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [artists, setArtists] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState('');

  useEffect(() => {
    setFetching(true);
    const ax = iaxios();
    ax.get('/artist').then((res) => {
      if (res !== 'error') {
        setArtists(res.data);
      }
      setFetching(false);
    });
    return () => ax.source.cancel();
  }, [currentApp, currentEntity, currentSeason]);

  const openModal = (mode, e) => {
    setModalVisible(true);
    setFormMode(mode);
    if (e && e.currentTarget.dataset.id) {
      setSelectedArtist(e.currentTarget.dataset.id);
    }
  };

  const formProps = {
    inModal: true,
    formMode,
    modalVisible,
    setModalVisible,
    artists,
    setArtists,
    selectedArtist,
  };

  const tableProps = {
    openModal,
    artists,
    setArtists,
    config,
    fetching,
  };

  return (
    <div>
      <h1>
        <Translate id="artistPage.h1" />
      </h1>
      <div className="instructions">
        <h4>
          <Translate id="instructions" />
        </h4>
        <Translate id="artistPage.intro" />
      </div>
      <Button type="primary" icon="plus" onClick={() => openModal('create')}>
        <span>
          <Translate id="createArtist" />
        </span>
      </Button>
      <ArtistTable {...tableProps} />
      <ArtistForm {...formProps} />
    </div>
  );
};

_ArtistPage.propTypes = propTypes;

const mapStateToProps = ({ general }) => ({ general });

export const ArtistPage = connect(
  mapStateToProps,
  {},
)(_ArtistPage);
