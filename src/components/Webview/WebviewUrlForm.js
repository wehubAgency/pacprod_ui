import React from 'react';
import PropTypes from 'prop-types';
import { Translate } from 'react-localize-redux';
import Form from '../Form';

const propTypes = {
  inModal: PropTypes.bool,
  setModalVisible: PropTypes.func,
  modalVisible: PropTypes.bool,
  webviews: PropTypes.arrayOf(PropTypes.shape()),
  setWebviews: PropTypes.func,
  selectedWebview: PropTypes.string,
  externalFormRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]),
  general: PropTypes.shape({
    config: PropTypes.shape().isRequired,
  }).isRequired,
};

const defaultProps = {
  inModal: false,
  setModalVisible: () => {},
  modalVisible: false,
  externalFormRef: null,
  webviews: [],
  setWebviews: () => {},
  selectedWebview: '',
};

const WebviewForm = ({
  webviews, setWebviews, selectedWebview, ...props
}) => {
  const formProps = {
    ...props,
    data: webviews,
    setData: setWebviews,
    selectedData: selectedWebview,
    entityName: 'webviewUrl',
    formName: 'webviewForm',
    createUrl: '/webviews',
    updateUrl: `/webviews/${selectedWebview}`,
    modalTitle:
      props.formMode === 'create' ? (
        <Translate id="createWebview" />
      ) : (
        <Translate id="editWebview" />
      ),
  };

  return <Form {...formProps} />;
};

WebviewForm.propTypes = propTypes;
WebviewForm.defaultProps = defaultProps;

export default WebviewForm;
