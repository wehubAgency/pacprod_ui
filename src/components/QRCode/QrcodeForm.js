import React from 'react';
import PropTypes from 'prop-types';
import { message } from 'antd';
import { Translate } from 'react-localize-redux';
import QRCode from 'qrcode';
import generateRandomString from '../../services/generateRandomString';
import iaxios from '../../axios';
import Form from '../Form';

const propTypes = {
  inModal: PropTypes.bool,
  setModalVisible: PropTypes.func,
  modalVisible: PropTypes.bool,
  externalFormRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.oneOfType([PropTypes.instanceOf(Element), () => null]) }),
  ]),
  formMode: PropTypes.string.isRequired,
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
  qrcodes, setQrcodes, selectQrcode, selectedQrcode, ...props
}) => {
  const createQrcode = async (formData) => {
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
    const res = await iaxios().post('/qrcodes', formData);
    if (res !== 'error') {
      setQrcodes([...qrcodes, res.data]);
      selectQrcode(res.data.id);
      return true;
    }
    return false;
  };

  const formProps = {
    ...props,
    data: qrcodes,
    setData: setQrcodes,
    selectedData: selectedQrcode,
    entityName: 'qrcode',
    formName: 'qrcodeForm',
    customCreate: createQrcode,
    updateUrl: `/qrcodes/${selectedQrcode}`,
    modalTitle:
      props.formMode === 'create' ? <Translate id="createQrcode" /> : <Translate id="editQrcode" />,
    createText: <Translate id="createQrcode" />,
  };

  return <Form {...formProps} />;
};

QrcodeForm.propTypes = propTypes;
QrcodeForm.defaultProps = defaultProps;

export default QrcodeForm;
