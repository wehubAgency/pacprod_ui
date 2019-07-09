import React from 'react';
import PropTypes from 'prop-types';
import {
  Card, Icon, Row, Col, Divider, Popconfirm,
} from 'antd';
import { Translate } from 'react-localize-redux';
import iaxios from '../../axios';
import styles from '../../styles/components/QuestionInfos.style';

const propTypes = {
  infos: PropTypes.shape({
    question: PropTypes.string,
    proposals: PropTypes.arrayOf(PropTypes.string),
    answers: PropTypes.arrayOf(PropTypes.number),
  }),
  questions: PropTypes.arrayOf(PropTypes.object).isRequired,
  setQuestions: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  componentConfig: PropTypes.object.isRequired,
};

const defaultProps = {
  infos: undefined,
};

const QuestionInfos = ({
  infos, componentConfig, questions, setQuestions, openModal,
}) => {
  const { cardStyle, listItemStyle } = styles;
  if (infos !== undefined) {
    const deleteQuestion = () => {
      const { id } = infos;
      iaxios()
        .delete(`/questions/${id}`)
        .then((res) => {
          if (res !== 'error') {
            const index = questions.findIndex(q => q.id === res.data.id);
            const newQuestions = [...questions];
            newQuestions.splice(index, 1);
            setQuestions(newQuestions);
          }
        });
    };

    const editQuestion = () => {
      openModal('edit');
    };

    return (
      <Card
        style={cardStyle}
        title={infos.question}
        cover={<img alt={infos.question} src={infos.image} />}
        actions={[
          <Icon type="edit" onClick={editQuestion} />,
          <Popconfirm
            title={<Translate id="questionsInfos.confirmDelete" />}
            onConfirm={deleteQuestion}
          >
            <Icon type="delete" />
          </Popconfirm>,
        ]}
      >
        <p>
          <strong>
            <Translate id="questionInfos.proposals" />:
          </strong>
        </p>
        <p>
          <i>
            <Translate id="questionInfos.proposalsHelp" />
          </i>
        </p>
        <Row type="flex" gutter={16} justify="space-around">
          {infos.proposals.map((p, i) => (
            <Col key={p} span={24} md={{ span: 12 }} lg={{ span: 6 }}>
              <div
                style={{ ...listItemStyle, background: infos.answers.includes(i) ? '#dcedc8' : '' }}
              >
                {p}
              </div>
            </Col>
          ))}
        </Row>
        <Divider>
          <Translate id="questionInfos.moreInfos" />
        </Divider>
        <p>
          <b>
            <Translate id="questionInfos.points" />
          </b>
          : {infos.points}
        </p>
        {Object.entries(componentConfig).map(([key, el]) => (
          <p key={key}>
            <b>{el.title}</b>: {infos[el.dataIndex]}
          </p>
        ))}
      </Card>
    );
  }
  return null;
};

QuestionInfos.propTypes = propTypes;
QuestionInfos.defaultProps = defaultProps;

export default QuestionInfos;
