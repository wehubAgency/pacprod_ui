import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'antd';
import { useSelector } from 'react-redux';
import { Translate } from 'react-localize-redux';
import formateData from '../services/formateData';
import FormGen from './FormGen';
import iaxios from '../axios';

const propTypes = {
  formMode: PropTypes.string.isRequired,
  inModal: PropTypes.bool,
  setModalVisible: PropTypes.func,
  modalVisible: PropTypes.bool,
  externalFormRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({
      current: PropTypes.oneOfType([PropTypes.instanceOf(Element), () => null]),
    }),
  ]),
  data: PropTypes.arrayOf(PropTypes.shape()),
  setData: PropTypes.func,
  createData: PropTypes.object,
  createCallback: PropTypes.func,
  updateData: PropTypes.object,
  updateCallback: PropTypes.func,
  customEdit: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  selectedData: PropTypes.string,
  selectData: PropTypes.func,
  createUrl: PropTypes.string,
  updateUrl: PropTypes.string,
  formName: PropTypes.string.isRequired,
  modalTitle: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({
      current: PropTypes.oneOfType([PropTypes.instanceOf(Element), () => null]),
    }),
    PropTypes.string,
  ]).isRequired,
  createText: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({
      current: PropTypes.oneOfType([PropTypes.instanceOf(Element), () => null]),
    }),
    PropTypes.string,
  ]),
  entityName: PropTypes.string.isRequired,
  modalWidth: PropTypes.number,
  additionalData: PropTypes.object,
  customUpdate: PropTypes.func,
  customCreate: PropTypes.func,
};

const defaultProps = {
  inModal: false,
  modalVisible: false,
  setModalVisible: () => {},
  externalFormRef: null,
  data: [],
  setData: () => {},
  createData: null,
  createCallback: null,
  createUrl: '',
  updateData: null,
  updateCallback: null,
  updateUrl: '',
  customEdit: null,
  selectedData: '',
  createText: 'create',
  modalWidth: 520,
  additionalData: {},
  customCreate: null,
  customUpdate: null,
  selectData: null,
};

const Form = ({
  formMode,
  inModal,
  modalVisible,
  setModalVisible,
  externalFormRef,
  entityName,
  data,
  setData,
  createData,
  createCallback,
  updateData,
  updateCallback,
  customEdit,
  selectedData,
  createUrl,
  updateUrl,
  formName,
  modalTitle,
  createText,
  modalWidth,
  additionalData,
  customCreate,
  customUpdate,
  selectData,
}) => {
  const config = useSelector(({ general }) => general.config);

  const [loading, setLoading] = useState(false);
  const { formConfig, editConfig } = config.entities[entityName];
  const formRef = useRef(null);

  const createEntity = (formData) => {
    iaxios()
      .post(createUrl, formData)
      .then((res) => {
        if (res !== 'error') {
          if (createCallback) {
            createCallback(data, res);
          } else {
            setData([...data, res.data]);
            if (selectData) {
              selectData(res.data.id);
            }
          }
          if (inModal) {
            setModalVisible(false);
          }
        }
        setLoading(false);
      });
  };

  const updateEntity = (formData) => {
    formData.append('_method', 'PUT');
    iaxios()
      .post(updateUrl, formData)
      .then((res) => {
        if (res !== 'error') {
          if (updateCallback) {
            updateCallback(data, res);
          } else {
            const dataIndex = data.findIndex(d => d.id === res.data.id);
            const newData = [...data];
            newData.splice(dataIndex, 1, res.data);
            setData(newData);
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
        let rawValues = { ...values };
        if (formMode === 'create') {
          if (createData) {
            rawValues = { ...rawValues, ...createData };
          }
          const formData = formateData(rawValues);
          if (customCreate) {
            if (customCreate(formData)) {
              if (inModal) {
                setModalVisible(false);
              }
              setLoading(false);
            }
          } else {
            createEntity(formData);
          }
        } else if (formMode === 'edit') {
          if (updateData) {
            rawValues = { ...rawValues, ...updateData };
          }
          const formData = formateData(rawValues);
          if (customUpdate) {
            if (customUpdate(formData)) {
              if (inModal) {
                setModalVisible(false);
              }
              setLoading(false);
            }
          } else {
            updateEntity(formData);
          }
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
    title: modalTitle,
    visible: modalVisible,
    onCancel: closeModal,
    onOk: onSubmit,
    confirmLoading: loading,
    destroyOnClose: true,
    width: modalWidth,
  };

  const edit = () => {
    if (formMode === 'edit') {
      if (customEdit) {
        if (typeof customEdit === 'function') {
          return customEdit();
        }
        return customEdit;
      }
      return data.find(d => d.id === selectedData);
    }
    return null;
  };

  const formGenProps = {
    formConfig,
    editConfig,
    ref: externalFormRef || formRef,
    edit: edit(),
    formName,
    data: additionalData,
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
        <Translate id={createText} />
      </Button>
    </div>
  );
};

Form.propTypes = propTypes;
Form.defaultProps = defaultProps;

export default Form;
