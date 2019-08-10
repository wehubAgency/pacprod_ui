import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { API_URI } from '../../constants';

const propTypes = {
  webview: PropTypes.shape({
    title: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  }).isRequired,
};

const WebviewPreview = ({ webview }) => {
  const [random, setRandom] = useState(0);

  /* disable-eslint-next-line */
  useEffect(() => setRandom(random + 1), [webview]);

  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        paddingTop: '78%',
        width: 300,
        height: 0,
        margin: '0 auto',
        border: '1px solid lightgray',
      }}
    >
      <iframe
        key={random}
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          width: '100%',
          height: '100%',
          border: 0,
        }}
        title={webview.title}
        src={webview.url ? webview.url : `${API_URI}webview/${webview.id}`}
      />
    </div>
  );
};

WebviewPreview.propTypes = propTypes;

export default WebviewPreview;
