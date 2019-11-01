import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Translate } from 'react-localize-redux';
import Form from '../Form';
import { useFetchData } from '../../hooks';

const propTypes = {
  inModal: PropTypes.bool,
  setModalVisible: PropTypes.func,
  modalVisible: PropTypes.bool,
  arTargets: PropTypes.arrayOf(PropTypes.shape()),
  setArTargets: PropTypes.func,
  selectedArTarget: PropTypes.string,
  externalFormRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]),
};

const defaultProps = {
  inModal: false,
  setModalVisible: () => {},
  modalVisible: false,
  externalFormRef: null,
  arTargets: [],
  setArTargets: () => {},
  selectedArTarget: '',
};

const ARTargetForm = ({
  arTargets, setArTargets, selectedArTarget, ...props
}) => {
  const [models, setModels] = useState([]);
  const [gameConditions, setGameConditions] = useState([]);
  const { currentApp } = useSelector(({ general }) => general);

  const { data } = useFetchData(['/arobjects', '/gameconditions'], [[], []]);

  useEffect(() => {
    setModels(data[0]);
    setGameConditions(data[1]);
  }, [data]);

  const options = {
    model: models.map(m => ({
      value: m.id,
      label: m.name,
    })),
    gameCondition: gameConditions.map(g => ({
      value: g.id,
      label: g.name,
    })),
  };

  const additionalData = { ...options };

  const formProps = {
    ...props,
    data: arTargets,
    setData: setArTargets,
    selectedData: selectedArTarget,
    entityName: 'arTarget',
    formName: 'arTargetForm',
    createData: { appId: currentApp.id },
    createUrl: '/artargets',
    updateData: { appId: currentApp.id },
    updateUrl: `/artargets/${selectedArTarget}`,
    additionalData,
    modalTitle:
      props.formMode === 'create' ? (
        <Translate id="createArTarget" />
      ) : (
        <Translate id="editArTarget" />
      ),
  };

  return <Form {...formProps} />;
};

ARTargetForm.propTypes = propTypes;
ARTargetForm.defaultProps = defaultProps;

export default ARTargetForm;
