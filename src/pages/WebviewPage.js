import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Translate } from 'react-localize-redux';
import iaxios from '../axios';
import WebviewManager from '../components/Webview/WebviewManager';

const propTypes = {
  general: PropTypes.shape({
    currentApp: PropTypes.shape().isRequired,
    currentSeason: PropTypes.shape().isRequired,
    currentEntity: PropTypes.shape().isRequired,
  }).isRequired,
};

const _WebviewPage = ({ general: { currentApp, currentEntity, currentSeason } }) => {
  const [webviews, setWebviews] = useState([]);

  useEffect(() => {
    const ax = iaxios();

    ax.get('/webviews').then((res) => {
      console.log({ res });
      if (res !== 'error') {
        setWebviews(res.data);
      }
      return () => ax.source.cancel();
    });
  }, [currentApp, currentEntity, currentSeason]);

  return (
    <div>
      <div className="instructions">
        <h4>
          <Translate id="instructions" />
        </h4>
        <Translate id="webviewPage.instructions" />
      </div>
      <WebviewManager webviews={webviews} setWebviews={setWebviews} />
    </div>
  );
};

const mapStateToProps = ({ general }) => ({ general });

_WebviewPage.propTypes = propTypes;

export const WebviewPage = connect(
  mapStateToProps,
  {},
)(_WebviewPage);
