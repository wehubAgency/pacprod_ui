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
  argameLinks: PropTypes.arrayOf(PropTypes.shape()),
  setArgameLinks: PropTypes.func,
  selectedArgameLink: PropTypes.string,
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
  argameLinks: [],
  setArgameLinks: () => {},
  selectedArgameLink: '',
};

const ARGameLinkForm = ({
  argameLinks,
  setArgameLinks,
  selectedArgameLink,
  translate,
  formMode,
  ...props
}) => {
  const [targets, setTargets] = useState([]);
  const [models, setModels] = useState([]);

  const { currentApp } = useSelector(({ general }) => general);

  const { data } = useFetchData(['/artargets/free', '/arobjects'], [[], [], []], [argameLinks]);

  useEffect(() => {
    setTargets(data[0]);
    setModels(data[1]);
  }, [data]);

  const targetOptions = targets.map(t => ({
    value: t.id,
    label: t.name,
  }));

  if (formMode === 'edit') {
    const selectedGameLink = argameLinks.find(a => a.id === selectedArgameLink);
    targetOptions.push({ value: selectedGameLink.target.id, label: selectedGameLink.target.name });
  }

  const additionalData = {
    target: targetOptions,
    winModel: models.map(m => ({
      value: m.id,
      label: m.name,
    })),
    looseModel: models.map(m => ({
      value: m.id,
      label: m.name,
    })),
  };

  const formProps = {
    ...props,
    formMode,
    data: argameLinks,
    setData: setArgameLinks,
    selectedData: selectedArgameLink,
    additionalData,
    entityName: 'argameLink',
    formName: 'argameLinkForm',
    createData: { appId: currentApp.id },
    createUrl: '/argamelinks',
    updateData: { appId: currentApp.id },
    updateUrl: `/argamelinks/${selectedArgameLink}`,
    modalTitle:
      formMode === 'create' ? (
        <Translate id="createArgameLink" />
      ) : (
        <Translate id="editArgameLink" />
      ),
  };

  return <Form {...formProps} />;
};

ARGameLinkForm.propTypes = propTypes;
ARGameLinkForm.defaultProps = defaultProps;

export default withLocalize(ARGameLinkForm);
