import React from 'react';
import { Menu, Icon } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Translate } from 'react-localize-redux';
import { withRouter, Link } from 'react-router-dom';

const propTypes = {
  theme: PropTypes.string.isRequired,
  defaultSelectedKeys: PropTypes.arrayOf(PropTypes.string).isRequired,
  mode: PropTypes.string.isRequired,
  general: PropTypes.shape({
    currentApp: PropTypes.shape({
      features: PropTypes.arrayOf(PropTypes.string),
    }),
    config: PropTypes.object.isRequired,
  }).isRequired,
};

const { SubMenu, Item } = Menu;

const AdminMenu = withRouter(({
  theme, defaultSelectedKeys, mode, general,
}) => {
  const renderMenu = () => {
    const {
      currentApp: { features },
      currentApp,
      config,
    } = general;

    const commonMenu = config.routing.common;
    const allFeatures = [...features, ...commonMenu, currentApp.type];
    if (general.role === 'super_admin') {
      allFeatures.push('admin');
    }
    return allFeatures.map((f) => {
      const menuItem = config.routing[f];
      if (menuItem.routes && Object.entries(menuItem.routes).length > 0) {
        return (
          <SubMenu
            key={menuItem.key}
            title={
              <span>
                <Icon type={menuItem.icon} />
                <span>
                  <Translate id={`menu.${menuItem.title}`} />
                </span>
              </span>
            }
          >
            {Object.entries(menuItem.routes).map(([key, route]) => (
              <Item key={key}>
                <Link to={route.path}>
                  <Translate id={`menu.${route.title}`} />
                </Link>
              </Item>
            ))}
          </SubMenu>
        );
      }
      return (
        <Item key={menuItem.key}>
          <Link to={menuItem.path}>
            <Icon type={menuItem.icon} />
            <span>
              <Translate id={`menu.${menuItem.title}`} />
            </span>
          </Link>
        </Item>
      );
    });
  };

  return (
    <Menu theme={theme} defaultSelectedKeys={defaultSelectedKeys} mode={mode}>
      {general.currentApp !== null && general.currentEntity && renderMenu()}
    </Menu>
  );
});

AdminMenu.propTypes = propTypes;

const mapStateToProps = ({ general }) => ({ general });

export default connect(
  mapStateToProps,
  {},
)(AdminMenu);
