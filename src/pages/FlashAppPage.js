import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Translate } from 'react-localize-redux';
import { Button, Spin } from 'antd';
import FlashAppInfos from '../components/FlashApp/FlashAppInfos';
import FlashAppForm from '../components/FlashApp/FlashAppForm';
import iaxios from '../axios';
import { updateEntity } from '../actions';

const propTypes = {
  general: PropTypes.shape({
    currentEntity: PropTypes.shape({}).isRequired,
  }).isRequired,
  updateEntity: PropTypes.func.isRequired,
};

const _FlashAppPage = ({ general: { currentEntity }, ...props }) => {
  const [flashApp, setFlashApp] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [formMode, setFormMode] = useState('create');

  useEffect(() => {
    const ax = iaxios();
    ax.get(`/flashapp/${currentEntity.id}`).then((res) => {
      if (res !== 'error') {
        setFlashApp(res.data);
      }
    });
    return () => ax.source.cancel();
  }, [currentEntity]);

  const openModal = (mode) => {
    setModalVisible(true);
    setFormMode(mode);
  };

  const formProps = {
    inModal: true,
    formMode,
    modalVisible,
    setModalVisible,
    flashApp,
  };

  const setVisible = () => {
    iaxios()
      .patch(`/flashapps/${currentEntity.id}/visible`, {
        visible: !currentEntity.visible,
      })
      .then((res) => {
        if (res !== 'error') {
          props.updateEntity(res.data);
        }
      });
  };

  return (
    <div>
      <h1>
        <Translate id="flashAppPage.h1" />
      </h1>
      <div className="instructions">
        <h4>
          <Translate id="instructions" />
        </h4>
        <Translate id="flashAppPage.instructions" />
      </div>
      <div style={{ marginTop: 15 }}>
        {flashApp ? (
          <div style={{ marginTop: 50 }}>
            <Button
              style={{ marginRight: 15 }}
              type="primary"
              icon="edit"
              onClick={() => openModal('edit')}
            >
              <span>
                <Translate id="editFlashApp" />
              </span>
            </Button>
            <Button
              type={flashApp.visible ? 'danger' : 'primary'}
              onClick={setVisible}
            >
              {flashApp.visible ? (
                <Translate id="flashAppPage.setNotVisible" />
              ) : (
                <Translate id="flashAppPage.setVisible" />
              )}
            </Button>
            <div style={{ marginTop: 50 }}>
              <FlashAppInfos flashApp={flashApp} />
            </div>
          </div>
        ) : (
          <Spin />
        )}
      </div>
      <FlashAppForm {...formProps} />
    </div>
  );
};

_FlashAppPage.propTypes = propTypes;

const mapStateToProps = ({ general }) => ({ general });

export const FlashAppPage = connect(
  mapStateToProps,
  { updateEntity },
)(_FlashAppPage);
