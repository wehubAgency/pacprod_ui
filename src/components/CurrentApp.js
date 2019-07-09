import React from 'react';
import PropTypes from 'prop-types';
import { Translate } from 'react-localize-redux';
import { connect } from 'react-redux';
import styles from '../styles/CurrentApp.style';

const propTypes = {
  general: PropTypes.shape({
    currentApp: PropTypes.object,
  }),
};
const defaultProps = {
  general: {
    currentApp: null,
  },
};

const CurrentApp = ({ general: { currentApp } }) => {
  const displayChooseApp = () => (
    <h1 style={{ color: 'white' }}>
      <Translate id="currentApp.choose" />
    </h1>
  );

  const displayAppInfos = () => (
    <div>
      {currentApp.logo && <img src={currentApp.logo} alt={currentApp.name} />}
      <h1 style={{ color: 'white' }}>{currentApp.name}</h1>
    </div>
  );

  const { containerStyle } = styles;

  return (
    <div style={containerStyle}>{currentApp !== null ? displayAppInfos() : displayChooseApp()}</div>
  );
};

CurrentApp.propTypes = propTypes;
CurrentApp.defaultProps = defaultProps;

const mapStateToProps = ({ general }) => ({ general });

export default connect(
  mapStateToProps,
  {},
)(CurrentApp);
