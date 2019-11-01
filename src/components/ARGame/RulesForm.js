import React from 'react';
import PropTypes from 'prop-types';
import { message } from 'antd';
import { withLocalize } from 'react-localize-redux';
import Form from '../Form';
import iaxios from '../../axios';

const propTypes = {
  formMode: PropTypes.string.isRequired,
  rules: PropTypes.shape().isRequired,
  setRules: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired,
};

const RulesForm = ({
  formMode, rules, setRules, translate,
}) => {
  const editRules = (formData) => {
    formData.append('_method', 'PATCH');
    iaxios()
      .post('/argames/rules', formData)
      .then((res) => {
        if (res !== 'error') {
          setRules(res.data);
          message.success(translate('success'));
        }
      });
  };

  const formProps = {
    data: rules,
    setData: setRules,
    formMode,
    customEdit: rules,
    customUpdate: editRules,
    entityName: 'argameRules',
    formName: 'argamerulesForm',
    createText: 'editRules',
  };

  return <Form {...formProps} />;
};

RulesForm.propTypes = propTypes;

export default withLocalize(RulesForm);
