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
  gameConditions: PropTypes.arrayOf(PropTypes.shape()),
  setGameConditions: PropTypes.func,
  selectedGameCondition: PropTypes.string,
  formMode: PropTypes.string.isRequired,
};

const defaultProps = {
  inModal: false,
  setModalVisible: () => {},
  modalVisible: false,
  externalFormRef: null,
  gameConditions: [],
  setGameConditions: () => {},
  selectedGameCondition: '',
};

const GameConditionForm = ({
  gameConditions,
  setGameConditions,
  selectedGameCondition,
  ...props
}) => {
  const formProps = {
    ...props,
    data: gameConditions,
    setData: setGameConditions,
    selectedData: selectedGameCondition,
    entityName: 'gameCondition',
    createUrl: '/gameconditions',
    updateUrl: `/gameconditions/${selectedGameCondition}`,
    formName: 'gameConditionForm',
    modalTitle:
      props.formMode === 'create' ? (
        <Translate id="createGameConditions" />
      ) : (
        <Translate id="editGameConditions" />
      ),
    modalWidth: 700,
  };

  return <Form {...formProps} />;
};

GameConditionForm.propTypes = propTypes;
GameConditionForm.defaultProps = defaultProps;

export default GameConditionForm;
