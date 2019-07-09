import React from 'react';
import { Select } from 'antd';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withLocalize } from 'react-localize-redux';
import { selectLocale, setConfig } from '../actions';

const propTypes = {
  general: PropTypes.shape({
    selectedApp: PropTypes.object,
  }).isRequired,
  languages: PropTypes.arrayOf(
    PropTypes.shape({
      code: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
  setActiveLanguage: PropTypes.func.isRequired,
  selectLocale: PropTypes.func.isRequired,
  setConfig: PropTypes.func.isRequired,
};

const LanguageToggle = ({
  languages, setActiveLanguage, general, ...props
}) => {
  const { Option } = Select;

  const handleChange = (value) => {
    props.selectLocale(value);
    setActiveLanguage(value);
  };

  return (
    <div>
      <Select defaultValue="fr" onChange={handleChange} style={{ width: '100%' }}>
        {languages.map(lang => (
          <Option key={lang.code} value={lang.code}>
            {lang.name}
          </Option>
        ))}
      </Select>
    </div>
  );
};

const mapStateToProps = ({ general }) => ({ general });
LanguageToggle.propTypes = propTypes;

export default compose(
  withLocalize,
  connect(
    mapStateToProps,
    { selectLocale, setConfig },
  ),
)(LanguageToggle);
