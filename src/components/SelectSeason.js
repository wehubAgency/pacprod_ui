import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Select } from 'antd';
import { selectSeason } from '../actions';

const propTypes = {
  general: PropTypes.shape({
    currentEntity: PropTypes.shape({
      seasons: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    }),
  }).isRequired,
  selectSeason: PropTypes.func.isRequired,
};

const SelectSeason = ({
  general,
  general: { currentEntity, currentSeason, seasons },
  ...props
}) => {
  if (!currentEntity) {
    return null;
  }

  const filterOption = (input, option) => {
    const { children } = option.props;
    return children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };

  const handleChange = (value) => {
    const selectedSeason = seasons.find(s => s.id === value);
    props.selectSeason(selectedSeason);
  };

  const renderOptions = () => {
    const { Option } = Select;
    return seasons.map(s => (
      <Option value={s.id} key={s.id}>
        {s.name}
      </Option>
    ));
  };

  return (
    <Select
      showSearch
      style={{ width: '100%', minWidth: '100px' }}
      optionFilterProp="children"
      filterOption={filterOption}
      onChange={handleChange}
      value={currentSeason ? currentSeason.name : null}
    >
      {renderOptions()}
    </Select>
  );
};

const mapStateToProps = ({ general }) => ({ general });
SelectSeason.propTypes = propTypes;

export default connect(
  mapStateToProps,
  { selectSeason },
)(SelectSeason);
