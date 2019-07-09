import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Translate, withLocalize } from 'react-localize-redux';
import { Modal, Button, message } from 'antd';
import formateData from '../../services/formateData';
import iaxios from '../../axios';
import FormGen from '../FormGen';

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
  rules: PropTypes.shape().isRequired,
  setRules: PropTypes.func.isRequired,
};

const defaultProps = {
  inModal: false,
  setModalVisible: () => {},
  modalVisible: false,
  externalFormRef: null,
};

const RulesForm = ({
  formMode,
  rules,
  setRules,
  general: { config },
  modalVisible,
  closeModal,
  externalFormRef,
  inModal,
  translate,
}) => {
  const [loading, setLoading] = useState(false);
  const { formConfig, editConfig } = config.entities.flashPlayRules;
  const formRef = useRef(null);

  const editRules = (formData) => {
    formData.append('_method', 'PATCH');
    iaxios()
      .post('/flashplays/rules', formData)
      .then((res) => {
        if (res !== 'error') {
          setRules(res.data);
          message.success(translate('success'));
        }
        setLoading(false);
      });
  };

  const createRules = (formData) => {
    iaxios()
      .post('/flashplay/rules', formData)
      .then((res) => {
        if (res !== 'error') {
          setRules(res.data);
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
          createRules(formData);
        } else if (formMode === 'edit') {
          editRules(formData);
        }
      } else {
        setLoading(false);
      }
    });
  };

  const modalProps = {
    title: formMode === 'create' ? <Translate id="createRules" /> : <Translate id="editRules" />,
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
    edit: formMode === 'edit' ? rules : null,
    formName: 'rulesForm',
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
        {formMode === 'create' ? <Translate id="createRules" /> : <Translate id="editRules" />}
      </Button>
    </div>
  );
};

RulesForm.propTypes = propTypes;
RulesForm.defaultProps = defaultProps;
const mapStateToProps = ({ general }) => ({ general });

export default compose(
  withLocalize,
  connect(
    mapStateToProps,
    {},
  ),
)(RulesForm);
