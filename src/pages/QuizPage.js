import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Select, Button, Popconfirm } from 'antd';
import { Translate } from 'react-localize-redux';
import QuizForm from '../components/Quiz/QuizForm';
import QuizInfos from '../components/Quiz/QuizInfos';
import iaxios from '../axios';

const _QuizPage = ({
  general: { currentApp, currentEntity, currentSeason },
}) => {
  const [allQuiz, setAllQuiz] = useState([]);
  const [selectedQuiz, selectQuiz] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [formMode, setFormMode] = useState('create');

  useEffect(() => {
    const ax = iaxios();
    ax.get('/quiz').then((res) => {
      setAllQuiz(res.data);
      if (res.data.length > 0) {
        selectQuiz(res.data[0].id);
      }
    });
  }, [currentApp, currentEntity, currentSeason]);

  const renderQuizOption = () => {
    return allQuiz.map((q) => (
      <Select.Option key={q.id} value={q.id}>
        {q.name}
      </Select.Option>
    ));
  };

  const openModal = (mode = 'create') => {
    setModalVisible(true);
    setFormMode(mode);
  };

  const onQuizChange = (id) => {
    selectQuiz(id);
  };

  const toggleQuiz = () => {
    iaxios()
      .patch(`/quiz/${selectedQuiz}/enabled`, {
        enabled: !allQuiz.find((q) => q.id === selectedQuiz).enabled,
      })
      .then((res) => {
        if (res !== 'error') {
          const index = allQuiz.findIndex((q) => q.id === res.data.id);
          const newQuiz = [...allQuiz];
          newQuiz.splice(index, 1, res.data);
          setAllQuiz(newQuiz);
        }
      });
  };

  const removeQuiz = () => {
    iaxios()
      .delete(`/quiz/${selectedQuiz}`)
      .then((res) => {
        if (res !== 'error') {
          const index = allQuiz.findIndex((q) => q.id === res.data.id);
          const newQuiz = [...allQuiz];
          newQuiz.splice(index, 1);
          setAllQuiz(newQuiz);
          if (allQuiz.length > 0) selectQuiz(allQuiz[0].id);
        }
      });
  };

  const formProps = {
    inModal: true,
    formMode,
    setFormMode,
    modalVisible,
    setModalVisible,
    allQuiz,
    setAllQuiz,
    selectedQuiz,
    selectQuiz,
  };

  return (
    <div>
      <h1>
        <Translate id="quizPage.h1" />
      </h1>
      <div className="instructions">
        <h4>
          <Translate id="instructions" />
        </h4>
        <Translate id="quizPage.instructions" />
      </div>
      <div style={{ marginTop: 50 }}>
        {allQuiz.length > 0 && (
          <Select
            style={{ width: 150, marginLeft: 50 }}
            value={selectedQuiz}
            onChange={onQuizChange}
          >
            {renderQuizOption()}
          </Select>
        )}
        <Button
          style={{ marginLeft: 15 }}
          type="primary"
          icon="plus"
          onClick={() => openModal()}
        >
          <span>
            <Translate id="createQuiz" />
          </span>
        </Button>
        {selectedQuiz && (
          <>
            <Button
              style={{ marginLeft: 15 }}
              onClick={() => openModal('edit')}
            >
              <span>
                <Translate id="editQuiz" />
              </span>
            </Button>
            <Button
              style={{ marginLeft: 15 }}
              type={
                allQuiz.find((q) => q.id === selectedQuiz).enabled
                  ? 'warning'
                  : 'success'
              }
              onClick={toggleQuiz}
            >
              <span>
                {allQuiz.find((q) => q.id === selectedQuiz).enabled ? (
                  <Translate id="quizPage.disableQuiz" />
                ) : (
                  <Translate id="quizPage.enableQuiz" />
                )}
              </span>
            </Button>
            <Popconfirm
              title={<Translate id="quizPage.confirmRemove" />}
              onConfirm={removeQuiz}
            >
              <Button style={{ marginLeft: 15 }} type="danger">
                <span>
                  <Translate id="quizPage.removeQuiz" />
                </span>
              </Button>
            </Popconfirm>
            <QuizInfos
              quiz={allQuiz.find((q) => q.id === selectedQuiz)}
              allQuiz={allQuiz}
              setAllQuiz={setAllQuiz}
            />
          </>
        )}
        <QuizForm {...formProps} />
      </div>
    </div>
  );
};

const mapStateToProps = ({ general }) => ({ general });

export const QuizPage = connect(
  mapStateToProps,
  {},
)(_QuizPage);
