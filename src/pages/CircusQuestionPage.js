import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Translate } from 'react-localize-redux';
import { Button, Spin } from 'antd';
import iaxios from '../axios';
import QuestionTable from '../components/Questions/QuestionTable';
import QuestionForm from '../components/Questions/QuestionForm';

const propTypes = {
  general: PropTypes.shape({
    currentApp: PropTypes.object,
    currentEntity: PropTypes.object,
    currentSeason: PropTypes.object,
  }).isRequired,
};

const _CircusQuestionPage = ({
  general: { currentApp, currentEntity, currentSeason },
}) => {
  const [questions, setQuestions] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [selectedQuestion, selectQuestion] = useState('');

  useEffect(() => {
    setFetching(true);
    const ax = iaxios();
    ax.get('questions', { params: { quiz: 'circusQuiz' } }).then((res) => {
      if (res !== 'error') {
        setQuestions(res.data);
      }
      setFetching(false);
    });
    return () => ax.source.cancel();
  }, [currentApp, currentEntity, currentSeason]);

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
    quiz: 'circusQuiz',
  };
  const questionTableProps = {
    questions,
    setQuestions,
    openModal,
    selectQuestion,
    selectedQuestion,
    quiz: 'circusQuiz',
  };

  return (
    <div>
      <h1>
        <Translate id="circusQuestionPage.h1" />
      </h1>
      <div style={{ margin: '15px 0' }}>
        <Translate id="circusQuestionPage.intro" />
      </div>
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

_CircusQuestionPage.propTypes = propTypes;

const mapStateToProps = ({ general }) => ({ general });

export const CircusQuestionPage = connect(
  mapStateToProps,
  {},
)(_CircusQuestionPage);
