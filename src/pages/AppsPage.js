import React, { useState } from 'react';
import { Button } from 'antd';
import { connect } from 'react-redux';
import AppForm from '../components/Apps/AppForm';
import AppTable from '../components/Apps/AppTable';
import { setApps } from '../actions';

const _AppsPage = ({ general, general: { apps, config }, ...props }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [selectedApp, selectApp] = useState('');

  const openModal = (mode, e) => {
    setModalVisible(true);
    setFormMode(mode);
    if (e && e.currentTarget.dataset.id) {
      selectApp(e.currentTarget.dataset.id);
    }
  };

  const formProps = {
    inModal: true,
    modalVisible,
    setModalVisible,
    apps,
    setApps: props.setApps,
    selectedApp,
    formMode,
  };

  const tableProps = {
    apps,
    config,
    openModal,
    selectedApp,
    setApps: props.setApps,
  };

  return (
    <div>
      <h1>Gestion des Apps</h1>
      <Button type="primary" icon="plus" onClick={() => openModal('create')}>
        Créer une App
      </Button>
      <AppTable {...tableProps} />
      <AppForm {...formProps} />
    </div>
  );
};

const mapStateToProps = ({ general }) => ({ general });

export const AppsPage = connect(
  mapStateToProps,
  { setApps },
)(_AppsPage);
