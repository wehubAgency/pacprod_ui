import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from 'antd';
import { Translate } from 'react-localize-redux';
import FormGen from '../FormGen';
import iaxios from '../../axios';

const propTypes = {
  formMode: PropTypes.string.isRequired,
  general: PropTypes.shape({
    config: PropTypes.shape().isRequired,
  }).isRequired,
};

const QuizSettingsForm = ({ general: { config }, setQuiz, quiz }) => {
  const [loading, setLoading] = useState(false);
  const { formConfig, editConfig } = config.entities.quizSettings;
  const formRef = useRef(null);

  const updateQuizSettings = (e) => {
    setLoading(true);

    const form = formRef.current;

    e.preventDefault();
    form.validateFields((err, values) => {
      if (err === null) {
        iaxios()
          .patch(`/quiz/${quiz.id}/settings`, { ...values })
          .then((res) => {
            if (res !== 'error') {
              setQuiz(res.data);
              form.resetFields();
            }
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    });
  };

  const formGenProps = {
    formConfig,
    editConfig,
    edit: quiz.settings,
    formName: 'quizSettingsForm',
    ref: formRef,
  };

  return (
    <div>
      <FormGen {...formGenProps} />
      <Button type="primary" onClick={updateQuizSettings} loading={loading}>
        <Translate id="update" />
      </Button>
    </div>
  );
};

QuizSettingsForm.propTypes = propTypes;

const mapStateToProps = ({ general }) => ({ general });

export default connect(
  mapStateToProps,
  {},
)(QuizSettingsForm);
