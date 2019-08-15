import React from 'react';
import PropTypes from 'prop-types';
import { Translate } from 'react-localize-redux';
import Form from '../Form';

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
  coins, setCoins, selectedCoin, ...props
}) => {
  const formProps = {
    ...props,
    entityName: 'coin',
    data: coins,
    setData: setCoins,
    selectedData: selectedCoin,
    createUrl: '/coins',
    updateUrl: `/coins/${selectedCoin}`,
    formName: 'coinForm',
    modalTitle:
      props.formMode === 'create' ? <Translate id="createCoin" /> : <Translate id="editCoin" />,
  };

  return <Form {...formProps} />;
};

CoinForm.propTypes = propTypes;
CoinForm.defaultProps = defaultProps;

export default CoinForm;
