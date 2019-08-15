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

const PrizeInfosForm = ({
  prizeInfos, setPrizeInfos, selectedPrizeInfos, ...props
}) => {
  const formProps = {
    ...props,
    data: prizeInfos,
    setData: setPrizeInfos,
    selectedData: selectedPrizeInfos,
    createUrl: '/prizeinfos',
    updateUrl: `/prizeinfos/${selectedPrizeInfos}`,
    formName: 'prizeInfosForm',
    entityName: 'prizeInfos',
    modalTitle:
      props.formMode === 'create' ? (
        <Translate id="createPrizeInfos" />
      ) : (
        <Translate id="editPrizeInfos" />
      ),
    createText: <Translate id="createPrizeInfos" />,
  };

  return <Form {...formProps} />;
};

PrizeInfosForm.propTypes = propTypes;
PrizeInfosForm.defaultProps = defaultProps;

export default PrizeInfosForm;
