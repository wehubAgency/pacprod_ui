import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Checkbox, Button } from 'antd';
import { Translate } from 'react-localize-redux';
import FormGen from '../FormGen';
import iaxios from '../../axios';

const ARGameLinkRules = ({ argameLink, setVisible }) => {
  const { formConfig } = useSelector(({ general: { config } }) => config.entities.argamelinkRules);
  const [rules, setRules] = useState(Object.keys(argameLink.rules));
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);

  const renderOptions = () => Object.keys(formConfig).map(k => ({
    label: <Translate id={`argamerulesForm.label.${k}`} />,
    value: k,
  }));

  const checkboxChange = (checkedRules) => {
    setRules(checkedRules);
  };

  const patchRules = () => {
    setLoading(true);

    const form = formRef.current;

    form.validateFieldsAndScroll((err, values) => {
      if (err === null) {
        const data = { ...values };
        Object.entries(data).forEach(([k, v]) => {
          if (v === undefined) {
            data[k] = false;
          }
        });
        iaxios()
          .patch(`/argamelinks/${argameLink.id}/rules`, { ...data })
          .then((res) => {
            if (res !== 'error') {
              setVisible(false);
            }
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    });
  };

  const genFormConfig = () => {
    let generatedConfig = {};
    rules.forEach((r) => {
      generatedConfig = {
        ...generatedConfig,
        [r]: {
          ...formConfig[r],
          rules:
            formConfig[r].type !== 'checkbox'
              ? [
                {
                  required: true,
                  message: 'required',
                },
              ]
              : [],
        },
      };
    });
    return generatedConfig;
  };

  const formProps = {
    formConfig: genFormConfig(),
    editConfig: { excludeFields: [] },
    edit: argameLink.rules,
    formName: 'argamerulesForm',
    ref: formRef,
  };

  return (
    <div>
      <Translate id="argamerulesForm.instructions" />
      <Checkbox.Group options={renderOptions()} value={rules} onChange={checkboxChange} />
      <FormGen {...formProps} />
      <Button type="primary" loading={loading} onClick={patchRules}>
        <Translate id="editRules" />
      </Button>
    </div>
  );
};

export default ARGameLinkRules;
