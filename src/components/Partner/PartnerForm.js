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
  partners: PropTypes.arrayOf(PropTypes.shape()),
  setPartners: PropTypes.func,
  selectedPartner: PropTypes.string,
  formMode: PropTypes.string.isRequired,
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
  partners, setPartners, selectedPartner, ...props
}) => {
  const edit = () => {
    if (selectedPartner) {
      const partner = partners.find(p => p.id === selectedPartner);
      return {
        ...partner,
        ...partner.address,
      };
    }
    return null;
  };

  const formProps = {
    ...props,
    data: partners,
    setData: setPartners,
    selectedData: selectedPartner,
    createUrl: '/partners',
    updateUrl: `/partners/${selectedPartner}`,
    customEdit: edit,
    entityName: 'partner',
    formName: 'partnerForm',
    modalTitle:
      props.formMode === 'create' ? (
        <Translate id="createPartner" />
      ) : (
        <Translate id="editPartner" />
      ),
    createText: <Translate id="createPartner" />,
  };

  return <Form {...formProps} />;
};

PartnerForm.propTypes = propTypes;
PartnerForm.defaultProps = defaultProps;

export default PartnerForm;
