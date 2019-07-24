import React, { useState, useEffect } from 'react';
import { Translate } from 'react-localize-redux';
import {
  Form,
  Input,
  Select,
  Row,
  Col,
  Checkbox,
  InputNumber,
  Modal,
  DatePicker,
  TimePicker,
  Switch,
  Radio,
} from 'antd';
import TargetTime from './TargetTime/TargetTime';
import Map from './Map';
import moment from '../moment';
import DeleteFile from './DeleteFile';
import styles from '../styles/components/FormGen.style';
import UploadFile from './UploadFile';

const { TextArea } = Input;

const FormGen = ({
  formConfig, form, edit, editConfig, datas, formName,
}) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewSettings, setPreviewSettings] = useState({});
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
            values[key] = edit[editKey].id;
          } else if (el.type === 'date') {
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
        message: <Translate id="rules.pattern" data={{ exemple: r.exemple }} />,
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
        [`${property}ToDelete`]: Array.isArray(actualValue) ? [...actualValue, url] : [url],
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

  const getMapChanges = (markers) => {
    if (markers.length > 0) {
      const marker = markers[0];

      form.setFieldsValue({
        lat: marker.lat,
        lng: marker.lng,
      });
    }
  };

  const generateInput = (key, item, i) => {
    const attributes = { ...item.attributes };

    switch (item.type) {
      case 'text':
        return <Input addonBefore={item.number > 1 ? +i + 1 : ''} {...attributes} />;
      case 'number':
        return <InputNumber {...attributes} />;
      case 'textarea':
        return <TextArea {...attributes} />;
      case 'select': {
        const options = datas[key] || item.options;
        return (
          <Select {...item.attributes}>
            {options.map(o => (
              <Select.Option key={o.value} value={o.value}>
                {(datas[key] && (
                  <Translate id={`${formName}.options.${o.label}`}>{o.label}</Translate>
                ))
                  || o.label}
              </Select.Option>
            ))}
          </Select>
        );
      }
      case 'checkboxgrp': {
        const optionsDatas = (datas && datas[key]) || attributes.options;
        const options = optionsDatas.map(o => ({
          label: <Translate id={`${formName}.options.${o.label}`} />,
          value: o.value,
        }));
        return <Checkbox.Group options={options} />;
      }
      case 'radiogrp': {
        const optionsDatas = (datas && datas[key]) || attributes.options;
        const options = optionsDatas.map(o => ({
          label: <Translate id={`${formName}.options.${o.label}`} />,
          value: o.value,
        }));
        return <Radio.Group options={options} />;
      }
      case 'checkbox': {
        return <Switch defaultChecked={edit ? edit[key] : false} {...attributes} />;
      }
      case 'upload': {
        const props = {
          elKey: key,
          item,
          edit,
          form,
          setPreviewImage,
          setPreviewSettings,
          setPreviewVisible,
        };
        return <UploadFile {...props} />;
      }
      case 'timeslot': {
        return (
          <TargetTime
            week={edit ? edit[item.hiddenInput] : null}
            onChange={(week) => {
              form.setFieldsValue({ [item.hiddenInput]: week });
            }}
          />
        );
      }
      case 'date':
        return <DatePicker {...item.props} />;
      case 'time': {
        return <TimePicker {...item.props} />;
      }
      case 'hidden':
        return <Input type="hidden" />;
      case 'map':
        return (
          <div>
            <Map
              canSetMarkers={1}
              checkChanges={getMapChanges}
              radius={form.getFieldValue('radius')}
              markers={
                edit
                  ? [
                    {
                      lng: edit.location.coordinates[0],
                      lat: edit.location.coordinates[1],
                    },
                  ]
                  : []
              }
            />
          </div>
        );
      default:
        throw new Error('Erreur de configuration dans le formulaire');
    }
  };

  const renderItems = () => {
    const formFields = { ...formConfig };
    if (edit) {
      const { excludeFields } = editConfig;
      excludeFields.forEach(f => delete formFields[f]);
    }

    return Object.entries(formFields).map(([key, el]) => {
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
          <Col key={itemKey} span={24} lg={{ span: itemNumber > 1 ? 12 : 24 }}>
            {edit !== null && el.type === 'upload' && edit[key] && (
              <div>
                <Item key={`${itemKey}ToDelete`}>
                  {getFieldDecorator(`${itemKey}ToDelete`, {})(
                    generateInput(`${key}ToDelete`, { type: 'hidden' }, i),
                  )}
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
              extra={el.help ? <Translate id={`${formName}.help.${el.help}`} /> : ''}
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
              })(generateInput(key, el, i))}
            </Item>
          </Col>,
        );
      }
      return (
        <Row key={key} type="flex" gutter={16} align="bottom">
          {cols}
        </Row>
      );
    });
  };

  const { previewStyle } = styles;
  return (
    <>
      <Form layout="vertical">{renderItems()}</Form>

      <Modal visible={previewVisible} footer={null} onCancel={() => setPreviewVisible(false)}>
        <div
          style={{
            backgroundImage: `url(${previewImage})`,
            ...previewStyle,
            ...previewSettings,
          }}
        />
      </Modal>
    </>
  );
};

export default Form.create({ name: 'form_gen' })(FormGen);
