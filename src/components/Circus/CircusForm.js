import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { Translate } from 'react-localize-redux';
import Form from '../Form';
import { addEntity, updateEntity } from '../../actions';

const propTypes = {
  inModal: PropTypes.bool,
  formMode: PropTypes.string.isRequired,
  modalVisible: PropTypes.bool,
  setModalVisible: PropTypes.func,
  externalFormRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.oneOfType([PropTypes.instanceOf(Element), () => null]) }),
  ]),
  circus: PropTypes.object.isRequired,
};

const defaultProps = {
  inModal: false,
  modalVisible: false,
  setModalVisible: () => {},
  externalFormRef: null,
};

const CircusForm = ({
  inModal,
  formMode,
  modalVisible,
  setModalVisible,
  externalFormRef,
  circus,
}) => {
  const currentAppId = useSelector(({ general: { currentApp } }) => currentApp.id);
  const dispatch = useDispatch();

  const formProps = {
    formMode,
    inModal,
    modalVisible,
    setModalVisible,
    ref: externalFormRef,
    createData: {
      app: currentAppId,
    },
    createCallback: (_, res) => {
      dispatch(addEntity(res.data));
      document.location.reload(true);
    },
    updateData: {
      app: currentAppId,
    },
    updateCallback: (_, res) => {
      dispatch(updateEntity(res.data));
    },
    customEdit: circus,
    createUrl: '/circus',
    updateUrl: `/circus/${circus.id}`,
    formName: 'circusForm',
    modalTitle:
      formMode === 'create' ? <Translate id="createCircus" /> : <Translate id="editCircus" />,
    createText: <Translate id="createCircus" />,
    entityName: 'circus',
  };

  return <Form {...formProps} />;
};

CircusForm.propTypes = propTypes;
CircusForm.defaultProps = defaultProps;

export default CircusForm;
