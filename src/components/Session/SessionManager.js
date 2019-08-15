import React, { useState, useEffect } from 'react';
import { Translate } from 'react-localize-redux';
import { Button, Spin } from 'antd';
import SessionForm from './SessionForm';
import SessionTable from './SessionTable';
import { useFetchData } from '../../hooks';

const SessionManager = () => {
  const [sessions, setSessions] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [selectedSession, selectSession] = useState('');

  const { data, fetching } = useFetchData('/sessions');

  useEffect(() => {
    setSessions(data);
  }, [data]);

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
    openModal,
    fetching,
  };

  return (
    <div>
      {fetching ? (
        <Spin />
      ) : (
        <div>
          <Button type="primary" icon="plus" onClick={() => openModal('create')}>
            <span>
              <Translate id="createSession" />
            </span>
          </Button>
          <SessionTable {...tableProps} />
          <SessionForm {...formProps} />
        </div>
      )}
    </div>
  );
};

export default SessionManager;
