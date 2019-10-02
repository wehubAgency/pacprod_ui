import { Layout, Row, Col } from 'antd';
import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { withLocalize } from 'react-localize-redux';
import { renderToStaticMarkup } from 'react-dom/server';
import AdminMenu from './AdminMenu';
import { setApps } from '../actions';
import RouteGen from '../router/RouteGen';
import AdminBreadcrumb from './AdminBreadcrumb';
import CurrentApp from '../components/CurrentApp';
import frTranslation from '../translations/fr.translations.json';
import enTranslation from '../translations/en.translations.json';
import AdminHeader from './AdminHeader';
import styles from '../styles/AdminLayout.style';

const propTypes = {
  initialize: PropTypes.func.isRequired,
  addTranslationForLanguage: PropTypes.func.isRequired,
  activeLanguage: PropTypes.shape({
    code: PropTypes.string,
  }),
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

const defaultProps = {
  activeLanguage: {
    code: 'fr',
  },
};

const {
  Header, Content, Footer, Sider,
} = Layout;

const AdminLayout = ({
  location, history, initialize, addTranslationForLanguage,
}) => {
  const [collapsed, setCollapsed] = useState(false);

  function onCollapse() {
    setCollapsed(!collapsed);
  }

  useEffect(() => {
    if (location.pathname !== '/') {
      history.push('/');
    }
    initialize({
      languages: [{ name: 'Français', code: 'fr' }, { name: 'English', code: 'en' }],
      options: { renderToStaticMarkup },
    });
    addTranslationForLanguage(frTranslation, 'fr');
    addTranslationForLanguage(enTranslation, 'en');
    /* eslint-disable */
  }, []);

  const { headerStyle, contentStyle, contentContainerStyle } = styles;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={onCollapse} breakpoint="md" width={250}>
        <div className="logo" />
        <Row>
          <Col span={0} md={{ span: 24 }}>
            <CurrentApp />
          </Col>
        </Row>
        <AdminMenu theme="dark" defaultSelectedKeys={['1']} mode="inline" />
      </Sider>
      <Layout>
        <Header style={headerStyle}>
          <AdminHeader />
        </Header>
        <Content style={contentStyle}>
          <div style={contentContainerStyle}>
            <AdminBreadcrumb />
            <RouteGen />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
      </Layout>
    </Layout>
  );
};

AdminLayout.propTypes = propTypes;
AdminLayout.defaultProps = defaultProps;

export default compose(
  withRouter,
  withLocalize,
  connect(
    null,
    { setApps },
  ),
)(AdminLayout);
