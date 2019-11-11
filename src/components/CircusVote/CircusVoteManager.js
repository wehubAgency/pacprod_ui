import React, { useState, useEffect } from 'react';
import {
  Select, Button, Popconfirm, Spin,
} from 'antd';
import { Translate } from 'react-localize-redux';
import CircusVoteForm from './CircusVoteForm';
import CircusVoteInfos from './CircusVoteInfos';
import iaxios from '../../axios';
import { useFetchData } from '../../hooks';

const CircusVoteManager = () => {
  const [allVotes, setAllVotes] = useState([]);
  const [selectedVote, selectVote] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [formMode, setFormMode] = useState('create');

  const { data, fetching } = useFetchData('/circusvotes');

  useEffect(() => {
    selectVote('');
    setAllVotes(data);
    if (data.length > 0) {
      selectVote(data[0].id);
    }
  }, [data]);

  const renderQuizOption = () => allVotes.map(v => (
      <Select.Option key={v.id} value={v.id}>
        {v.name}
      </Select.Option>
  ));

  const openModal = (mode = 'create') => {
    setModalVisible(true);
    setFormMode(mode);
  };

  const onVoteChange = (id) => {
    selectVote(id);
  };

  const toggleVote = () => {
    iaxios()
      .patch(`/circusvotes/${selectedVote}/enabled`, {
        enabled: !allVotes.find(v => v.id === selectedVote).enabled,
      })
      .then((res) => {
        if (res !== 'error') {
          const index = allVotes.findIndex(v => v.id === res.data.id);
          const newVotes = [...allVotes];
          newVotes.splice(index, 1, res.data);
          setAllVotes(newVotes);
        }
      });
  };

  const removeVote = () => {
    iaxios()
      .delete(`/circusvotes/${selectedVote}`)
      .then((res) => {
        if (res !== 'error') {
          const index = allVotes.findIndex(v => v.id === res.data.id);
          const newVotes = [...allVotes];
          newVotes.splice(index, 1);
          selectVote('');
          setAllVotes(newVotes);
        }
      });
  };

  const formProps = {
    inModal: true,
    formMode,
    setFormMode,
    modalVisible,
    setModalVisible,
    allVotes,
    setAllVotes,
    selectedVote,
    selectVote,
  };

  return (
    <div style={{ marginTop: 50 }}>
      {fetching ? (
        <Spin />
      ) : (
        <div>
          {allVotes.length > 0 && (
            <Select
              style={{ width: 150, marginLeft: 50 }}
              value={selectedVote}
              onChange={onVoteChange}
            >
              {renderQuizOption()}
            </Select>
          )}
          <Button style={{ marginLeft: 15 }} type="primary" icon="plus" onClick={() => openModal()}>
            <span>
              <Translate id="createVote" />
            </span>
          </Button>
          {selectedVote && (
            <>
              <Button style={{ marginLeft: 15 }} onClick={() => openModal('edit')}>
                <span>
                  <Translate id="editVote" />
                </span>
              </Button>
              <Button
                style={{ marginLeft: 15 }}
                type={allVotes.find(v => v.id === selectedVote).enabled ? 'warning' : 'success'}
                onClick={toggleVote}
              >
                <span>
                  {allVotes.find(v => v.id === selectedVote).enabled ? (
                    <Translate id="circusVoteManager.disableVote" />
                  ) : (
                    <Translate id="circusVoteManager.enableVote" />
                  )}
                </span>
              </Button>
              <Popconfirm
                title={<Translate id="circusVoteManager.confirmRemove" />}
                onConfirm={removeVote}
              >
                <Button style={{ marginLeft: 15 }} type="danger">
                  <span>
                    <Translate id="circusVoteManager.removeVote" />
                  </span>
                </Button>
              </Popconfirm>
              <CircusVoteInfos
                vote={allVotes.find(v => v.id === selectedVote)}
                allVotes={allVotes}
                setAllVotes={setAllVotes}
              />
            </>
          )}
          <CircusVoteForm {...formProps} />
        </div>
      )}
    </div>
  );
};

export default CircusVoteManager;
