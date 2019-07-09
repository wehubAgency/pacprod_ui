import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';

const propTypes = {
  setSelectedKeys: PropTypes.func.isRequired,
  selectedKeys: PropTypes.arrayOf(PropTypes.string).isRequired,
  confirm: PropTypes.func.isRequired,
  clearFilters: PropTypes.func.isRequired,
};

const FilterDropdown = ({
  setSelectedKeys, selectedKeys, confirm, clearFilters,
}) => (
  <div style={{ padding: 8 }}>
    <Input.Search
      value={selectedKeys[0]}
      onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
      onPressEnter={confirm}
      onSearch={confirm}
      style={{ width: 188, marginBottom: 8, display: 'block' }}
    />
  </div>
);

FilterDropdown.propTypes = propTypes;

export default FilterDropdown;
