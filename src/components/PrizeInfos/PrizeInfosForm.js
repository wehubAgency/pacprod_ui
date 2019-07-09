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
};

const PrizeInfosForm = ({
  general: { config },
  formMode,
  modalVisible,
  setModalVisible,
  inModal,
  externalFormRef,
  prizeInfos,
  setPrizeInfos,
  selectedPrizeInfos,
  selectPrizeInfos,
}) => {
  const [loading, setLoading] = useState(false);
  const { formConfig, editConfig } = config.entities.prizeInfos;
  const formRef = useRef(null);

  const createPrizeInfos = (formData) => {
    iaxios()
      .post('/prizeinfos', formData)
      .then((res) => {
        if (res !== 'error') {
          setPrizeInfos([...prizeInfos, res.data]);
          if (inModal) {
            setModalVisible(false);
          }
        }
        setLoading(false);
      });
  };

  const updatePrizeInfos = (formData) => {
    formData.append('_method', 'PUT');
    iaxios()
      .post(`/prizeinfos/${selectedPrizeInfos}`, formData)
      .then((res) => {
        if (res !== 'error') {
          const prizeInfosIndex = prizeInfos.findIndex(p => p.id === res.data.id);
          const newPrizeInfos = [...prizeInfos];
          newPrizeInfos.splice(prizeInfosIndex, 1, res.data);
          setPrizeInfos(newPrizeInfos);
          if (inModal) {
            setModalVisible(false);
          }
          selectPrizeInfos('');
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
          createPrizeInfos(formData);
        } else if (formMode === 'edit') {
          updatePrizeInfos(formData);
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
      formMode === 'create' ? (
        <Translate id="createPrizeInfos" />
      ) : (
        <Translate id="editPrizeInfos" />
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
    edit: formMode === 'edit' ? prizeInfos.find(p => p.id === selectedPrizeInfos) : null,
    formName: 'prizeInfosForm',
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
        <Translate id="createPrizeInfos" />
      </Button>
    </div>
  );
};

PrizeInfosForm.propTypes = propTypes;
PrizeInfosForm.defaultProps = defaultProps;
const mapStateToProps = ({ general }) => ({ general });

export default connect(
  mapStateToProps,
  {},
)(PrizeInfosForm);
