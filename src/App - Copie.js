import React, { useState, useEffect } from 'react';
import { HashRouter as Router } from 'react-router-dom';
import { connect } from 'react-redux';
import { LocaleProvider, Spin } from 'antd';
import PropTypes from 'prop-types';
import { LocalizeProvider } from 'react-localize-redux';
import AdminLayout from './layout/AdminLayout';
import LoginPage from './pages/LoginPage';
import iaxios from './axios';

const propTypes = {
  general: PropTypes.shape({
    locale: PropTypes.object.isRequired,
  }).isRequired,
};

const App = ({ general: { locale } }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setFetching(true);
      iaxios()
        .get(`checktoken`)
        .then((res) => {
          if (res.data === 'OK') {
            setAuthenticated(true);
          }
          setFetching(false);
        });
    }
  }, []);

  return (
    <LocalizeProvider>
      <LocaleProvider locale={locale}>
        {fetching ? (
          <Spin size="large" className="absolute-centered" />
        ) : !authenticated ? (
          <LoginPage setAuthenticated={setAuthenticated} />
        ) : (
          <Router>
            <AdminLayout />
          </Router>
        )}
      </LocaleProvider>
    </LocalizeProvider>
  );
};

const mapStateToProps = ({ general }) => ({ general });
App.propTypes = propTypes;

export default connect(
  mapStateToProps,
  {},
)(App);
