import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { Translate, withLocalize } from 'react-localize-redux';
import {
  Button, Spin, message, Row, Col,
} from 'antd';
import FlashAppInfos from './FlashAppInfos';
import FlashAppForm from './FlashAppForm';
import iaxios from '../../axios';
import { updateEntity } from '../../actions';
import { useFetchData } from '../../hooks';

const propTypes = {
  translate: PropTypes.func.isRequired,
};

const FlashAppManager = ({ translate }) => {
  const [flashApp, setFlashApp] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [formMode, setFormMode] = useState('create');

  const { currentEntity } = useSelector(({ general }) => general);
  const dispatch = useDispatch();

  const { data } = useFetchData(`/flashapp/${currentEntity.id}`, null);

  useEffect(() => {
    setFlashApp(data);
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
    flashApp,
  };

  const setVisible = () => {
    iaxios()
      .patch(`/flashapps/${currentEntity.id}/visible`, {
        visible: !currentEntity.visible,
      })
      .then((res) => {
        if (res !== 'error') {
          dispatch(updateEntity(res.data));
          message.success(translate('success'));
        }
      });
  };

  return (
    <div>
      <div>
        {flashApp ? (
          <div style={{ marginTop: 50 }}>
            <Row gutter={16} type="flex">
              <Col>
                <Button type="primary" icon="edit" onClick={() => openModal('edit')}>
                  <span>
                    <Translate id="editFlashApp" />
                  </span>
                </Button>
              </Col>
              <Col>
                <Button type={flashApp.visible ? 'danger' : 'primary'} onClick={setVisible}>
                  {flashApp.visible ? (
                    <Translate id="flashAppPage.setNotVisible" />
                  ) : (
                    <Translate id="flashAppPage.setVisible" />
                  )}
                </Button>
              </Col>
            </Row>
            <div style={{ marginTop: 50 }}>
              <FlashAppInfos flashApp={flashApp} />
            </div>
            <FlashAppForm {...formProps} />
          </div>
        ) : (
          <Spin />
        )}
      </div>
    </div>
  );
};

FlashAppManager.propTypes = propTypes;

export default withLocalize(FlashAppManager);
