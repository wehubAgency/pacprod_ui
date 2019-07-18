import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Select } from 'antd';
import PropTypes from 'prop-types';
import jso from 'json-override';
import { selectApp, setApps } from '../actions';
import { ADMIN_API_URI } from '../constants';
import defaultConfig from '../config/default.json';
import iaxios from '../axios';

const propTypes = {
  selectApp: PropTypes.func.isRequired,
  setApps: PropTypes.func.isRequired,
  general: PropTypes.shape({
    apps: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

const SelectApp = ({
  general: { apps, currentApp },
  general,
  selectApp,
  setApps,
}) => {
  const filterOption = (input, option) => {
    const { children } = option.props;
    return children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };

  const handleChange = (value) => {
    const selectedApp = apps.find((a) => a.id === value);
    iaxios()
      .get(`${ADMIN_API_URI}configs/${selectedApp.configFileName}`)
      .then((res) => {
        const config = jso(defaultConfig, res.data, {});
        selectApp({ selectedApp, config });
      });
  };

  useEffect(() => {
    iaxios()
      .get('/apps')
      .then((res) => {
        if (res !== 'error') {
          setApps(res.data);
          if (res.data.apps.length > 0) {
            const defaultApp = res.data.apps[0];
            iaxios()
              .get(`/configs/${defaultApp.configFileName}`)
              .then((r) => {
                const config = jso(defaultConfig, r.data, {});
                selectApp({ selectedApp: defaultApp, config });
              });
          }
        }
      });
    /* eslint-disable-next-line */
  }, []);

  const renderOptions = () => {
    const { Option } = Select;
    return apps.map((a) => (
      <Option value={a.id} key={a.id}>
        {a.name}
      </Option>
    ));
  };

  return (
    <Select
      showSearch
      style={{
        width: '100%',
        display: apps.length === 1 ? 'none' : 'visible',
        minWidth: '100px',
      }}
      optionFilterProp="children"
      filterOption={filterOption}
      onChange={handleChange}
      value={currentApp ? currentApp.name : null}
    >
      {renderOptions()}
    </Select>
  );
};

SelectApp.propTypes = propTypes;
const mapStateToProps = ({ general }) => ({ general });

export default connect(
  mapStateToProps,
  { selectApp, setApps },
)(SelectApp);
