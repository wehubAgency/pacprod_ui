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

const QuizForm = ({
  allQuiz, setAllQuiz, selectedQuiz, selectQuiz, ...props
}) => {
  const formProps = {
    ...props,
    entityName: 'quiz',
    data: allQuiz,
    setData: setAllQuiz,
    selectedData: selectedQuiz,
    selectData: selectQuiz,
    createUrl: '/quiz',
    updateUrl: `/quiz/${selectedQuiz}`,
    formName: 'quizForm',
    modalTitle:
      props.formMode === 'create' ? <Translate id="createQuiz" /> : <Translate id="editQuiz" />,
  };

  return <Form {...formProps} />;
};

QuizForm.propTypes = propTypes;
QuizForm.defaultProps = defaultProps;

export default QuizForm;
