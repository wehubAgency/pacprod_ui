import React, { useState, useEffect } from 'react';
import {
  Select, Button, Popconfirm, Spin,
} from 'antd';
import { Translate } from 'react-localize-redux';
import CircusQuizForm from './CircusQuizForm';
import CircusQuizInfos from './CircusQuizInfos';
import iaxios from '../../axios';
import { useFetchData } from '../../hooks';

const CircusQuizManager = () => {
  const [allQuiz, setAllQuiz] = useState([]);
  const [selectedQuiz, selectQuiz] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [formMode, setFormMode] = useState('create');

  const { data, fetching } = useFetchData('/circusquiz');

  useEffect(() => {
    selectQuiz('');
    setAllQuiz(data);
    if (data.length > 0) {
      selectQuiz(data[0].id);
    }
  }, [data]);

  const renderQuizOption = () => allQuiz.map(q => (
      <Select.Option key={q.id} value={q.id}>
        {q.name}
      </Select.Option>
  ));

  const openModal = (mode = 'create') => {
    setModalVisible(true);
    setFormMode(mode);
  };

  const onQuizChange = (id) => {
    selectQuiz(id);
  };

  const toggleQuiz = () => {
    iaxios()
      .patch(`/circusquiz/${selectedQuiz}/enabled`, {
        enabled: !allQuiz.find(q => q.id === selectedQuiz).enabled,
      })
      .then((res) => {
        if (res !== 'error') {
          const index = allQuiz.findIndex(q => q.id === res.data.id);
          const newQuiz = [...allQuiz];
          newQuiz.splice(index, 1, res.data);
          setAllQuiz(newQuiz);
        }
      });
  };

  const removeQuiz = () => {
    iaxios()
      .delete(`/circusquiz/${selectedQuiz}`)
      .then((res) => {
        if (res !== 'error') {
          const index = allQuiz.findIndex(q => q.id === res.data.id);
          const newQuiz = [...allQuiz];
          newQuiz.splice(index, 1);
          selectQuiz('');
          setAllQuiz(newQuiz);
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
    <div style={{ marginTop: 50 }}>
      {fetching ? (
        <Spin />
      ) : (
        <div>
          {allQuiz.length > 0 && (
            <Select
              style={{ width: 150, marginLeft: 50 }}
              value={selectedQuiz}
              onChange={onQuizChange}
            >
              {renderQuizOption()}
            </Select>
          )}
          <Button style={{ marginLeft: 15 }} type="primary" icon="plus" onClick={() => openModal()}>
            <span>
              <Translate id="createQuiz" />
            </span>
          </Button>
          {selectedQuiz && (
            <>
              <Button style={{ marginLeft: 15 }} onClick={() => openModal('edit')}>
                <span>
                  <Translate id="editQuiz" />
                </span>
              </Button>
              <Button
                style={{ marginLeft: 15 }}
                type={allQuiz.find(q => q.id === selectedQuiz).enabled ? 'warning' : 'success'}
                onClick={toggleQuiz}
              >
                <span>
                  {allQuiz.find(q => q.id === selectedQuiz).enabled ? (
                    <Translate id="quizPage.disableQuiz" />
                  ) : (
                    <Translate id="quizPage.enableQuiz" />
                  )}
                </span>
              </Button>
              <Popconfirm title={<Translate id="quizPage.confirmRemove" />} onConfirm={removeQuiz}>
                <Button style={{ marginLeft: 15 }} type="danger">
                  <span>
                    <Translate id="quizPage.removeQuiz" />
                  </span>
                </Button>
              </Popconfirm>
              <CircusQuizInfos
                quiz={allQuiz.find(q => q.id === selectedQuiz)}
                allQuiz={allQuiz}
                setAllQuiz={setAllQuiz}
              />
            </>
          )}
          <CircusQuizForm {...formProps} />
        </div>
      )}
    </div>
  );
};

export default CircusQuizManager;
