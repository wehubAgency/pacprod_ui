import React from 'react';
import PropTypes from 'prop-types';
import WebviewPreview from './WebviewPreview';
import WebviewActions from './WebviewActions';

const propTypes = {
  webview: PropTypes.shape().isRequired,
  openModal: PropTypes.func.isRequired,
  webviews: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  setWebviews: PropTypes.func.isRequired,
  selectWebview: PropTypes.func.isRequired,
};

const WebviewInfos = ({
  webview, openModal, webviews, setWebviews, selectWebview,
}) => (
  <div>
    <WebviewActions
      webview={webview}
      openModal={openModal}
      webviews={webviews}
      setWebviews={setWebviews}
      selectWebview={selectWebview}
    />
    <WebviewPreview webview={webview} />
  </div>
);

WebviewInfos.propTypes = propTypes;

export default WebviewInfos;
