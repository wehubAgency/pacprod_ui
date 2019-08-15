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
  questions: PropTypes.arrayOf(PropTypes.object).isRequired,
  setQuestions: PropTypes.func.isRequired,
  selectedQuestion: PropTypes.string.isRequired,
};

const defaultProps = {
  inModal: false,
  setModalVisible: () => {},
  modalVisible: false,
  externalFormRef: null,
};

const QuestionForm = ({
  questions,
  setQuestions,
  selectedQuestion,
  selectQuestion,
  quiz,
  ...props
}) => {
  const formProps = {
    ...props,
    data: questions,
    createData: { quiz },
    setData: setQuestions,
    selectedData: selectedQuestion,
    selectData: selectQuestion,
    entityName: 'question',
    formName: 'questionForm',
    createUrl: '/questions',
    updateUrl: `/questions/${selectedQuestion}`,
    modalTitle:
      props.formMode === 'create' ? (
        <Translate id="createQuestion" />
      ) : (
        <Translate id="editQuestion" />
      ),
  };

  return <Form {...formProps} />;
};

QuestionForm.propTypes = propTypes;
QuestionForm.defaultProps = defaultProps;

export default QuestionForm;
