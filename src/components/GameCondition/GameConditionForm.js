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
    PropTypes.shape({
      current: PropTypes.oneOfType([PropTypes.instanceOf(Element), () => null]),
    }),
  ]),
  gameConditions: PropTypes.arrayOf(PropTypes.shape()),
  setGameConditions: PropTypes.func,
  selectedGameCondition: PropTypes.string,
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
  gameConditions: [],
  setGameConditions: () => {},
  selectedGameCondition: '',
};

const GameConditionForm = ({
  general: { config },
  formMode,
  modalVisible,
  setModalVisible,
  inModal,
  externalFormRef,
  gameConditions,
  setGameConditions,
  selectedGameCondition,
}) => {
  const [loading, setLoading] = useState(false);
  const { formConfig, editConfig } = config.entities.gameCondition;
  const formRef = useRef(null);

  const createGameCondition = (formData) => {
    iaxios()
      .post('/gameconditions', formData)
      .then((res) => {
        if (res !== 'error') {
          setGameConditions([...gameConditions, res.data]);
          if (inModal) {
            setModalVisible(false);
          }
        }
        setLoading(false);
      });
  };

  const updateGameCondition = (formData) => {
    formData.append('_method', 'PUT');
    iaxios()
      .post(`/gameconditions/${selectedGameCondition}`, formData)
      .then((res) => {
        if (res !== 'error') {
          const gcIndex = gameConditions.findIndex((g) => g.id === res.data.id);
          const newGameConditions = [...gameConditions];
          newGameConditions.splice(gcIndex, 1, res.data);
          setGameConditions(newGameConditions);
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
          createGameCondition(formData);
        } else if (formMode === 'edit') {
          updateGameCondition(formData);
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
        <Translate id="createGameConditions" />
      ) : (
        <Translate id="editGameConditions" />
      ),
    visible: modalVisible,
    onCancel: closeModal,
    onOk: onSubmit,
    confirmLoading: loading,
    destroyOnClose: true,
    width: 700,
  };

  const formGenProps = {
    formConfig,
    editConfig,
    ref: externalFormRef || formRef,
    edit:
      formMode === 'edit'
        ? gameConditions.find((c) => c.id === selectedGameCondition)
        : null,
    formName: 'gameConditionForm',
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
        <Translate id="createGameCondition" />
      </Button>
    </div>
  );
};

GameConditionForm.propTypes = propTypes;
GameConditionForm.defaultProps = defaultProps;
const mapStateToProps = ({ general }) => ({ general });

export default connect(
  mapStateToProps,
  {},
)(GameConditionForm);
