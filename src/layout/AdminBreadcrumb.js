import React from 'react';
import { Breadcrumb } from 'antd';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Translate } from 'react-localize-redux';

const proptypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  general: PropTypes.shape({
    config: PropTypes.object.isRequired,
  }).isRequired,
};

const AdminBreadcrumb = ({ location, general: { config } }) => {
  const breadcrumbNameMap = {};
  if (Object.entries(config).length > 0) {
    const { routing } = config;
    Object.keys(routing).forEach((k) => {
      if (routing[k].routes && Object.entries(routing[k].routes).length > 0) {
        Object.entries(routing[k].routes).forEach(([, route]) => {
          breadcrumbNameMap[route.path] = <Translate id={`menu.${route.title}`} />;
        });
      } else {
        breadcrumbNameMap[routing[k].path] = <Translate id={`menu.${routing[k].title}`} />;
      }
    });
  }

  const pathSnippets = location.pathname.split('/').filter(i => i);
  const extraBreadcrumpItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    return (
      <Breadcrumb.Item key={url}>
        <Link to={url}>{breadcrumbNameMap[url]}</Link>
      </Breadcrumb.Item>
    );
  });

  const breadcrumptItems = [
    <Breadcrumb.Item key="home">
      <Link to="/">
        <Translate id="breadcrumb.home" />
      </Link>
    </Breadcrumb.Item>,
  ].concat(extraBreadcrumpItems);

  return <Breadcrumb style={{ margin: '16px 0' }}>{breadcrumptItems}</Breadcrumb>;
};

const mapStateToProps = ({ general }) => ({ general });
AdminBreadcrumb.propTypes = proptypes;

export default compose(
  withRouter,
  connect(
    mapStateToProps,
    {},
  ),
)(AdminBreadcrumb);
