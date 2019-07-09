import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Translate } from 'react-localize-redux';
import CircusForm from '../components/Circus/CircusForm';
import FlashAppForm from '../components/FlashApp/FlashAppForm';

const propTypes = {
  general: PropTypes.shape({
    currentApp: PropTypes.shape(),
  }).isRequired,
};

const HomePage = ({ general: { currentApp } }) => {
  let content;

  const initForm = () => {
    switch (currentApp.type) {
      case 'circus':
        return <CircusForm formMode="create" />;
      case 'flashapp':
        return <FlashAppForm formMode="create" />;
      default:
        return <p>Une erreur est survenue.</p>;
    }
  };

  if (currentApp && !currentApp.initialized) {
    content = (
      <div>
        <h2>
          <Translate id="homePage.h2" />
        </h2>
        <p>
          <Translate id={`homePage.infos${currentApp.type}`} />
        </p>
        {initForm()}
      </div>
    );
  }

  return (
    <div>
      <h1>
        <Translate id="homePage.h1" />
      </h1>
      {content}
    </div>
  );
};

const mapStateToProps = ({ general }) => ({ general });
HomePage.propTypes = propTypes;

export default connect(
  mapStateToProps,
  {},
)(HomePage);
