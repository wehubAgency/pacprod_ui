import React, { useEffect } from 'react';
import { compose } from 'redux';
import { Translate, withLocalize } from 'react-localize-redux';
import { Form, Row, Col } from 'antd';
import moment from '../moment';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import DeleteFile from './DeleteFile';
import generateInput from '../services/generateInput';
import checkConditions from '../services/checkConditions';

const defaultProps = {
  data: {},
};

const FormGen = ({
 formConfig, form, edit, editConfig, data, formName 
}) => {
  const { getFieldDecorator, getFieldError } = form;
  const { Item } = Form;

  useEffect(() => {
    if (edit) {
      const { excludeFields } = editConfig;

      const values = {};
      Object.entries(formConfig).forEach(([key, el]) => {
        let editKey = key;
        if (key.match(/\w*\[\]/)) {
          editKey = key.slice(0, -2);
        }
        if (el.type !== 'upload' && excludeFields.indexOf(key) === -1) {
          if (el.type === 'select') {
            if (edit[editKey]) {
              values[key] = edit[editKey].id ? edit[editKey].id : edit[editKey];
            }
          } else if (el.type === 'date' && edit[editKey]) {
            values[key] = moment(edit[editKey]);
          } else {
            values[key] = edit[editKey];
          }
        }
      });
      form.setFieldsValue(values);
    }
    /* eslint-disable-next-line */
  }, [edit]);

  const generateRules = ({ rules = [], type }, key) => rules.reduce((result, r) => {
      if ('pattern' in r) {
        result.push({
          pattern: RegExp(r.pattern, r.flags),
          message: (
            <Translate id="rules.pattern" data={{ exemple: r.exemple }} />
          ),
        });
      } else if ('max' in r) {
        result.push({
          ...r,
          message: <Translate id="rules.max" data={{ max: r.max }} />,
        });
      } else if (edit && type === 'upload' && 'required' in r) {
        if (
          form.getFieldValue(`${key}ToDelete`)
          && form.getFieldValue(`${key}ToDelete`).length > 0
        ) {
          result.push({ ...r, message: <Translate id="rules.required" /> });
        } else {
          return result;
        }
      } else {
        result.push({ ...r, message: <Translate id={`rules.${r.message}`} /> });
      }
      return result;
    }, []);

  const onFileUpdate = (url, property, active) => {
    const actualValue = form.getFieldValue(`${property}ToDelete`);
    if (active) {
      form.setFieldsValue({
        [`${property}ToDelete`]: Array.isArray(actualValue)
          ? [...actualValue, url]
          : [url],
      });
    } else {
      const index = actualValue.indexOf(url);
      const newValue = [...actualValue];
      newValue.splice(index, 1);
      form.setFieldsValue({ [`${property}ToDelete`]: newValue });
    }
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const renderItems = () => {
    const formFields = { ...formConfig };
    if (edit) {
      const { excludeFields } = editConfig;
      excludeFields.forEach(f => delete formFields[f]);
    }

    return Object.entries(formFields).map(([key, el]) => {
      let testConditions = true;
      if (el.conditions && el.conditions.length > 0) {
        const formValues = form.getFieldsValue();

        testConditions = checkConditions(el, formValues);
      }

      // if (testConditions) {
      const itemNumber = el.number || 1;
      const cols = [];
      const custom = {};
      if (el.type === 'upload') {
        custom.valuePropName = 'fileList';
        custom.getValueFromEvent = normFile;
      }
      for (let i = 0; i < itemNumber; i += 1) {
        const itemKey = itemNumber > 1 ? `${key}[${i}]` : key;
        cols.push(
          <Col
            // style={{ visibility: testConditions ? 'visible' : 'hidden' }}
            style={{ display: testConditions ? 'block' : 'none' }}
            key={itemKey}
            span={24}
            lg={{ span: itemNumber > 1 ? 12 : 24 }}
          >
            {edit !== null && el.type === 'upload' && edit[key] && (
              <div>
                <Item key={`${itemKey}ToDelete`}>
                  {getFieldDecorator(
                    `${itemKey}ToDelete`,
                    {},
                  )(generateInput(`${key}ToDelete`, { type: 'hidden' }, i))}
                </Item>
                <DeleteFile
                  onFileUpdate={onFileUpdate}
                  files={edit[key]}
                  filesToDelete={form.getFieldValue(`${key}ToDelete`)}
                  property={key}
                />
              </div>
            )}
            <Item
              key={itemKey}
              validateStatus={getFieldError(itemKey) ? 'error' : ''}
              extra={
                el.help ? <Translate id={`${formName}.help.${el.help}`} /> : ''
              }
              label={
                i === 0 && el.type !== 'hidden' ? (
                  <Translate id={`${formName}.label.${el.label}`} />
                ) : (
                  ''
                )
              }
            >
              {getFieldDecorator(itemKey, {
                rules: generateRules(el, key),
                initialValue: el.initialValue,
                ...custom,
              })(generateInput(key, el, i, data[key], form, formName, edit))}
            </Item>
          </Col>,
        );
      }
      return (
        <Row key={key} type="flex" gutter={16} align="bottom">
          {cols}
        </Row>
      );
      // }
      // return false;
    });
  };

  return (
    <>
      <Form layout="vertical">{renderItems()}</Form>
    </>
  );
};

FormGen.defaultProps = defaultProps;

export default compose(
  Form.create({ name: 'form_gen' }),
  withLocalize,
)(FormGen);
