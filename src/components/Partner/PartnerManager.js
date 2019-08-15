import React, { useState, useEffect } from 'react';
import { Button, Spin } from 'antd';
import { Translate } from 'react-localize-redux';
import PartnerTable from './PartnerTable';
import PartnerForm from './PartnerForm';
import { useFetchData } from '../../hooks';

const PartnerManager = () => {
  const [partners, setPartners] = useState([]);
  const [selectedPartner, selectPartner] = useState('');
  const [formMode, setFormMode] = useState('create');
  const [modalVisible, setModalVisible] = useState(false);

  const { data, fetching } = useFetchData('/partners');

  useEffect(() => {
    setPartners(data);
    if (data.length > 0) {
      selectPartner(data[0].id);
    }
  }, [data]);

  const openModal = (mode = 'create') => {
    setModalVisible(true);
    setFormMode(mode);
  };

  const tableProps = {
    partners,
    setPartners,
    selectPartner,
    selectedPartner,
    fetching,
    openModal,
  };

  const formProps = {
    inModal: true,
    modalVisible,
    setModalVisible,
    partners,
    setPartners,
    selectedPartner,
    formMode,
  };

  return (
    <div>
      <Button type="primary" icon="plus" onClick={() => openModal()}>
        <span>
          <Translate id="createPartner" />
        </span>
      </Button>
      {fetching ? <Spin /> : <PartnerTable {...tableProps} />}
      <PartnerForm {...formProps} />
    </div>
  );
};

export default PartnerManager;
