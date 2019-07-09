import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'antd';
import { connect } from 'react-redux';
import { Translate } from 'react-localize-redux';
import FormGen from '../FormGen';
import iaxios from '../../axios';
import formateData from '../../services/formateData';
import { addEntity, updateEntity } from '../../actions';

const propTypes = {
  inModal: PropTypes.bool,
  setModalVisible: PropTypes.func,
  modalVisible: PropTypes.bool,
  externalFormRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]),
  formMode: PropTypes.string.isRequired,
  general: PropTypes.shape({
    config: PropTypes.shape().isRequired,
    currentEntity: PropTypes.shape(),
  }).isRequired,
  flashApp: PropTypes.shape(),
};

const defaultProps = {
  inModal: false,
  setModalVisible: () => {},
  modalVisible: false,
  externalFormRef: null,
  flashApp: {},
};

const FlashAppForm = ({
  general: { config, currentApp, currentEntity },
  formMode,
  modalVisible,
  setModalVisible,
  inModal,
  externalFormRef,
  flashApp,
  ...props
}) => {
  const [loading, setLoading] = useState(false);
  const { formConfig, editConfig } = config.entities.flashApp;
  const formRef = useRef(null);

  const closeModal = () => {
    setModalVisible(false);
  };

  const createFlashApp = (formData) => {
    formData.append('app', currentApp.id);
    iaxios()
      .post('/flashapps', formData)
      .then((res) => {
        if (res !== 'error') {
          props.addEntity(res.data);
          document.location.reload(true);
          if (inModal) {
            closeModal();
          }
        }
        setLoading(false);
      });
  };

  const editFlashApp = (formData) => {
    formData.append('_method', 'PUT');
    iaxios()
      .post(`/flashapps/${currentEntity.id}`, formData)
      .then((res) => {
        if (res !== 'error') {
          props.updateEntity(res.data);
          if (inModal) {
            closeModal();
          }
        }
        setLoading(false);
      });
  };

  const onSubmit = (e) => {
    setLoading(true);

    const form = formRef.current;

    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (err === null) {
        const data = { ...values, app: currentApp.id };
        const formData = formateData(data);
        if (formMode === 'create') {
          createFlashApp(formData);
        } else if (formMode === 'edit') {
          editFlashApp(formData);
        }
      } else {
        setLoading(false);
      }
    });
  };

  const modalProps = {
    title:
      formMode === 'create' ? <Translate id="createFlashApp" /> : <Translate id="editFlashApp" />,
    visible: modalVisible,
    onCancel: closeModal,
    onOk: onSubmit,
    confirmLoading: loading,
    destroyOnClose: true,
  };

  const formGenProps = {
    formConfig,
    editConfig,
    ref: externalFormRef || formRef,
    edit: formMode === 'edit' ? { ...flashApp, ...flashApp.address } : null,
    formName: 'flashAppForm',
  };

  if (externalFormRef) {
    return (
      <div>
        <FormGen {...formGenProps} />
      </div>
    );
  }
  if (inModal) {
    return (
      <Modal {...modalProps}>
        <FormGen {...formGenProps} />
      </Modal>
    );
  }
  return (
    <div>
      <FormGen {...formGenProps} />
      <Button type="primary" onClick={onSubmit}>
        <Translate id="createFlashApp" />
      </Button>
    </div>
  );
};

FlashAppForm.propTypes = propTypes;
FlashAppForm.defaultProps = defaultProps;
const mapStateToProps = ({ general }) => ({ general });

export default connect(
  mapStateToProps,
  { addEntity, updateEntity },
)(FlashAppForm);
