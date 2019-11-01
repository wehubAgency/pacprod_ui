import React, { useState, useEffect } from 'react';
import { Spin } from 'antd';
import RulesForm from './RulesForm';
import { useFetchData } from '../../hooks';

const ARGameSettingsManager = () => {
  const [rules, setRules] = useState(null);

  const { data, fetching } = useFetchData('/argames/rules');

  useEffect(() => {
    setRules(data);
  }, [data]);

  const formProps = {
    formMode: 'edit',
    rules,
    setRules,
  };

  return <div>{fetching || !rules ? <Spin size="large" /> : <RulesForm {...formProps} />}</div>;
};

export default ARGameSettingsManager;
