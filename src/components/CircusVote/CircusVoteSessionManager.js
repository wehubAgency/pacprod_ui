import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Transfer, Button, message } from 'antd';
import { withLocalize, Translate } from 'react-localize-redux';
import iaxios from '../../axios';
import { useFetchData } from '../../hooks';

const propTypes = {
  vote: PropTypes.shape().isRequired,
  setAllVotes: PropTypes.func.isRequired,
  allVotes: PropTypes.arrayOf(PropTypes.object).isRequired,
  translate: PropTypes.func.isRequired,
};

const CircusVoteSessionsManager = ({
  vote, allVotes, setAllVotes, translate,
}) => {
  const [sessions, setSessions] = useState([]);
  const [targetKeys, setTargetKeys] = useState([]);

  const { data } = useFetchData('/sessions');

  useEffect(() => {
    setSessions(data);
  }, [data]);

  useEffect(() => {
    setTargetKeys(vote.sessions.map(s => s.id));
  }, [vote]);

  const handleChange = (nextTargetKeys) => {
    setTargetKeys(nextTargetKeys);
  };

  const updateSessions = () => {
    iaxios()
      .patch(`/circusvotes/${vote.id}/sessions`, { sessions: targetKeys })
      .then((res) => {
        if (res !== 'error') {
          const index = allVotes.findIndex(v => v.id === res.data.id);
          const newVotes = [...allVotes];
          newVotes.splice(index, 1, res.data);
          setAllVotes(newVotes);
          message.success(translate('success'));
        }
      });
  };

  return (
    <div>
      <Transfer
        dataSource={sessions.map(s => ({ ...s, key: s.id }))}
        titles={[
          translate('circusVoteSessionsForm.sessionsWithout'),
          translate('circusVoteSessionsForm.sessionsWith'),
        ]}
        targetKeys={targetKeys}
        render={item => <span>{item.name}</span>}
        onChange={handleChange}
      />
      <Button type="primary" onClick={updateSessions}>
        <Translate id="update" />
      </Button>
    </div>
  );
};

CircusVoteSessionsManager.propTypes = propTypes;

export default withLocalize(CircusVoteSessionsManager);
