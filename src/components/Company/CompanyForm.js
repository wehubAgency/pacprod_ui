import React from 'react';
import PropTypes from 'prop-types';
import { Translate } from 'react-localize-redux';
import Form from '../Form';

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
  companies: PropTypes.arrayOf(PropTypes.object).isRequired,
  setCompanies: PropTypes.func.isRequired,
  selectedCompany: PropTypes.string.isRequired,
  selectCompany: PropTypes.func.isRequired,
  formMode: PropTypes.string.isRequired,
};

const defaultProps = {
  inModal: false,
  setModalVisible: () => {},
  modalVisible: false,
  externalFormRef: null,
};

const CompanyForm = ({
  companies,
  setCompanies,
  selectedCompany,
  selectCompany,
  ...props
}) => {
  const edit = () => {
    const company = companies.find(c => c.id === selectedCompany);
    if (company) {
      const companyEdit = { ...company, ...company.address };
      return companyEdit;
    }
    return null;
  };

  const formProps = {
    ...props,
    entityName: 'company',
    data: companies,
    setData: setCompanies,
    selectedData: selectedCompany,
    selectData: selectCompany,
    createUrl: '/companies',
    updateUrl: `/companies/${selectedCompany}`,
    customEdit: edit,
    formName: 'companyForm',
    modalTitle:
      props.formMode === 'create' ? (
        <Translate id="createCompany" />
      ) : (
        <Translate id="editCompany" />
      ),
  };

  return <Form {...formProps} />;
};

CompanyForm.propTypes = propTypes;
CompanyForm.defaultProps = defaultProps;

export default CompanyForm;
