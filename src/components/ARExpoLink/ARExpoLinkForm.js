import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Translate, withLocalize } from 'react-localize-redux';
import Form from '../Form';
import { useFetchData } from '../../hooks';

const propTypes = {
  inModal: PropTypes.bool,
  setModalVisible: PropTypes.func,
  modalVisible: PropTypes.bool,
  arexpoLinks: PropTypes.arrayOf(PropTypes.shape()),
  setArexpoLinks: PropTypes.func,
  selectedArexpoLink: PropTypes.string,
  externalFormRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]),
  translate: PropTypes.func.isRequired,
  formMode: PropTypes.string.isRequired,
};

const defaultProps = {
  inModal: false,
  setModalVisible: () => {},
  modalVisible: false,
  externalFormRef: null,
  arexpoLinks: [],
  setArexpoLinks: () => {},
  selectedArexpoLink: '',
};

const ARExpoLinkForm = ({
  arexpoLinks,
  setArexpoLinks,
  selectedArexpoLink,
  translate,
  formMode,
  ...props
}) => {
  const [targets, setTargets] = useState([]);
  const [models, setModels] = useState([]);
  const [gameConditions, setGameConditions] = useState([]);

  const { currentApp } = useSelector(({ general }) => general);

  const { data } = useFetchData(
    ['/artargets/free', '/arobjects', '/gameconditions'],
    [[], [], []],
    [arexpoLinks],
  );

  useEffect(() => {
    setTargets(data[0]);
    setModels(data[1]);
    setGameConditions(data[2]);
  }, [data]);

  const gameConditionsOptions = gameConditions.map(g => ({
    value: g.id,
    label: g.name,
  }));
  gameConditionsOptions.unshift({ value: null, label: translate('noConditions') });

  const targetOptions = targets.map(t => ({
    value: t.id,
    label: t.name,
  }));

  if (formMode === 'edit') {
    const selectedExpoLink = arexpoLinks.find(a => a.id === selectedArexpoLink);
    targetOptions.push({ value: selectedExpoLink.target.id, label: selectedExpoLink.target.name });
  }

  const additionalData = {
    target: targetOptions,
    model: models.map(m => ({
      value: m.id,
      label: m.name,
    })),
    gameCondition: gameConditionsOptions,
  };

  const formProps = {
    ...props,
    formMode,
    data: arexpoLinks,
    setData: setArexpoLinks,
    selectedData: selectedArexpoLink,
    additionalData,
    entityName: 'arexpoLink',
    formName: 'arexpoLinkForm',
    createData: { appId: currentApp.id },
    createUrl: '/arexpolinks',
    updateData: { appId: currentApp.id },
    updateUrl: `/arexpolinks/${selectedArexpoLink}`,
    modalTitle:
      formMode === 'create' ? (
        <Translate id="createArexpoLink" />
      ) : (
        <Translate id="editArexpoLink" />
      ),
  };

  return <Form {...formProps} />;
};

ARExpoLinkForm.propTypes = propTypes;
ARExpoLinkForm.defaultProps = defaultProps;

export default withLocalize(ARExpoLinkForm);
