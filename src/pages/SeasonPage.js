import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Translate } from 'react-localize-redux';
import { Button } from 'antd';
import SeasonTable from '../components/Season/SeasonTable';
import SeasonForm from '../components/Season/SeasonForm';
import iaxios from '../axios';

const propTypes = {
  general: PropTypes.shape({
    currentApp: PropTypes.shape().isRequired,
    currentEntity: PropTypes.shape().isRequired,
    config: PropTypes.shape().isRequired,
  }).isRequired,
};

const _SeasonPage = ({ general: { currentEntity, currentApp, config } }) => {
  const [seasons, setSeasons] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [selectedSeason, selectSeason] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [formMode, setFormMode] = useState('create');

  useEffect(() => {
    setFetching(true);
    const ax = iaxios();
    ax.get(`season?circus=${currentEntity.id}`).then((res) => {
      if (res !== 'error') {
        setSeasons(res.data);
      }
      setFetching(false);
    });
    return () => ax.source.cancel();
  }, [currentApp, currentEntity]);

  const openModal = (mode, e) => {
    setModalVisible(true);
    setFormMode(mode);
    if (e && e.currentTarget.dataset.id) {
      selectSeason(e.currentTarget.dataset.id);
    }
  };

  const formProps = {
    formMode,
    modalVisible,
    setModalVisible,
    inModal: true,
    seasons,
    setSeasons,
    selectedSeason,
  };

  const tableProps = {
    openModal,
    seasons,
    setSeasons,
    selectedSeason,
    selectSeason,
    config,
    fetching,
  };

  return (
    <div>
      <h1>
        <Translate id="seasonPage.h1" />
      </h1>
      <div className="instructions">
        <h4>
          <Translate id="instructions" />
        </h4>
        <Translate id="seasonPage.intro" />
      </div>
      <Button type="primary" icon="plus" onClick={() => openModal('create')}>
        <span>
          <Translate id="createSeason" />
        </span>
      </Button>
      <SeasonTable {...tableProps} />
      <SeasonForm {...formProps} />
    </div>
  );
};

_SeasonPage.propTypes = propTypes;

const mapStateToProps = ({ general }) => ({ general });

export const SeasonPage = connect(
  mapStateToProps,
  {},
)(_SeasonPage);
