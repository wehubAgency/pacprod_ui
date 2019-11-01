import React, { useState, useEffect } from 'react';
import { Translate } from 'react-localize-redux';
import { Button } from 'antd';
import { useFetchData } from '../../hooks';
import ARGameLinkTable from './ARGameLinkTable';
import ARGameLinkForm from './ARGameLinkForm';

const ARGameLinkManager = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [argameLinks, setArgameLinks] = useState([]);
  const [selectedArgameLink, selectArgameLink] = useState('');

  const { data, fetching } = useFetchData('/argamelinks');

  useEffect(() => {
    setArgameLinks(data);
  }, [data]);

  const openModal = (mode, e) => {
    setModalVisible(true);
    setFormMode(mode);
    if (e && e.currentTarget.dataset.id) {
      selectArgameLink(e.currentTarget.dataset.id);
    }
  };

  const tableProps = {
    openModal,
    argameLinks,
    setArgameLinks,
    fetching,
  };

  const formProps = {
    inModal: true,
    formMode,
    modalVisible,
    setModalVisible,
    argameLinks,
    setArgameLinks,
    selectedArgameLink,
  };

  return (
    <div>
      <Button type="primary" icon="plus" onClick={() => openModal('create')}>
        <span>
          <Translate id="createArgameLink" />
        </span>
      </Button>
      <ARGameLinkTable {...tableProps} />
      <ARGameLinkForm {...formProps} />
    </div>
  );
};

export default ARGameLinkManager;
