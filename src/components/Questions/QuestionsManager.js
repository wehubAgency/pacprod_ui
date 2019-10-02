import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Translate } from 'react-localize-redux';
import { Button, Spin } from 'antd';
import QuestionTable from './QuestionTable';
import QuestionForm from './QuestionForm';
import { useFetchData } from '../../hooks';

const propTypes = {
  quiz: PropTypes.string.isRequired,
  circusQuiz: PropTypes.bool,
};

const defaultProps = {
  circusQuiz: false,
};

const QuestionsManager = ({ quiz, circusQuiz }) => {
  const [questions, setQuestions] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [selectedQuestion, selectQuestion] = useState('');

  const { data, fetching } = useFetchData(
    `/questions?quiz=${quiz}${circusQuiz ? '&circusQuiz=true' : ''}`,
    [],
    [quiz],
  );

  useEffect(() => {
    setQuestions(data);
  }, [data, quiz]);

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
    circusQuiz,
  };
  const questionTableProps = {
    questions,
    setQuestions,
    openModal,
    selectQuestion,
    selectedQuestion,
    quiz,
    circusQuiz,
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
