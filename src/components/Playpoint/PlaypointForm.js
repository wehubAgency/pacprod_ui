import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'antd';
import { connect } from 'react-redux';
import { Translate } from 'react-localize-redux';
import formateData from '../../services/formateData';
import FormGen from '../FormGen';
import iaxios from '../../axios';

const propTypes = {
  inModal: PropTypes.bool,
  setModalVisible: PropTypes.func,
  modalVisible: PropTypes.bool,
  externalFormRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.oneOfType([PropTypes.instanceOf(Element), () => null]) }),
  ]),
  playpoints: PropTypes.arrayOf(PropTypes.shape()),
  setPlaypoints: PropTypes.func,
  selectedPlaypoint: PropTypes.string,
  selectedCompany: PropTypes.string.isRequired,
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
  playpoints: [],
  setPlaypoints: () => {},
  selectedPlaypoint: '',
};

const PlaypointForm = ({
  general: { config },
  formMode,
  modalVisible,
  setModalVisible,
  inModal,
  externalFormRef,
  playpoints,
  setPlaypoints,
  selectedPlaypoint,
  selectedCompany,
}) => {
  const [loading, setLoading] = useState(false);
  const { formConfig, editConfig } = config.entities.playpoint;
  const formRef = useRef(null);

  const createPlaypoint = (formData) => {
    formData.append('company', selectedCompany);
    iaxios()
      .post('/playpoints', formData)
      .then((res) => {
        if (res !== 'error') {
          setPlaypoints([...playpoints, res.data]);
          if (inModal) {
            setModalVisible(false);
          }
        }
        setLoading(false);
      });
  };

  const updatePlaypoint = (formData) => {
    formData.append('_method', 'PUT');
    iaxios()
      .post(`/playpoints/${selectedPlaypoint}`, formData)
      .then((res) => {
        if (res !== 'error') {
          const playpointIndex = playpoints.findIndex(p => p.id === res.data.id);
          const newPlaypoints = [...playpoints];
          newPlaypoints.splice(playpointIndex, 1, res.data);
          setPlaypoints(newPlaypoints);
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
          createPlaypoint(formData);
        } else if (formMode === 'edit') {
          updatePlaypoint(formData);
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

  const modalProps = {
    title:
      formMode === 'create' ? <Translate id="createPlaypoint" /> : <Translate id="editPlaypoint" />,
    visible: modalVisible,
    onCancel: closeModal,
    onOk: onSubmit,
    confirmLoading: loading,
    destroyOnClose: true,
  };

  const edit = () => {
    const playpoint = playpoints.find(p => p.id === selectedPlaypoint);
    const { coordinates } = playpoint.location;
    return {
      ...playpoint,
      ...playpoint.address,
      lng: coordinates[0],
      lat: coordinates[1],
    };
  };

  const formGenProps = {
    formConfig,
    editConfig,
    ref: externalFormRef || formRef,
    edit: formMode === 'edit' ? edit() : null,
    formName: 'playpointForm',
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
        <Translate id="createPlaypoint" />
      </Button>
    </div>
  );
};

PlaypointForm.propTypes = propTypes;
PlaypointForm.defaultProps = defaultProps;
const mapStateToProps = ({ general }) => ({ general });

export default connect(
  mapStateToProps,
  {},
)(PlaypointForm);
