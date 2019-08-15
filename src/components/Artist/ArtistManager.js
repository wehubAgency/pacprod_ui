import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import { Translate } from 'react-localize-redux';
import ArtistForm from './ArtistForm';
import ArtistTable from './ArtistTable';
import { useFetchData } from '../../hooks';

const ArtistManager = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [artists, setArtists] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState('');

  const { data, fetching } = useFetchData('/artists');

  useEffect(() => {
    setArtists(data);
  }, [data]);

  const openModal = (mode, e) => {
    setModalVisible(true);
    setFormMode(mode);
    if (e && e.currentTarget.dataset.id) {
      setSelectedArtist(e.currentTarget.dataset.id);
    }
  };

  const formProps = {
    inModal: true,
    formMode,
    modalVisible,
    setModalVisible,
    artists,
    setArtists,
    selectedArtist,
  };

  const tableProps = {
    openModal,
    artists,
    setArtists,
    fetching,
  };

  return (
    <div>
      <Button type="primary" icon="plus" onClick={() => openModal('create')}>
        <span>
          <Translate id="createArtist" />
        </span>
      </Button>
      <ArtistTable {...tableProps} />
      <ArtistForm {...formProps} />
    </div>
  );
};

export default ArtistManager;
