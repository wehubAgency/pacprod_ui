import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Modal } from 'antd';
import { Translate } from 'react-localize-redux';
import FormGen from '../FormGen';
import formateData from '../../services/formateData';
import iaxios from '../../axios';
import { addSeason, updateSeason } from '../../actions';

const propTypes = {
  inModal: PropTypes.bool,
  setModalVisible: PropTypes.func,
  modalVisible: PropTypes.bool,
  externalFormRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.oneOfType([PropTypes.instanceOf(Element), () => null]) }),
  ]),
  seasons: PropTypes.arrayOf(PropTypes.shape()),
  setSeasons: PropTypes.func,
  selectedSeason: PropTypes.string,
  formMode: PropTypes.string.isRequired,
  general: PropTypes.shape({
    config: PropTypes.shape().isRequired,
    currentEntity: PropTypes.shape().isRequired,
  }).isRequired,
  addSeason: PropTypes.func.isRequired,
  updateSeason: PropTypes.func.isRequired,
};

const defaultProps = {
  inModal: false,
  setModalVisible: () => {},
  modalVisible: false,
  externalFormRef: null,
  seasons: [],
  setSeasons: () => {},
  selectedSeason: '',
};

const FlashAppSeasonForm = ({
  general: { config, currentEntity, currentApp },
  formMode,
  modalVisible,
  setModalVisible,
  inModal,
  externalFormRef,
  seasons,
  setSeasons,
  selectedSeason,
  ...props
}) => {
  const [loading, setLoading] = useState(false);
  const { formConfig, editConfig } = config.entities.season;
  const formRef = useRef(null);

  const createSeason = (formData) => {
    formData.append('flashapp', currentEntity.id);
    formData.append('app', currentApp.id);
    iaxios()
      .post('/flashappseasons', formData)
      .then((res) => {
        if (res !== 'error') {
          setSeasons([...seasons, res.data]);
          props.addSeason(res.data);
          if (inModal) {
            setModalVisible(false);
          }
        }
        setLoading(false);
      });
  };

  const editSeason = (formData) => {
    formData.append('_method', 'PUT');
    iaxios()
      .post(`/flashappseasons/${selectedSeason}`, formData)
      .then((res) => {
        if (res !== 'error') {
          const seasonIndex = seasons.findIndex(s => s.id === res.data.id);
          const newSeasons = [...seasons];
          newSeasons.splice(seasonIndex, 1, res.data);
          setSeasons(newSeasons);
          props.updateSeason(res.data);
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
          createSeason(formData);
        } else if (formMode === 'edit') {
          editSeason(formData);
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
    title: formMode === 'create' ? <Translate id="createSeason" /> : <Translate id="editSeason" />,
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
    edit: formMode === 'edit' ? seasons.find(s => s.id === selectedSeason) : null,
    formName: 'seasonForm',
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
        <Translate id="createSeason" />
      </Button>
    </div>
  );
};

FlashAppSeasonForm.propTypes = propTypes;
FlashAppSeasonForm.defaultProps = defaultProps;
const mapStateToProps = ({ general }) => ({ general });

export default connect(
  mapStateToProps,
  { addSeason, updateSeason },
)(FlashAppSeasonForm);
