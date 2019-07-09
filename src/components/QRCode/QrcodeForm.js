import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, message } from 'antd';
import { connect } from 'react-redux';
import { Translate } from 'react-localize-redux';
import QRCode from 'qrcode';
import generateRandomString from '../../services/generateRandomString';
import formateData from '../../services/formateData';
import FormGen from '../FormGen';
import iaxios from '../../axios';

const propTypes = {
  inModal: PropTypes.bool,
  setModalVisible: PropTypes.func,
  modalVisible: PropTypes.bool,
  externalFormRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.oneOfType([PropTypes.instanceOf(Element), () => null]) }),
  ]),
  formMode: PropTypes.string.isRequired,
  general: PropTypes.shape({
    config: PropTypes.shape().isRequired,
  }).isRequired,
  selectedQrcode: PropTypes.string.isRequired,
  selectQrcode: PropTypes.func.isRequired,
};

const defaultProps = {
  inModal: false,
  setModalVisible: () => {},
  modalVisible: false,
  externalFormRef: null,
};

const QrcodeForm = ({
  general: { config },
  formMode,
  modalVisible,
  setModalVisible,
  inModal,
  externalFormRef,
  qrcodes,
  setQrcodes,
  selectQrcode,
  selectedQrcode,
}) => {
  const [loading, setLoading] = useState(false);
  const { formConfig, editConfig } = config.entities.qrcode;
  const formRef = useRef(null);

  const createQrcode = (formData) => {
    const code = generateRandomString(26);

    let image;
    QRCode.toString(
      code,
      {
        errorCorrectionLevel: 'H',
        type: 'svg',
      },
      (err, string) => {
        if (err) message.error(<Translate id="qrcodeForm.failQrcodeGen" />);
        else image = string;
      },
    );
    formData.append('code', code);
    formData.append('image', image);
    iaxios()
      .post('/qrcodes', formData)
      .then((res) => {
        if (res !== 'error') {
          setQrcodes([...qrcodes, res.data]);
          if (inModal) {
            setModalVisible(false);
          }
          selectQrcode(res.data.id);
        }
        setLoading(false);
      });
  };

  const updateQrcode = (formData) => {
    formData.append('_method', 'PUT');
    iaxios()
      .post(`/qrcodes/${selectedQrcode}`, formData)
      .then((res) => {
        if (res !== 'error') {
          const qrcodeIndex = qrcodes.findIndex(p => p.id === res.data.id);
          const newQrcodes = [...qrcodes];
          newQrcodes.splice(qrcodeIndex, 1, res.data);
          setQrcodes(newQrcodes);
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
    form.validateFieldsAndScroll((err, values) => {
      if (err === null) {
        const data = { ...values };
        const formData = formateData(data);
        if (formMode === 'create') {
          createQrcode(formData);
        } else if (formMode === 'edit') {
          updateQrcode(formData);
        }
      } else {
        setLoading(false);
      }
    });
  };

  const closeModal = () => {
    const form = formRef.current;
    if (formMode === 'edit') {
      form.resetFields();
    }
    if (inModal) {
      setModalVisible(false);
    }
  };

  const modalProps = {
    title: formMode === 'create' ? <Translate id="createQrcode" /> : <Translate id="editQrcode" />,
    visible: modalVisible,
    onCancel: closeModal,
    onOk: onSubmit,
    confirmLoading: loading,
    destroyOnClose: true,
  };

  const formGenProps = {
    formConfig,
    editConfig,
    ref: externalFormRef || formRef,
    edit: formMode === 'edit' ? qrcodes.find(p => p.id === selectedQrcode) : null,
    formName: 'qrcodeForm',
  };

  if (externalFormRef) {
    return (
      <div>
        <Translate id="qrcodeForm.instructions" />
        <FormGen {...formGenProps} />
      </div>
    );
  }
  if (inModal) {
    return (
      <Modal {...modalProps}>
        <Translate id="qrcodeForm.instructions" />
        <FormGen {...formGenProps} />
      </Modal>
    );
  }
  return (
    <div>
      <FormGen {...formGenProps} />
      <Button type="primary" onClick={onSubmit}>
        <Translate id="qrcodeForm.instructions" />
        <Translate id="createQrcode" />
      </Button>
    </div>
  );
};

QrcodeForm.propTypes = propTypes;
QrcodeForm.defaultProps = defaultProps;
const mapStateToProps = ({ general }) => ({ general });

export default connect(
  mapStateToProps,
  {},
)(QrcodeForm);
