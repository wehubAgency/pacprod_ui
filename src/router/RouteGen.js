import React from 'react';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { withRouter, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import * as Pages from '../pages';
import HomePage from '../pages/HomePage';
import NoMatch from '../pages/NoMatch';
import getFeatures from '../services/getFeatures';

const propTypes = {
  general: PropTypes.shape({
    currentApp: PropTypes.object,
  }).isRequired,
};

const RouteGen = ({ general }) => {
  const {
    currentApp,
    currentEntity,
    config: { routing },
    role,
    apps,
  } = general;

  const createRouters = () => {
    const { features } = currentApp;
    const { common } = routing;
    const allFeatures = getFeatures(features, common, currentApp.type, role);

    const routes = [];
    if (currentApp.initialized) {
      allFeatures.forEach((f) => {
        if (routing[f].routes) {
          Object.entries(routing[f].routes).forEach(([key, route]) => {
            routes.push(
              <Route
                key={key}
                path={route.path}
                component={Pages[route.page]}
              />,
            );
          });
        } else {
          const { key, path, page, exact } = routing[f];
          routes.push(
            <Route
              key={key}
              exact={exact}
              path={path}
              component={Pages[page]}
            />,
          );
        }
      });
    }
    return routes;
  };

  if (currentApp && currentEntity) {
    return (
      <Switch>
        {createRouters()}
        <Route path="/" component={HomePage} />;
        <Route key="nomatch" component={NoMatch} />
      </Switch>
    );
  }
  if (role === 'super_admin' && apps.length === 0) {
    return <Pages.AppsPage />;
  }
  return <HomePage />;
};

const mapStateToProps = ({ general }) => ({ general });

RouteGen.propTypes = propTypes;

export default compose(
  withRouter,
  connect(
    mapStateToProps,
    {},
  ),
)(RouteGen);
