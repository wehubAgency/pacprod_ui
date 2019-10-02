import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Table, Switch } from 'antd';
import { Translate } from 'react-localize-redux';
import generateColumn from '../../services/generateColumns';
import iaxios from '../../axios';

const propTypes = {
  sessions: PropTypes.arrayOf(PropTypes.object).isRequired,
  setSessions: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  fetching: PropTypes.bool.isRequired,
};

const SessionTable = ({
  sessions, setSessions, openModal, fetching,
}) => {
  const [showDisabled, setShowDisabled] = useState(false);
  const { componentConfig } = useSelector(({ general: { config } }) => config.entities.session);

  const toggleSession = (id) => {
    const session = sessions.find(s => s.id === id);
    iaxios()
      .patch(`sessions/${session.id}/enabled`, { enabled: !session.enabled })
      .then((res) => {
        if (res !== 'error') {
          const sessionIndex = sessions.findIndex(s => s.id === res.data.id);
          const newSessions = [...sessions];
          newSessions.splice(sessionIndex, 1, res.data);
          setSessions(newSessions);
        }
      });
  };

  const deleteSession = (id) => {
    iaxios()
      .delete(`/sessions/${id}`)
      .then((res) => {
        if (res !== 'error') {
          const index = sessions.findIndex(s => s.id === res.data.id);
          const newSessions = [...sessions];
          newSessions.splice(index, 1);
          setSessions(newSessions);
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
      type: 'disable',
      func: toggleSession,
    },
    {
      type: 'remove',
      func: deleteSession,
      confirm: <Translate id="sessionComponent.confirmRemove" />,
    },
  ];

  const columns = generateColumn(componentConfig, 'sessionComponent', actions);

  return (
    <div style={{ marginTop: '50px' }}>
      <Switch checked={showDisabled} onChange={v => setShowDisabled(v)} />
      <span style={{ marginLeft: 15 }}>
        <Translate id="showDisabled" />
      </span>
      <Table
        dataSource={sessions.filter(s => s.enabled === !showDisabled)}
        columns={columns}
        rowKey="id"
        loading={fetching}
      />
    </div>
  );
};

SessionTable.propTypes = propTypes;

export default SessionTable;
