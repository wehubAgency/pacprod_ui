import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Button } from 'antd';
import { Translate } from 'react-localize-redux';
import iaxios from '../axios';
import PartnerTable from '../components/Partner/PartnerTable';
import PartnerForm from '../components/Partner/PartnerForm';

const _PartnerPage = ({
  general: {
    currentApp, currentEntity, currentSeason, config,
  },
}) => {
  const [fetching, setFetching] = useState(false);
  const [partners, setPartners] = useState([]);
  const [selectedPartner, selectPartner] = useState('');
  const [formMode, setFormMode] = useState('create');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    setFetching(true);
    const ax = iaxios();
    ax.get('/partners').then((res) => {
      if (res !== 'error') {
        setPartners(res.data);
        if (res.data.length > 0) {
          selectPartner(res.data[0].id);
        }
      }
      setFetching(false);
    });

    return () => ax.source.cancel();
  }, [currentApp, currentEntity, currentSeason]);

  const openModal = (mode = 'create') => {
    setModalVisible(true);
    setFormMode(mode);
  };

  const tableProps = {
    partners,
    setPartners,
    selectPartner,
    selectedPartner,
    config,
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
      <h1>
        <Translate id="partnerPage.h1" />
      </h1>
      <div className="instructions">
        <h4>
          <Translate id="instructions" />
        </h4>
        <Translate id="partnerPage.instructions" />
      </div>
      <div>
        <Button type="primary" icon="plus" onClick={() => openModal()}>
          <span>
            <Translate id="createPartner" />
          </span>
        </Button>
        <PartnerTable {...tableProps} />
        <PartnerForm {...formProps} />
      </div>
    </div>
  );
};

const mapStateToProps = ({ general }) => ({ general });

export const PartnerPage = connect(
  mapStateToProps,
  {},
)(_PartnerPage);
