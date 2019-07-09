import React, { useState, useRef } from 'react';
import { Modal, Button } from 'antd';
import { connect } from 'react-redux';
import { Translate } from 'react-localize-redux';
import FormGen from '../FormGen';
import formateData from '../../services/formateData';
import iaxios from '../../axios';

const LocationForm = ({
  formMode,
  modalVisible,
  setModalVisible,
  inModal,
  externalFormRef,
  locations,
  setLocations,
  selectedLocation,
  general: { config },
}) => {
  const [loading, setLoading] = useState(false);
  const { formConfig, editConfig } = config.entities.location;
  const formRef = useRef(null);

  const createLocation = (formData) => {
    iaxios()
      .post('/locations', formData)
      .then((res) => {
        if (res !== 'error') {
          setLocations([...locations, res.data]);
          if (inModal) {
            setModalVisible(false);
          }
        }
        setLoading(false);
      });
  };

  const updateLocation = (formData) => {
    formData.append('_method', 'PUT');
    iaxios()
      .post(`/location/${selectedLocation}`, formData)
      .then((res) => {
        if (res !== 'error') {
          const locationIndex = locations.findIndex(l => l.id === res.data.id);
          const newLocations = [...locations];
          newLocations.splice(locationIndex, 1, res.data);
          setLocations(newLocations);
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
          createLocation(formData);
        } else if (formMode === 'edit') {
          updateLocation(formData);
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

  let edit = formMode === 'edit' ? locations.find(l => l.id === selectedLocation) : null;

  if (edit !== null) {
    edit = {
      ...edit,
      lng: edit.location.coordinates[0],
      lat: edit.location.coordinates[1],
      ...edit.address,
    };
  }

  const formGenProps = {
    formConfig,
    editConfig,
    ref: externalFormRef || formRef,
    edit,
    formName: 'locationForm',
  };

  const modalProps = {
    title:
      formMode === 'create' ? <Translate id="createLocation" /> : <Translate id="editLocation" />,
    visible: modalVisible,
    onCancel: closeModal,
    onOk: onSubmit,
    confirmLoading: loading,
    destroyOnClose: true,
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
        <span>
          <Translate id="createLocation" />
        </span>
      </Button>
    </div>
  );
};

const mapStateToProps = ({ general }) => ({ general });

export default connect(
  mapStateToProps,
  {},
)(LocationForm);
