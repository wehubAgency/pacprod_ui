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

const PaidprizeForm = ({
  general: { config },
  formMode,
  modalVisible,
  setModalVisible,
  inModal,
  externalFormRef,
  paidprizes,
  setPaidprizes,
  selectedPaidprize,
  selectPaidprize,
}) => {
  const [loading, setLoading] = useState(false);
  const { formConfig, editConfig } = config.entities.paidprize;
  const formRef = useRef(null);

  const createPaidprize = (formData) => {
    iaxios()
      .post('/paidprizes', formData)
      .then((res) => {
        if (res !== 'error') {
          setPaidprizes([...paidprizes, res.data]);
          if (inModal) {
            setModalVisible(false);
          }
        }
        setLoading(false);
      });
  };

  const updatePaidprize = (formData) => {
    formData.append('_method', 'PUT');
    iaxios()
      .post(`/paidprizes/${selectedPaidprize}`, formData)
      .then((res) => {
        if (res !== 'error') {
          const paidprizesIndex = paidprizes.findIndex(p => p.id === res.data.id);
          const newPaidprize = [...paidprizes];
          newPaidprize.splice(paidprizesIndex, 1, res.data);
          setPaidprizes(newPaidprize);
          if (inModal) {
            setModalVisible(false);
          }
          selectPaidprize('');
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
          createPaidprize(formData);
        } else if (formMode === 'edit') {
          updatePaidprize(formData);
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
      formMode === 'create' ? <Translate id="createPaidprize" /> : <Translate id="editPaidprize" />,
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
    edit: formMode === 'edit' ? paidprizes.find(p => p.id === selectedPaidprize) : null,
    formName: 'paidprizeForm',
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
        <Translate id="createPaidprize" />
      </Button>
    </div>
  );
};

PaidprizeForm.propTypes = propTypes;
PaidprizeForm.defaultProps = defaultProps;
const mapStateToProps = ({ general }) => ({ general });

export default connect(
  mapStateToProps,
  {},
)(PaidprizeForm);
