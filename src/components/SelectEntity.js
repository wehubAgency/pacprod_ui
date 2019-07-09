import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withLocalize } from 'react-localize-redux';
import { Select } from 'antd';
import { selectEntity } from '../actions';

const propTypes = {
  general: PropTypes.shape({
    currentApp: PropTypes.shape({
      entities: PropTypes.arrayOf(PropTypes.object).isRequired,
    }),
    currentEntity: PropTypes.shape(),
  }).isRequired,
  selectEntity: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired,
};

const SelectEntity = ({
  general: { currentApp, currentEntity, entities },
  translate,
  ...props
}) => {
  if (!currentApp || entities.length === 0) {
    return null;
  }

  const filterOption = (input, option) => {
    const { children } = option.props;
    return children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };

  const handleChange = (value) => {
    const selectedEntity = entities.find(e => e.id === value);
    props.selectEntity(selectedEntity);
  };

  const renderOptions = () => {
    const { Option } = Select;
    return entities.map(c => (
      <Option value={c.id} key={c.id}>
        {c.name}
      </Option>
    ));
  };

  return (
    <Select
      showSearch
      style={{
        width: '100%',
        // display: entities.length < 2 ? 'none' : 'visible',
        minWidth: '100px',
      }}
      placeholder={translate('selectCircus.placeholder')}
      optionFilterProp="children"
      filterOption={filterOption}
      onChange={handleChange}
      value={currentEntity ? currentEntity.name : null}
    >
      {renderOptions()}
    </Select>
  );
};

const mapStateToProps = ({ general }) => ({ general });
SelectEntity.propTypes = propTypes;

export default compose(
  withLocalize,
  connect(
    mapStateToProps,
    { selectEntity },
  ),
)(SelectEntity);
