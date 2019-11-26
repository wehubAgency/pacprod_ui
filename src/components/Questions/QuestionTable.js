import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Row, Col, Empty } from 'antd';
import QuestionList from './QuestionList';
import QuestionInfos from './QuestionInfos';

const propTypes = {
  questions: PropTypes.arrayOf(PropTypes.object).isRequired,
  setQuestions: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  selectedQuestion: PropTypes.string.isRequired,
  selectQuestion: PropTypes.func.isRequired,
  quiz: PropTypes.string.isRequired,
  circusQuiz: PropTypes.bool,
};

const defaultProps = {
  circusQuiz: false,
};

const QuestionTable = ({
  questions,
  setQuestions,
  openModal,
  selectedQuestion,
  selectQuestion,
  quiz,
  circusQuiz,
}) => {
  const [items, setItems] = useState([]);
  const { componentConfig } = useSelector(
    ({ general: { config } }) => config.entities.question,
  );

  useEffect(() => {
    setItems(
      questions.map(s => ({
        id: s.id,
        order: s.order,
        question: s.question,
      })),
    );
  }, [questions]);

  const questionListProps = {
    items,
    setItems,
    selectedQuestion,
    selectQuestion,
    quiz,
    circusQuiz,
  };
  const questionInfosProps = {
    infos: questions.find(q => q.id === selectedQuestion),
    componentConfig,
    questions,
    setQuestions,
    openModal,
    quiz,
    circusQuiz,
  };

  if (questions.length === 0) {
    return <Empty />;
  }
  return (
    <Row type="flex" gutter={16} style={{ marginTop: '25px', maxHeight: 800 }}>
      <Col span={24} lg={{ span: 8 }}>
        <QuestionList {...questionListProps} />
      </Col>
      <Col span={24} lg={{ span: 16 }}>
        <QuestionInfos {...questionInfosProps} />
      </Col>
    </Row>
  );
};

QuestionTable.propTypes = propTypes;
QuestionTable.defaultProps = defaultProps;

export default QuestionTable;
