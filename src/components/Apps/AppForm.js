import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'antd';
import { connect } from 'react-redux';
import { Translate } from 'react-localize-redux';
import formateData from '../../services/formateData';
import { selectApp, setApps } from '../../actions';
import FormGen from '../FormGen';
import iaxios from '../../axios';

const propTypes = {
  inModal: PropTypes.bool,
  setModalVisible: PropTypes.func,
  modalVisible: PropTypes.bool,
  externalFormRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({
      current: PropTypes.oneOfType([PropTypes.instanceOf(Element), () => null]),
    }),
  ]),
  apps: PropTypes.arrayOf(PropTypes.shape()),
  setApps: PropTypes.func.isRequired,
  selectedApp: PropTypes.string,
  formMode: PropTypes.string.isRequired,
  general: PropTypes.shape({
    config: PropTypes.shape().isRequired,
  }).isRequired,
};

const defaultProps = {
  inModal: false,
  setModalVisible: () => {},
  modalVisible: false,
  externalFormRef: null,
  apps: [],
  selectedApp: '',
};

const AppForm = ({
  general: { config, currentApp },
  formMode,
  modalVisible,
  setModalVisible,
  inModal,
  externalFormRef,
  apps,
  selectedApp,
  ...props
}) => {
  const [loading, setLoading] = useState(false);
  const { formConfig, editConfig } = config.entities.app;
  const formRef = useRef(null);

  const createApp = (formData) => {
    iaxios('super_admin')
      .post('/apps', formData)
      .then((res) => {
        if (res !== 'error') {
          props.setApps({ apps: [...apps, res.data] });
          if (inModal) {
            setModalVisible(false);
          }
        }
        setLoading(false);
      });
  };

  const updateApp = (formData) => {
    formData.append('_method', 'PUT');
    iaxios('super_admin')
      .post(`/apps/${selectedApp}`, formData)
      .then((res) => {
        if (res !== 'error') {
          const appIndex = apps.findIndex(a => a.id === res.data.id);
          const newApps = [...apps];
          newApps.splice(appIndex, 1, res.data);
          props.setApps({ apps: newApps });
          if (currentApp.id === res.data.id) {
            props.selectApp({ selectedApp: res.data, config, update: true });
          }
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
    form.validateFieldsAndScroll((err, values) => {
      if (err === null) {
        const data = { ...values };
        const formData = formateData(data);
        if (formMode === 'create') {
          createApp(formData);
        } else if (formMode === 'edit') {
          updateApp(formData);
        }
      } else {
        setLoading(false);
      }
    });
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

  const features = [
    {
      value: 'circusQuiz',
      label: 'circusQuiz',
    },
    {
      value: 'quiz',
      label: 'quiz',
    },
    {
      value: 'qrflash',
      label: 'qrflash',
    },
    {
      value: 'partner',
      label: 'partner',
    },
    {
      value: 'selfie',
      label: 'selfie',
    },
    {
      value: 'webview',
      label: 'webview',
    },
    {
      value: 'arexpo',
      label: 'arexpo',
    },
  ];

  const type = [
    {
      value: 'circus',
      label: 'circus',
    },
    {
      value: 'flashapp',
      label: 'flashapp',
    },
  ];

  const modalProps = {
    title: formMode === 'create' ? <Translate id="createApp" /> : <Translate id="editApp" />,
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
    edit: formMode === 'edit' ? apps.find(a => a.id === selectedApp) : null,
    formName: 'appForm',
    data: {
      features,
      type,
    },
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
        <Translate id="createApp" />
      </Button>
    </div>
  );
};

AppForm.propTypes = propTypes;
AppForm.defaultProps = defaultProps;
const mapStateToProps = ({ general }) => ({ general });

export default connect(
  mapStateToProps,
  { selectApp, setApps },
)(AppForm);
