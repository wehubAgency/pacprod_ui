import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Translate } from 'react-localize-redux';
import { Button } from 'antd';
import CircusSeasonTable from './CircusSeasonTable';
import CircusSeasonForm from './CircusSeasonForm';
import { useFetchData } from '../../hooks';

const CircusSeasonManager = () => {
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, selectSeason] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [formMode, setFormMode] = useState('create');

  const { currentEntity } = useSelector(({ general }) => general);

  const { data, fetching } = useFetchData(`/circusseasons?circus=${currentEntity.id}`);

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
    entityApiUri: 'circus',
  };

  return (
    <div>
      <Button type="primary" icon="plus" onClick={() => openModal('create')}>
        <span>
          <Translate id="createSeason" />
        </span>
      </Button>
      <CircusSeasonTable {...tableProps} />
      <CircusSeasonForm {...formProps} />
    </div>
  );
};

export default CircusSeasonManager;
