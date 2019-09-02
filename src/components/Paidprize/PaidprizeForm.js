import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Translate } from 'react-localize-redux';
import iaxios from '../../axios';
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
  const [models, setModels] = useState([]);

  useEffect(() => {
    iaxios()
      .get('/prizeinfos')
      .then((res) => {
        if (res !== 'error') {
          setModels(res.data);
        }
      });
  }, []);

  const optionsModel = models.map(m => ({
    value: m.id,
    label: m.name,
  }));

  const edit = () => {
    const paidprize = paidprizes.find(p => p.id === selectedPaidprize);
    const paidprizeEdit = { ...paidprize, ...paidprize.withdrawalAddress };
    return paidprizeEdit;
  };
  const formProps = {
    ...props,
    data: paidprizes,
    setData: setPaidprizes,
    selectedData: selectedPaidprize,
    createUrl: '/paidprizes',
    updateUrl: `/paidprizes/${selectedPaidprize}`,
    entityName: 'paidprize',
    formName: 'paidprizeForm',
    customEdit: edit,
    additionalData: { model: optionsModel },
    modalTitle:
      props.formMode === 'create' ? (
        <Translate id="createPaidprize" />
      ) : (
        <Translate id="editPaidprize" />
      ),
  };

  return <Form {...formProps} />;
};

PaidprizeForm.propTypes = propTypes;
PaidprizeForm.defaultProps = defaultProps;

export default PaidprizeForm;
