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
  allQuiz: PropTypes.arrayOf(PropTypes.object).isRequired,
  setAllQuiz: PropTypes.func.isRequired,
  selectedQuiz: PropTypes.string.isRequired,
  selectQuiz: PropTypes.func.isRequired,
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

const QuizForm = ({
  general: { config },
  formMode,
  modalVisible,
  setModalVisible,
  allQuiz,
  setAllQuiz,
  selectedQuiz,
  selectQuiz,
  inModal,
  externalFormRef,
}) => {
  const [loading, setLoading] = useState(false);
  const { formConfig, editConfig } = config.entities.quiz;
  const formRef = useRef(null);

  useEffect(() => {
    const form = formRef.current;
    if (form && formMode === 'create') {
      form.resetFields();
    }
  }, [formMode]);

  const createQuiz = (formData, form) => {
    iaxios()
      .post('/quiz', formData)
      .then((res) => {
        if (res !== 'error') {
          setAllQuiz([...allQuiz, res.data]);
          if (inModal) {
            setModalVisible(false);
          }
          selectQuiz(res.data.id);
          form.resetFields();
        }
        setLoading(false);
      });
  };

  const updateQuiz = (formData, form) => {
    formData.append('_method', 'PUT');
    iaxios()
      .post(`/quiz/${selectedQuiz}`, formData)
      .then((res) => {
        if (res !== 'error') {
          const quizIndex = allQuiz.findIndex(q => q.id === res.data.id);
          const newQuiz = [...allQuiz];
          newQuiz.splice(quizIndex, 1, res.data);
          form.resetFields();
          setAllQuiz(newQuiz);
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
          createQuiz(formData, form);
        } else if (formMode === 'edit') {
          updateQuiz(formData, form);
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
    title: formMode === 'create' ? <Translate id="createQuiz" /> : <Translate id="editQuiz" />,
    visible: modalVisible,
    onCancel: closeModal,
    onOk: onSubmit,
    confirmLoading: loading,
  };

  const formGenProps = {
    formConfig,
    editConfig,
    ref: externalFormRef || formRef,
    edit: formMode === 'edit' ? allQuiz.find(q => q.id === selectedQuiz) : null,
    formName: 'quizForm',
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
        <Translate id="createQuiz" />
      </Button>
    </div>
  );
};

QuizForm.propTypes = propTypes;
QuizForm.defaultProps = defaultProps;

const mapStateToProps = ({ general }) => ({ general });

export default connect(
  mapStateToProps,
  {},
)(QuizForm);
