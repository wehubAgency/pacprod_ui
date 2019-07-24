import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Translate } from 'react-localize-redux';
import { Button } from 'antd';
import iaxios from '../axios';
import SessionForm from '../components/Session/SessionForm';
import SessionTable from '../components/Session/SessionTable';

const _SessionPage = ({
  general: {
    currentApp, currentEntity, currentSeason, config,
  },
}) => {
  const [sessions, setSessions] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [selectedSession, selectSession] = useState('');

  useEffect(() => {
    setFetching(true);
    const ax = iaxios();
    ax.get('/session').then((res) => {
      if (res !== 'error') {
        setSessions(res.data);
      }
      setFetching(false);
    });
    return () => ax.source.cancel();
  }, [currentApp, currentEntity, currentSeason]);

  const openModal = (mode, e) => {
    setModalVisible(true);
    setFormMode(mode);
    if (e && e.currentTarget.dataset.id) {
      selectSession(e.currentTarget.dataset.id);
    }
  };

  const formProps = {
    inModal: true,
    formMode,
    modalVisible,
    setModalVisible,
    sessions,
    setSessions,
    selectedSession,
  };

  const tableProps = {
    sessions,
    setSessions,
    config,
    openModal,
    fetching,
  };

  return (
    <div>
      <h1>
        <Translate id="sessionPage.h1" />
      </h1>
      <div className="instructions">
        <h4>
          <Translate id="instructions" />
        </h4>
        <Translate id="sessionPage.intro" />
      </div>
      <Button type="primary" icon="plus" onClick={() => openModal('create')}>
        <span>
          <Translate id="createSession" />
        </span>
      </Button>
      <SessionTable {...tableProps} />
      <SessionForm {...formProps} />
    </div>
  );
};

const mapStateToProps = ({ general }) => ({ general });

export const SessionPage = connect(
  mapStateToProps,
  {},
)(_SessionPage);
