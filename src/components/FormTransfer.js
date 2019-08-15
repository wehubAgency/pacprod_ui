import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withLocalize } from 'react-localize-redux';
import { Transfer } from 'antd';

const propTypes = {
  form: PropTypes.shape({
    setFieldsValue: PropTypes.func.isRequired,
  }).isRequired,
  hiddenInput: PropTypes.string.isRequired,
  dataSource: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
    }),
  ).isRequired,
  titles: PropTypes.arrayOf(PropTypes.string).isRequired,
  render: PropTypes.func.isRequired,
  initialTargetKeys: PropTypes.arrayOf(PropTypes.string).isRequired,
  translate: PropTypes.func.isRequired,
};

const FormTransfer = ({
  form,
  hiddenInput,
  dataSource,
  titles,
  render,
  initialTargetKeys,
  translate,
}) => {
  const [targetKeys, setTargetKeys] = useState(initialTargetKeys);

  useEffect(() => {
    form.setFieldsValue({ [hiddenInput]: targetKeys });
  }, [targetKeys]);

  const handleChange = (nextTargetKeys) => {
    setTargetKeys(nextTargetKeys);
  };

  return (
    <Transfer
      dataSource={dataSource.map(s => ({ ...s, key: s.id }))}
      titles={titles.map(t => translate(t))}
      targetKeys={targetKeys}
      onChange={handleChange}
      render={render}
    />
  );
};

FormTransfer.propTypes = propTypes;

export default withLocalize(FormTransfer);
