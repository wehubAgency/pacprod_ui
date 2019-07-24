import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Translate } from 'react-localize-redux';
import { Button, Spin } from 'antd';
import QuestionTable from './QuestionTable';
import QuestionForm from './QuestionForm';

const propTypes = {
  questions: PropTypes.arrayOf(PropTypes.shape()),
  setQuestions: PropTypes.func.isRequired,
  quiz: PropTypes.string.isRequired,
  fetching: PropTypes.bool.isRequired,
};

const defaultProps = {
  questions: [],
};

const QuestionsManager = ({
  questions, setQuestions, quiz, fetching,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [selectedQuestion, selectQuestion] = useState('');

  const openModal = (mode) => {
    setModalVisible(true);
    setFormMode(mode);
  };

  const formProps = {
    inModal: true,
    formMode,
    setFormMode,
    modalVisible,
    setModalVisible,
    questions,
    setQuestions,
    selectedQuestion,
    selectQuestion,
    quiz,
  };
  const questionTableProps = {
    questions,
    setQuestions,
    openModal,
    selectQuestion,
    selectedQuestion,
    quiz,
  };

  return (
    <div>
      <Button type="primary" icon="plus" onClick={() => openModal('create')}>
        <Translate id="createQuestion" />
      </Button>
      <div style={{ marginTop: 50 }}>
        {fetching ? <Spin /> : <QuestionTable {...questionTableProps} />}
      </div>
      <QuestionForm {...formProps} />
    </div>
  );
};

QuestionsManager.propTypes = propTypes;
QuestionsManager.defaultProps = defaultProps;

export default QuestionsManager;
