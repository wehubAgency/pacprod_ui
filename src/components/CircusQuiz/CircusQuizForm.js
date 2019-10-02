import React from 'react';
import PropTypes from 'prop-types';
import { Translate } from 'react-localize-redux';
import Form from '../Form';

const propTypes = {
  inModal: PropTypes.bool,
  setModalVisible: PropTypes.func,
  modalVisible: PropTypes.bool,
  externalFormRef: PropTypes.instanceOf(Element),
  formMode: PropTypes.string.isRequired,
  allQuiz: PropTypes.arrayOf(PropTypes.object).isRequired,
  setAllQuiz: PropTypes.func.isRequired,
  selectedQuiz: PropTypes.string.isRequired,
  selectQuiz: PropTypes.func.isRequired,
};

const defaultProps = {
  inModal: false,
  setModalVisible: () => {},
  modalVisible: false,
  externalFormRef: null,
};

const CircusQuizForm = ({
  allQuiz, setAllQuiz, selectedQuiz, selectQuiz, ...props
}) => {
  const formProps = {
    ...props,
    entityName: 'circusQuiz',
    data: allQuiz,
    setData: setAllQuiz,
    selectedData: selectedQuiz,
    selectData: selectQuiz,
    createUrl: '/circusquiz',
    updateUrl: `/circusquiz/${selectedQuiz}`,
    formName: 'circusQuizForm',
    modalTitle:
      props.formMode === 'create' ? <Translate id="createQuiz" /> : <Translate id="editQuiz" />,
  };

  return <Form {...formProps} />;
};

CircusQuizForm.propTypes = propTypes;
CircusQuizForm.defaultProps = defaultProps;

export default CircusQuizForm;
