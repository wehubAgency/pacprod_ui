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
  artists: PropTypes.arrayOf(PropTypes.shape()),
  setArtists: PropTypes.func,
  selectedArtist: PropTypes.string,
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
  artists: [],
  setArtists: () => {},
  selectedArtist: '',
};

const ArtistForm = ({
  general: { config },
  formMode,
  modalVisible,
  setModalVisible,
  inModal,
  externalFormRef,
  artists,
  setArtists,
  selectedArtist,
}) => {
  const [loading, setLoading] = useState(false);
  const { formConfig, editConfig } = config.entities.artist;
  const formRef = useRef(null);

  const createArtist = (formData) => {
    iaxios()
      .post('/artists', formData)
      .then((res) => {
        if (res !== 'error') {
          setArtists([...artists, res.data]);
          if (inModal) {
            setModalVisible(false);
          }
        }
        setLoading(false);
      });
  };

  const updateArtist = (formData) => {
    formData.append('_method', 'PUT');
    iaxios()
      .post(`/artist/${selectedArtist}`, formData)
      .then((res) => {
        if (res !== 'error') {
          const artistIndex = artists.findIndex(c => c.id === res.data.id);
          const newArtists = [...artists];
          newArtists.splice(artistIndex, 1, res.data);
          setArtists(newArtists);
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
          createArtist(formData);
        } else if (formMode === 'edit') {
          updateArtist(formData);
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
    title: formMode === 'create' ? <Translate id="createArtist" /> : <Translate id="editArtist" />,
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
    edit: formMode === 'edit' ? artists.find(c => c.id === selectedArtist) : null,
    formName: 'artistForm',
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
        <Translate id="createArtist" />
      </Button>
    </div>
  );
};

ArtistForm.propTypes = propTypes;
ArtistForm.defaultProps = defaultProps;
const mapStateToProps = ({ general }) => ({ general });

export default connect(
  mapStateToProps,
  {},
)(ArtistForm);
