import React, { useState, useRef } from 'react';
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
  coins: PropTypes.arrayOf(PropTypes.shape()),
  setCoins: PropTypes.func,
  selectedCoin: PropTypes.string,
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
  coins: [],
  setCoins: () => {},
  selectedCoin: '',
};

const CoinForm = ({
  general: { config },
  formMode,
  modalVisible,
  setModalVisible,
  inModal,
  externalFormRef,
  coins,
  setCoins,
  selectedCoin,
}) => {
  const [loading, setLoading] = useState(false);
  const { formConfig, editConfig } = config.entities.coin;
  const formRef = useRef(null);

  const createCoin = (formData) => {
    iaxios()
      .post('/coins', formData)
      .then((res) => {
        if (res !== 'error') {
          setCoins([...coins, res.data]);
          if (inModal) {
            setModalVisible(false);
          }
        }
        setLoading(false);
      });
  };

  const updateCoin = (formData) => {
    formData.append('_method', 'PUT');
    iaxios()
      .post(`/coin/${selectedCoin}`, formData)
      .then((res) => {
        if (res !== 'error') {
          const coinIndex = coins.findIndex(c => c.id === res.data.id);
          const newCoins = [...coins];
          newCoins.splice(coinIndex, 1, res.data);
          setCoins(newCoins);
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
          createCoin(formData);
        } else if (formMode === 'edit') {
          updateCoin(formData);
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
    title: formMode === 'create' ? <Translate id="createCoin" /> : <Translate id="editCoin" />,
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
    edit: formMode === 'edit' ? coins.find(c => c.id === selectedCoin) : null,
    formName: 'coinForm',
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
        <Translate id="createCoin" />
      </Button>
    </div>
  );
};

CoinForm.propTypes = propTypes;
CoinForm.defaultProps = defaultProps;
const mapStateToProps = ({ general }) => ({ general });

export default connect(
  mapStateToProps,
  {},
)(CoinForm);
