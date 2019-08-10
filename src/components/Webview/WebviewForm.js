import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'antd';
import { Translate } from 'react-localize-redux';
import { connect } from 'react-redux';
import FormGen from '../FormGen';
import iaxios from '../../axios';
import formateData from '../../services/formateData';

const propTypes = {
  inModal: PropTypes.bool,
  setModalVisible: PropTypes.func,
  modalVisible: PropTypes.bool,
  webviews: PropTypes.arrayOf(PropTypes.shape()),
  setWebviews: PropTypes.func,
  selectedWebview: PropTypes.string,
  externalFormRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]),
  general: PropTypes.shape({
    config: PropTypes.shape().isRequired,
  }).isRequired,
};

const defaultProps = {
  inModal: false,
  setModalVisible: () => {},
  modalVisible: false,
  externalFormRef: null,
  webviews: [],
  setWebviews: () => {},
  selectedWebview: '',
};

const WebviewForm = ({
  general: { config },
  externalFormRef,
  formMode,
  modalVisible,
  setModalVisible,
  inModal,
  webviews,
  setWebviews,
  selectedWebview,
}) => {
  const { formConfig, editConfig } = config.entities.webview;
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);

  const createWebview = (formData, form) => {
    iaxios()
      .post('/webviews', formData)
      .then((res) => {
        if (res !== 'error') {
          setWebviews([...webviews, res.data]);
          if (inModal) {
            setModalVisible(false);
          }
          form.resetFields();
        }
        setLoading(false);
      });
  };

  const updateWebview = (formData, form) => {
    formData.append('_method', 'PUT');
    iaxios()
      .post(`/webviews/${selectedWebview}`, formData)
      .then((res) => {
        if (res !== 'error') {
          const index = webviews.findIndex(s => s.id === res.data.id);
          const newWebviews = [...webviews];
          newWebviews.splice(index, 1, res.data);
          form.resetFields();
          setWebviews(newWebviews);
          if (inModal) {
            setModalVisible(false);
          }
        }
        setLoading(false);
      });
  };

  const onSubmit = (e) => {
    setLoading(true);

    const form = formRef.current;

    e.preventDefault();
    form.validateFields((err, values) => {
      if (err === null) {
        const data = { ...values };
        const formData = formateData(data);
        if (formMode === 'create') {
          createWebview(formData, form);
        } else if (formMode === 'edit') {
          updateWebview(formData, form);
        }
      } else {
        setLoading(false);
      }
    });
    setLoading(false);
  };

  const closeModal = () => {
    const form = formRef.current;
    if (formMode === 'edit') {
      form.resetFields();
    }
    if (inModal) {
      setModalVisible(false);
    }
  };

  const modalProps = {
    title:
      formMode === 'create' ? <Translate id="createWebview" /> : <Translate id="updateWebview" />,
    visible: modalVisible,
    onCancel: closeModal,
    onOk: onSubmit,
    confirmLoading: loading,
    destroyOnClose: true,
    width: 900,
  };

  const formGenProps = {
    formConfig,
    editConfig,
    ref: externalFormRef || formRef,
    edit: formMode === 'edit' ? webviews.find(w => w.id === selectedWebview) : null,
    formName: 'webviewForm',
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
        <Translate id="createWebview" />
      </Button>
    </div>
  );
};

WebviewForm.propTypes = propTypes;
WebviewForm.defaultProps = defaultProps;
const mapStateToProps = ({ general }) => ({ general });

export default connect(
  mapStateToProps,
  {},
)(WebviewForm);
