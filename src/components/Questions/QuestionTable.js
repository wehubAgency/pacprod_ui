import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Empty } from 'antd';
import QuestionList from './QuestionList';
import QuestionInfos from './QuestionInfos';

const QuestionTable = ({
  questions,
  setQuestions,
  openModal,
  selectedQuestion,
  selectQuestion,
  general: { config },
}) => {
  const [items, setItems] = useState([]);
  const { componentConfig } = config.entities.question;

  useEffect(() => {
    setItems(
      questions.map((s) => ({
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
  };
  const questionInfosProps = {
    infos: questions.find((q) => q.id === selectedQuestion),
    componentConfig,
    questions,
    setQuestions,
    openModal,
  };

  if (questions.length === 0) {
    return <Empty />;
  }
  return (
    <Row type="flex" style={{ marginTop: '25px' }}>
      <Col span={24} lg={{ span: 8 }}>
        <QuestionList {...questionListProps} />
      </Col>
      <Col span={24} lg={{ span: 16 }}>
        <QuestionInfos {...questionInfosProps} />
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ general }) => ({ general });

export default connect(
  mapStateToProps,
  {},
)(QuestionTable);
