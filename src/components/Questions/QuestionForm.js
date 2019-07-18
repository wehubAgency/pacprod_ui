import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal, Button } from 'antd';
import { Translate } from 'react-localize-redux';
import FormGen from '../FormGen';
import iaxios from '../../axios';
import formateData from '../../services/formateData';

const propTypes = {
  inModal: PropTypes.bool,
  setModalVisible: PropTypes.func,
  modalVisible: PropTypes.bool,
  externalFormRef: PropTypes.instanceOf(Element),
  formMode: PropTypes.string.isRequired,
  questions: PropTypes.arrayOf(PropTypes.object).isRequired,
  setQuestions: PropTypes.func.isRequired,
  selectedQuestion: PropTypes.string.isRequired,
  general: PropTypes.shape({
    config: PropTypes.shape().isRequired,
  }).isRequired,
};

const defaultProps = {
  inModal: false,
  setModalVisible: () => {},
  modalVisible: false,
  externalFormRef: null,
};

const QuestionForm = ({
  general: { config },
  formMode,
  modalVisible,
  setModalVisible,
  questions,
  setQuestions,
  selectedQuestion,
  selectQuestion,
  inModal,
  externalFormRef,
  quiz,
}) => {
  const [loading, setLoading] = useState(false);
  const { formConfig, editConfig } = config.entities.question;
  const formRef = useRef(null);

  useEffect(() => {
    const form = formRef.current;
    if (form && formMode === 'create') {
      form.resetFields();
    }
  }, [formMode]);

  const createQuestion = (formData, form) => {
    formData.append('quiz', quiz);
    iaxios()
      .post('/questions', formData)
      .then((res) => {
        if (res !== 'error') {
          setQuestions([...questions, res.data]);
          if (inModal) {
            setModalVisible(false);
          }
          selectQuestion(res.data.id);
          form.resetFields();
        }
        setLoading(false);
      });
  };

  const updateQuestion = (formData, form) => {
    formData.append('_method', 'PUT');
    iaxios()
      .post(`/questions/${selectedQuestion}`, formData)
      .then((res) => {
        if (res !== 'error') {
          const questionIndex = questions.findIndex(
            (q) => q.id === res.data.id,
          );
          const newQuestions = [...questions];
          newQuestions.splice(questionIndex, 1, res.data);
          form.resetFields();
          setQuestions(newQuestions);
          if (inModal) {
            setModalVisible(false);
          }
        }
        setLoading(false);
      });
  };

  const onSubmit = (e) => {
    setLoading(true);

    const form = formRef.current;

    e.preventDefault();
    form.validateFields((err, values) => {
      if (err === null) {
        const data = { ...values };
        const formData = formateData(data);
        if (formMode === 'create') {
          createQuestion(formData, form);
        } else if (formMode === 'edit') {
          updateQuestion(formData, form);
        }
      } else {
        setLoading(false);
      }
    });
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const modalProps = {
    title:
      formMode === 'create' ? (
        <Translate id="createQuestion" />
      ) : (
        <Translate id="editQuestion" />
      ),
    visible: modalVisible,
    onCancel: closeModal,
    onOk: onSubmit,
    confirmLoading: loading,
  };

  const formGenProps = {
    formConfig,
    editConfig,
    ref: externalFormRef || formRef,
    edit:
      formMode === 'edit'
        ? questions.find((q) => q.id === selectedQuestion)
        : null,
    formName: 'questionForm',
  };

  if (externalFormRef) {
    return (
      <div>
        <FormGen {...formGenProps} />
      </div>
    );
  }
  if (inModal) {
    return (
      <Modal {...modalProps}>
        <FormGen {...formGenProps} />
      </Modal>
    );
  }
  return (
    <div>
      <FormGen {...formGenProps} />
      <Button type="primary" onClick={onSubmit}>
        <Translate id="createQuestion" />
      </Button>
    </div>
  );
};

QuestionForm.propTypes = propTypes;
QuestionForm.defaultProps = defaultProps;

const mapStateToProps = ({ general }) => ({ general });

export default connect(
  mapStateToProps,
  {},
)(QuestionForm);
