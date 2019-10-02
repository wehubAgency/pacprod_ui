import React, { useState, useEffect } from 'react';
import { Translate } from 'react-localize-redux';
import { Button } from 'antd';
import ShowTable from './ShowTable';
import ShowForm from './ShowForm';
import { useFetchData } from '../../hooks';

const ShowManager = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [selectedShow, setSelectedShow] = useState('');
  const [shows, setShows] = useState([]);

  const { data, fetching } = useFetchData('/shows');

  useEffect(() => {
    setShows(data);
  }, [data]);

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
    fetching,
  };

  const formProps = {
    inModal: true,
    formMode,
    modalVisible,
    setModalVisible,
    shows,
    setShows,
    selectedShow,
  };

  return (
    <div>
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

export default ShowManager;
