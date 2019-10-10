import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Modal, Checkbox } from 'antd';
import { Translate } from 'react-localize-redux';
import FormGen from '../FormGen';
import iaxios from '../../axios';

const QrcodeRules = ({
  visible, setVisible, qrcode, qrcodes, setQrcodes,
}) => {
  const { formConfig } = useSelector(({ general: { config } }) => config.entities.qrcodeRules);
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    setRules(qrcode.rules ? Object.keys(qrcode.rules) : []);
  }, [qrcode]);

  const renderOptions = () => Object.keys(formConfig).map(k => ({
    label: <Translate id={`qrcodeRules.label.${k}`} />,
    value: k,
  }));

  const checkboxChange = (checkedRules) => {
    setRules(checkedRules);
  };

  const closeModal = () => {
    setVisible(false);
    // setRules([]);
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
          .patch(`/qrcodes/${qrcode.id}/rules`, { ...data })
          .then((res) => {
            if (res !== 'error') {
              const index = qrcodes.findIndex(q => q.id === qrcode.id);
              const newQrcodes = [...qrcodes];
              newQrcodes.splice(index, 1, res.data);
              setQrcodes(newQrcodes);
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
    edit: qrcode.rules,
    formName: 'qrcodeForm',
    ref: formRef,
  };

  return (
    <Modal
      visible={visible}
      onOk={() => patchRules()}
      onCancel={closeModal}
      confirmLoading={loading}
    >
      <Translate id="qrcodeRules.instructions" />
      <Checkbox.Group options={renderOptions()} value={rules} onChange={checkboxChange} />
      <FormGen {...formProps} />
    </Modal>
  );
};

export default QrcodeRules;
