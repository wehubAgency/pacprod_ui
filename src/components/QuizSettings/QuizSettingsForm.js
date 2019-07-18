import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Button, message } from 'antd';
import { Translate, withLocalize } from 'react-localize-redux';
import FormGen from '../FormGen';
import iaxios from '../../axios';

const propTypes = {
  formMode: PropTypes.string.isRequired,
  general: PropTypes.shape({
    config: PropTypes.shape().isRequired,
  }).isRequired,
};

const QuizSettingsForm = ({
  general: { config },
  quiz,
  allQuiz,
  setAllQuiz,
  translate,
}) => {
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
              const index = allQuiz.findIndex((q) => q.id === res.data.id);
              const newQuiz = [...allQuiz];
              newQuiz.splice(index, 1, res.data);
              setAllQuiz(newQuiz);
              message.success(translate('success'));
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

export default compose(
  withLocalize,
  connect(
    mapStateToProps,
    {},
  ),
)(QuizSettingsForm);
