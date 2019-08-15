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
    PropTypes.shape({ current: PropTypes.oneOfType([PropTypes.instanceOf(Element), () => null]) }),
  ]),
  formMode: PropTypes.string.isRequired,
};

const defaultProps = {
  inModal: false,
  setModalVisible: () => {},
  modalVisible: false,
  externalFormRef: null,
};

const PaidprizeForm = ({
  paidprizes, setPaidprizes, selectedPaidprize, ...props
}) => {
  const formProps = {
    ...props,
    data: paidprizes,
    setData: setPaidprizes,
    selectedData: selectedPaidprize,
    createUrl: '/paidprizes',
    updateUrl: `/paidprizes/${selectedPaidprize}`,
    entityName: 'paidprize',
    formName: 'paidprizeForm',
    modalTitle:
      props.formMode === 'create' ? (
        <Translate id="createPaidprize" />
      ) : (
        <Translate id="editPaidprize" />
      ),
    createText: <Translate id="createPaidprize" />,
  };

  return <Form {...formProps} />;
};

PaidprizeForm.propTypes = propTypes;
PaidprizeForm.defaultProps = defaultProps;

export default PaidprizeForm;
