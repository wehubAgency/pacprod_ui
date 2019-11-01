import React, { useState, useEffect } from 'react';
import { Translate } from 'react-localize-redux';
import { Button } from 'antd';
import { useFetchData } from '../../hooks';
import ARExpoLinkTable from './ARExpoLinkTable';
import ARExpoLinkForm from './ARExpoLinkForm';

const ARExpoLinkManager = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [arexpoLinks, setArexpoLinks] = useState([]);
  const [selectedArexpoLink, selectArexpoLink] = useState('');

  const { data, fetching } = useFetchData('/arexpolinks');

  useEffect(() => {
    setArexpoLinks(data);
  }, [data]);

  const openModal = (mode, e) => {
    setModalVisible(true);
    setFormMode(mode);
    if (e && e.currentTarget.dataset.id) {
      selectArexpoLink(e.currentTarget.dataset.id);
    }
  };

  const tableProps = {
    openModal,
    arexpoLinks,
    setArexpoLinks,
    fetching,
  };

  const formProps = {
    inModal: true,
    formMode,
    modalVisible,
    setModalVisible,
    arexpoLinks,
    setArexpoLinks,
    selectedArexpoLink,
  };

  return (
    <div>
      <Button type="primary" icon="plus" onClick={() => openModal('create')}>
        <span>
          <Translate id="createArexpoLink" />
        </span>
      </Button>
      <ARExpoLinkTable {...tableProps} />
      <ARExpoLinkForm {...formProps} />
    </div>
  );
};

export default ARExpoLinkManager;
