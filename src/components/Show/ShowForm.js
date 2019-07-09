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
  shows: PropTypes.arrayOf(PropTypes.shape()),
  setShows: PropTypes.func,
  selectedShow: PropTypes.string,
  externalFormRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]),
  general: PropTypes.shape({
    config: PropTypes.shape().isRequired,
  }).isRequired,
  artists: PropTypes.arrayOf(PropTypes.shape).isRequired,
};

const defaultProps = {
  inModal: false,
  setModalVisible: () => {},
  modalVisible: false,
  externalFormRef: null,
  shows: [],
  setShows: () => {},
  selectedShow: '',
};

const ShowForm = ({
  general: { config },
  externalFormRef,
  artists,
  formMode,
  modalVisible,
  setModalVisible,
  inModal,
  shows,
  setShows,
  selectedShow,
}) => {
  const { formConfig, editConfig } = config.entities.show;
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);

  const createShow = (formData, form) => {
    iaxios()
      .post('/shows', formData)
      .then((res) => {
        if (res !== 'error') {
          setShows([...shows, res.data]);
          if (inModal) {
            setModalVisible(false);
          }
          form.resetFields();
        }
        setLoading(false);
      });
  };

  const updateShow = (formData, form) => {
    formData.append('_method', 'PUT');
    iaxios()
      .post(`/show/${selectedShow}`, formData)
      .then((res) => {
        if (res !== 'error') {
          const showIndex = shows.findIndex(s => s.id === res.data.id);
          const newShows = [...shows];
          newShows.splice(showIndex, 1, res.data);
          form.resetFields();
          setShows(newShows);
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
          createShow(formData, form);
        } else if (formMode === 'edit') {
          updateShow(formData, form);
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

  const options = {
    artist: artists.map(a => ({
      value: a.id,
      label: a.name,
    })),
  };

  const modalProps = {
    title:
      formMode === 'create' ? (
        <Translate id="showForm.createShow" />
      ) : (
        <Translate id="showForm.editShow" />
      ),
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
    edit: formMode === 'edit' ? shows.find(s => s.id === selectedShow) : null,
    formName: 'showForm',
    datas: options,
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
        <Translate id="showForm.createShow" />
      </Button>
    </div>
  );
};

ShowForm.propTypes = propTypes;
ShowForm.defaultProps = defaultProps;
const mapStateToProps = ({ general }) => ({ general });

export default connect(
  mapStateToProps,
  {},
)(ShowForm);
