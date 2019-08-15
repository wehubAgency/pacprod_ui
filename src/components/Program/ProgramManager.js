import React, { useState, useEffect } from 'react';
import { Button, Spin } from 'antd';
import { Translate } from 'react-localize-redux';
import ProgramTable from './ProgramTable';
import ProgramForm from './ProgramForm';
import { useFetchData } from '../../hooks';

const ProgramManager = () => {
  const [programs, setPrograms] = useState([]);
  const [shows, setShows] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProgram, selectProgram] = useState('');
  const [formMode, setFormMode] = useState('create');

  const { data, fetching } = useFetchData(['/programs', '/shows'], [[], []]);

  useEffect(() => {
    setPrograms(data[0]);
    setShows(data[1]);
  }, [data]);

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
    selectProgram,
  };

  const tableProps = {
    programs,
    setPrograms,
    openModal,
    selectedProgram,
    selectProgram,
  };

  return (
    <div>
      <Button type="primary" icon="plus" onClick={() => openModal('create')}>
        <span>
          <Translate id="createProgram" />
        </span>
      </Button>
      <div style={{ marginTop: 50 }}>{fetching ? <Spin /> : <ProgramTable {...tableProps} />}</div>
      <ProgramForm {...formProps} />
    </div>
  );
};

export default ProgramManager;
