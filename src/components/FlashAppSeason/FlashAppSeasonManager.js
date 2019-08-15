import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Translate } from 'react-localize-redux';
import { Button } from 'antd';
import FlashAppSeasonTable from './FlashAppSeasonTable';
import FlashAppSeasonForm from './FlashAppSeasonForm';
import { useFetchData } from '../../hooks';

const FlashAppSeasonManager = () => {
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, selectSeason] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [formMode, setFormMode] = useState('create');

  const { currentEntity } = useSelector(({ general }) => general);
  const { data, fetching } = useFetchData(`flashappseasons?flashapp=${currentEntity.id}`);

  useEffect(() => {
    setSeasons(data);
  }, [data]);

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
    fetching,
  };

  return (
    <div>
      <Button type="primary" icon="plus" onClick={() => openModal('create')}>
        <span>
          <Translate id="createSeason" />
        </span>
      </Button>
      <FlashAppSeasonTable {...tableProps} />
      <FlashAppSeasonForm {...formProps} />
    </div>
  );
};

export default FlashAppSeasonManager;
