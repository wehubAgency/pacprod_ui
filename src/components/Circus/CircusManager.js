import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Translate } from 'react-localize-redux';
import { Button, Spin } from 'antd';
import CircusInfos from './CircusInfos';
import CircusForm from './CircusForm';
import { updateEntity } from '../../actions';
import { useFetchData } from '../../hooks';
import iaxios from '../../axios';

const CircusManager = () => {
  const [circus, setCircus] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [formMode, setFormMode] = useState('create');

  const currentEntity = useSelector(({ general }) => general.currentEntity);
  const dispatch = useDispatch();

  const { data, fetching } = useFetchData(`/circus/${currentEntity.id}`, '');

  useEffect(() => {
    setCircus(data);
  }, [data]);

  const openModal = (mode) => {
    setModalVisible(true);
    setFormMode(mode);
  };

  const formProps = {
    inModal: true,
    formMode,
    modalVisible,
    setModalVisible,
    circus,
  };

  const setVisible = () => {
    iaxios()
      .patch(`/circus/${currentEntity.id}/visible`, {
        visible: !currentEntity.visible,
      })
      .then((res) => {
        if (res !== 'error') {
          dispatch(updateEntity(res.data));
        }
      });
  };

  return (
    <div>
      {fetching ? (
        <Spin />
      ) : (
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
          <Button type={currentEntity.visible ? 'danger' : 'primary'} onClick={setVisible}>
            {currentEntity.visible ? (
              <Translate id="circusPage.setNotVisible" />
            ) : (
              <Translate id="circusPage.setVisible" />
            )}
          </Button>
          <div style={{ marginTop: 50 }}>
            {circus && (
              <div>
                <CircusInfos circus={circus} />
                <CircusForm {...formProps} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CircusManager;
