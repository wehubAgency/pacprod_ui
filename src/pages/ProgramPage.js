import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Spin } from 'antd';
import { Translate } from 'react-localize-redux';
import ProgramTable from '../components/Program/ProgramTable';
import ProgramForm from '../components/Program/ProgramForm';
import iaxios from '../axios';

const propTypes = {
  general: PropTypes.shape({
    currentApp: PropTypes.shape().isRequired,
    currentEntity: PropTypes.shape().isRequired,
  }).isRequired,
};

const _ProgramPage = ({
  general: { currentApp, currentEntity, currentSeason },
}) => {
  const [programs, setPrograms] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [shows, setShows] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProgram, selectProgram] = useState('');
  const [formMode, setFormMode] = useState('create');

  useEffect(() => {
    setFetching(true);
    const ax = iaxios();
    const programReq = ax.get('/program');
    const showReq = ax.get('/show');
    Promise.all([programReq, showReq]).then(([programRes, showRes]) => {
      if (programRes !== 'error') {
        setPrograms(programRes.data);
      }
      if (showRes !== 'error') {
        setShows(showRes.data);
      }
      setFetching(false);
    });
    return () => {
      ax.source.cancel();
    };
  }, [currentApp, currentEntity, currentSeason]);

  const openModal = (mode) => {
    setModalVisible(true);
    setFormMode(mode);
  };

  const formProps = {
    inModal: true,
    formMode,
    modalVisible,
    setModalVisible,
    shows,
    programs,
    setPrograms,
    selectedProgram,
  };

  const tableProps = {
    programs,
    setPrograms,
    openModal,
    selectedProgram,
    selectProgram,
    fetching,
  };

  return (
    <div>
      <h1>
        <Translate id="programPage.h1" />
      </h1>
      <div className="instructions">
        <h4>
          <Translate id="instructions" />
        </h4>
        <Translate id="programPage.intro" />
      </div>
      <Button type="primary" icon="plus" onClick={() => openModal('create')}>
        <span>
          <Translate id="createProgram" />
        </span>
      </Button>
      <div style={{ marginTop: 50 }}>
        {fetching ? <Spin /> : <ProgramTable {...tableProps} />}
      </div>
      <ProgramForm {...formProps} />
    </div>
  );
};

_ProgramPage.propTypes = propTypes;

const mapStateToProps = ({ general }) => ({ general });

export const ProgramPage = connect(
  mapStateToProps,
  {},
)(_ProgramPage);
