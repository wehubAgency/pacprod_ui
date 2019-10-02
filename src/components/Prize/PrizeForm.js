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
    PropTypes.shape({
      current: PropTypes.oneOfType([PropTypes.instanceOf(Element), () => null]),
    }),
  ]),
  formMode: PropTypes.string.isRequired,
  entityName: PropTypes.string.isRequired,
};

const defaultProps = {
  inModal: false,
  setModalVisible: () => {},
  modalVisible: false,
  externalFormRef: null,
};

const PrizeForm = ({
  prizes,
  setPrizes,
  selectedPrize,
  classId,
  className,
  entityName,
  ...props
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

  const optionsModel = models
    .filter(m => m.enabled)
    .map(m => ({
      value: m.id,
      label: m.name,
    }));

  const edit = () => {
    const prize = prizes.find(p => p.id === selectedPrize);
    const prizeEdit = { ...prize, ...prize.withdrawalAddress };
    return prizeEdit;
  };

  const formProps = {
    ...props,
    data: prizes,
    setData: setPrizes,
    selectedData: selectedPrize,
    createData: { classId, className },
    createUrl: '/prizes',
    updateUrl: `/prizes/${selectedPrize}`,
    entityName,
    formName: 'prizeForm',
    additionalData: { model: optionsModel },
    customEdit: edit,
    modalTitle:
      props.formMode === 'create' ? <Translate id="createPrize" /> : <Translate id="editPrize" />,
  };

  return <Form {...formProps} />;
};

PrizeForm.propTypes = propTypes;
PrizeForm.defaultProps = defaultProps;

export default PrizeForm;
