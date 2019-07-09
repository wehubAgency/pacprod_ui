import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Translate } from 'react-localize-redux';
import { Button, Spin } from 'antd';
import CircusInfos from '../components/Circus/CircusInfos';
import CircusForm from '../components/Circus/CircusForm';
import iaxios from '../axios';
import { updateEntity } from '../actions';

const propTypes = {
  general: PropTypes.shape({
    currentEntity: PropTypes.shape({}).isRequired,
  }).isRequired,
  updateEntity: PropTypes.func.isRequired,
};

const _CircusPage = ({ general: { currentEntity }, ...props }) => {
  const [circus, setCircus] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [formMode, setFormMode] = useState('create');

  useEffect(() => {
    if (currentEntity) {
      const ax = iaxios();
      ax.get(`/circus/${currentEntity.id}`).then((res) => {
        if (res !== 'error') {
          setCircus(res.data);
        }
      });
      return () => ax.source.cancel();
    }
    return null;
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
  };

  const setVisible = () => {
    iaxios()
      .patch(`/circus/${currentEntity.id}/visible`, {
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
        <Translate id="circusPage.h1" />
      </h1>
      <div className="instructions">
        <h4>
          <Translate id="instructions" />
        </h4>
        <Translate id="circusPage.intro" />
      </div>
      {currentEntity && (
        <div style={{ marginTop: 15 }}>
          <Button
            style={{ marginRight: 15 }}
            type="primary"
            icon="edit"
            onClick={() => openModal('edit')}
          >
            <span>
              <Translate id="editCircus" />
            </span>
          </Button>
          <Button
            type={currentEntity.visible ? 'danger' : 'primary'}
            onClick={setVisible}
          >
            {currentEntity.visible ? (
              <Translate id="circusPage.setNotVisible" />
            ) : (
              <Translate id="circusPage.setVisible" />
            )}
          </Button>
          <div style={{ marginTop: 50 }}>
            {circus ? <CircusInfos circus={circus} /> : <Spin />}
          </div>
        </div>
      )}
      <CircusForm {...formProps} />
    </div>
  );
};

const mapStateToProps = ({ general }) => ({ general });

_CircusPage.propTypes = propTypes;

export const CircusPage = connect(
  mapStateToProps,
  { updateEntity },
)(_CircusPage);
