import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { Translate } from 'react-localize-redux';
import { addEntity, updateEntity } from '../../actions';
import Form from '../Form';

const propTypes = {
  inModal: PropTypes.bool,
  setModalVisible: PropTypes.func,
  modalVisible: PropTypes.bool,
  externalFormRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]),
  formMode: PropTypes.string.isRequired,
  flashApp: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};

const defaultProps = {
  inModal: false,
  setModalVisible: () => {},
  modalVisible: false,
  externalFormRef: null,
};

const FlashAppForm = ({ flashApp, ...props }) => {
  const currentAppId = useSelector(({ general: { currentApp } }) => currentApp.id);
  const dispatch = useDispatch();

  const formProps = {
    ...props,
    createData: { app: currentAppId },
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
    customEdit: { ...flashApp, ...flashApp.address },
    createUrl: '/flashapps',
    updateUrl: `/flashapps/${flashApp.id}`,
    formName: 'flashAppForm',
    modalTitle:
      props.formMode === 'create' ? (
        <Translate id="createFlashApp" />
      ) : (
        <Translate id="editFlashApp" />
      ),
    entityName: 'flashApp',
  };

  return <Form {...formProps} />;
};

FlashAppForm.propTypes = propTypes;
FlashAppForm.defaultProps = defaultProps;

export default FlashAppForm;
