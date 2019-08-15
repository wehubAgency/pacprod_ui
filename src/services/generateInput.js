import React from 'react';
import { Translate } from 'react-localize-redux';
import {
  Input, Select, Checkbox, InputNumber, DatePicker, TimePicker, Switch, Radio,
} from 'antd';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertFromRaw } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import TargetTime from '../components/TargetTime/TargetTime';
import Map from '../components/Map';
import FormTransfer from '../components/FormTransfer';
import UploadFile from '../components/UploadFile';

const { TextArea } = Input;

const getMapChanges = (markers, form) => {
  if (markers.length > 0) {
    const marker = markers[0];

    form.setFieldsValue({
      lat: marker.lat,
      lng: marker.lng,
    });
  }
};

export default (key, item, i, data, form, formName, edit) => {
  const attributes = { ...item.attributes };

  switch (item.type) {
    case 'text':
      return <Input addonBefore={item.number > 1 ? +i + 1 : ''} {...attributes} />;
    case 'number':
      return <InputNumber {...attributes} />;
    case 'textarea':
      return <TextArea {...attributes} />;
    case 'select': {
      const options = data || item.options;
      console.log(options);
      return (
        <Select {...item.attributes}>
          {options.map(o => (
            <Select.Option key={o.value} value={o.value}>
              {(data && <Translate id={`${formName}.options.${o.label}`}>{o.label}</Translate>)
                || o.label}
            </Select.Option>
          ))}
        </Select>
      );
    }
    case 'checkboxgrp': {
      const optionsDatas = data || attributes.options;
      const options = optionsDatas.map(o => ({
        label: <Translate id={`${formName}.options.${o.label}`} />,
        value: o.value,
      }));
      return <Checkbox.Group options={options} />;
    }
    case 'radiogrp': {
      const optionsDatas = data || attributes.options;
      const options = optionsDatas.map(o => ({
        label: <Translate id={`${formName}.options.${o.label}`} />,
        value: o.value,
      }));
      return <Radio.Group options={options} />;
    }
    case 'checkbox': {
      return <Switch defaultChecked={edit ? edit[key] : false} {...attributes} />;
    }
    case 'timeslot': {
      return (
        <TargetTime
          week={edit ? edit[item.hiddenInput] : null}
          onChange={(week) => {
            form.setFieldsValue({ [item.hiddenInput]: week });
          }}
          onInit={(week) => {
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
    case 'upload': {
      const props = {
        elKey: key,
        item,
        edit,
        form,
      };
      return <UploadFile {...props} />;
    }
    case 'hidden':
      return <Input type="hidden" />;
    case 'transfer': {
      return (
        <FormTransfer
          form={form}
          hiddenInput={item.hiddenInput}
          dataSource={data}
          titles={item.titles}
          initialTargetKeys={edit ? edit[item.hiddenInput] : []}
          render={el => (
            <span key={el.id}>
              {el[item.render]} {!el.enabled ? <Translate id="disabled" /> : ''}
            </span>
          )}
        />
      );
    }
    case 'map':
      return (
        <div>
          <Map
            canSetMarkers={1}
            checkChanges={markers => getMapChanges(markers, form)}
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
    case 'wysiwyg': {
      let content;
      if (edit) {
        content = EditorState.createWithContent(convertFromRaw(JSON.parse(edit[key])));
      } else {
        content = EditorState.createEmpty();
      }
      return <Editor defaultEditorState={content} />;
    }
    default:
      throw new Error('Erreur de configuration dans le formulaire');
  }
};
