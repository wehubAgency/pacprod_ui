import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Translate } from 'react-localize-redux';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import ShowTable from '../components/Show/ShowTable';
import ShowForm from '../components/Show/ShowForm';
import iaxios from '../axios';

const propTypes = {
  general: PropTypes.shape({
    config: PropTypes.shape().isRequired,
  }).isRequired,
};

const _ShowPage = ({
  general: {
    config, currentApp, currentEntity, currentSeason,
  },
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [selectedShow, setSelectedShow] = useState('');
  const [shows, setShows] = useState([]);
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    setFetching(true);
    const ax = iaxios();
    const getShows = ax.get('/shows');
    const getArtists = ax.get('/artists');
    Promise.all([getShows, getArtists]).then(([showsRes, artistsRes]) => {
      if (showsRes !== 'error') {
        setShows(showsRes.data);
      }
      if (artistsRes !== 'error') {
        setArtists(artistsRes.data);
      }
      setFetching(false);
    });
    return () => {
      ax.source.cancel();
    };
  }, [currentApp, currentEntity, currentSeason]);

  const openModal = (mode, e = null) => {
    setModalVisible(true);
    setFormMode(mode);
    if (e && e.currentTarget.dataset.id) {
      setSelectedShow(e.currentTarget.dataset.id);
    }
  };

  const tableProps = {
    openModal,
    shows,
    setShows,
    selectedShow,
    setSelectedShow,
    config,
    fetching,
  };

  const formProps = {
    inModal: true,
    formMode,
    modalVisible,
    setModalVisible,
    shows,
    setShows,
    artists,
    selectedShow,
  };

  return (
    <div>
      <h1>
        <Translate id="showPage.h1" />
      </h1>
      <div className="instructions">
        <h4>
          <Translate id="instructions" />
        </h4>
        <Translate id="showPage.intro" />
        <Link to="/artists" style={{ marginLeft: '15px' }}>
          <Translate id="createArtist" />
        </Link>
      </div>
      <Button type="primary" icon="plus" onClick={() => openModal('create')}>
        <span>
          <Translate id="createShow" />
        </span>
      </Button>
      <ShowTable {...tableProps} />
      <ShowForm {...formProps} />
    </div>
  );
};

_ShowPage.propTypes = propTypes;

const mapStateToProps = ({ general }) => ({ general });

export const ShowPage = connect(
  mapStateToProps,
  {},
)(_ShowPage);
