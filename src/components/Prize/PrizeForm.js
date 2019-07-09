import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'antd';
import { connect } from 'react-redux';
import { Translate } from 'react-localize-redux';
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
};

const defaultProps = {
  inModal: false,
  setModalVisible: () => {},
  modalVisible: false,
  externalFormRef: null,
};

const PrizeForm = ({
  general: { config },
  formMode,
  modalVisible,
  setModalVisible,
  inModal,
  externalFormRef,
  prizes,
  setPrizes,
  selectedPrize,
  selectPrize,
  selectedQrcode,
}) => {
  const [loading, setLoading] = useState(false);
  const [models, setModels] = useState([]);
  const { formConfig, editConfig } = config.entities.prize;
  const formRef = useRef(null);

  useEffect(() => {
    iaxios()
      .get('/prizeinfos')
      .then((res) => {
        if (res !== 'error') {
          setModels(res.data);
        }
      });
  }, []);

  const createPrize = (formData) => {
    formData.append('qrcode', selectedQrcode.id);
    iaxios()
      .post('/prizes', formData)
      .then((res) => {
        if (res !== 'error') {
          setPrizes([...prizes, res.data]);
          if (inModal) {
            setModalVisible(false);
          }
        }
        setLoading(false);
      });
  };

  const updatePrize = (formData) => {
    formData.append('_method', 'PUT');
    iaxios()
      .post(`/prizes/${selectedPrize}`, formData)
      .then((res) => {
        if (res !== 'error') {
          const prizeIndex = prizes.findIndex(p => p.id === res.data.id);
          const newPrizes = [...prizes];
          newPrizes.splice(prizeIndex, 1, res.data);
          setPrizes(newPrizes);
          if (inModal) {
            setModalVisible(false);
          }
          selectPrize('');
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
          createPrize(formData);
        } else if (formMode === 'edit') {
          updatePrize(formData);
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
    title: formMode === 'create' ? <Translate id="addPrize" /> : <Translate id="editPrize" />,
    visible: modalVisible,
    onCancel: closeModal,
    onOk: onSubmit,
    confirmLoading: loading,
    destroyOnClose: true,
  };

  const optionsModel = models.map(m => ({
    value: m.id,
    label: m.name,
  }));

  const formGenProps = {
    formConfig,
    editConfig,
    ref: externalFormRef || formRef,
    datas: { model: optionsModel },
    edit: formMode === 'edit' ? prizes.find(p => p.id === selectedPrize) : null,
    formName: 'prizeForm',
  };

  if (externalFormRef) {
    return (
      <div>
        <FormGen {...formGenProps} />
      </div>
    );
  }
  if (inModal) {
    return (
      <Modal {...modalProps}>
        <FormGen {...formGenProps} />
      </Modal>
    );
  }
  return (
    <div>
      <FormGen {...formGenProps} />
      <Button type="primary" onClick={onSubmit}>
        <Translate id="addPrize" />
      </Button>
    </div>
  );
};

PrizeForm.propTypes = propTypes;
PrizeForm.defaultProps = defaultProps;
const mapStateToProps = ({ general }) => ({ general });

export default connect(
  mapStateToProps,
  {},
)(PrizeForm);
