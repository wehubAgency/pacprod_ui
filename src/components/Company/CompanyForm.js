import React, { useState, useRef } from 'react';
import { Modal, Button } from 'antd';
import { connect } from 'react-redux';
import { Translate } from 'react-localize-redux';
import FormGen from '../FormGen';
import formateData from '../../services/formateData';
import iaxios from '../../axios';

const CompanyForm = ({
  general: { config },
  externalFormRef,
  inModal,
  formMode,
  modalVisible,
  setModalVisible,
  selectedCompany,
  selectCompany,
  companies,
  setCompanies,
}) => {
  const { formConfig, editConfig } = config.entities.company;
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);

  const closeModal = () => {
    setModalVisible(false);
  };

  const createCompany = (formData) => {
    iaxios()
      .post('companies', formData)
      .then((res) => {
        if (res !== 'error') {
          setCompanies([...companies, res.data]);
          selectCompany(res.data.id);
          if (inModal) {
            closeModal();
          }
        }
        setLoading(false);
      });
  };

  const updateCompany = (formData) => {
    formData.append('_method', 'PUT');
    iaxios()
      .post(`/company/${selectedCompany}`, formData)
      .then((res) => {
        if (res !== 'error') {
          const companyIndex = companies.findIndex(c => c.id === res.data.id);
          const newCompanies = [...companies];
          newCompanies.splice(companyIndex, 1, res.data);
          setCompanies(newCompanies);
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
          createCompany(formData);
        } else if (formMode === 'edit') {
          updateCompany(formData);
        }
      } else {
        setLoading(false);
      }
    });
  };

  const edit = () => {
    const company = companies.find(c => c.id === selectedCompany);
    const companyEdit = { ...company, ...company.address };
    return companyEdit;
  };

  const formGenProps = {
    formConfig,
    editConfig,
    ref: externalFormRef || formRef,
    edit: formMode === 'edit' ? edit() : null,
    formName: 'companyForm',
  };

  const modalProps = {
    title:
      formMode === 'create' ? <Translate id="createCompany" /> : <Translate id="editCompany" />,
    visible: modalVisible,
    onCancel: closeModal,
    onOk: onSubmit,
    confirmLoading: loading,
    destroyOnClose: true,
    width: '600px',
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
        <Translate id="createCompany" />
      </Button>
    </div>
  );
};

const mapStateToProps = ({ general }) => ({ general });

export default connect(
  mapStateToProps,
  {},
)(CompanyForm);
