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
  partners: PropTypes.arrayOf(PropTypes.shape()),
  setPartners: PropTypes.func,
  selectedPartner: PropTypes.string,
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
  partners: [],
  setPartners: () => {},
  selectedPartner: '',
};

const PartnerForm = ({
  general: { config },
  formMode,
  modalVisible,
  setModalVisible,
  inModal,
  externalFormRef,
  partners,
  setPartners,
  selectedPartner,
}) => {
  const [loading, setLoading] = useState(false);
  const { formConfig, editConfig } = config.entities.partner;
  const formRef = useRef(null);

  const createPartner = (formData) => {
    iaxios()
      .post('/partners', formData)
      .then((res) => {
        if (res !== 'error') {
          setPartners([...partners, res.data]);
          if (inModal) {
            setModalVisible(false);
          }
        }
        setLoading(false);
      });
  };

  const updatePartner = (formData) => {
    formData.append('_method', 'PUT');
    iaxios()
      .post(`/partners/${selectedPartner}`, formData)
      .then((res) => {
        if (res !== 'error') {
          const partnerIndex = partners.findIndex(c => c.id === res.data.id);
          const newPartners = [...partners];
          newPartners.splice(partnerIndex, 1, res.data);
          setPartners(newPartners);
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
          createPartner(formData);
        } else if (formMode === 'edit') {
          updatePartner(formData);
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

  const edit = () => {
    const partner = partners.find(p => p.id === selectedPartner);
    return {
      ...partner,
      ...partner.address,
    };
  };

  const modalProps = {
    title:
      formMode === 'create' ? <Translate id="createPartner" /> : <Translate id="editPartner" />,
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
    edit: formMode === 'edit' ? edit() : null,
    formName: 'partnerForm',
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
        <Translate id="createPartner" />
      </Button>
    </div>
  );
};

PartnerForm.propTypes = propTypes;
PartnerForm.defaultProps = defaultProps;
const mapStateToProps = ({ general }) => ({ general });

export default connect(
  mapStateToProps,
  {},
)(PartnerForm);
