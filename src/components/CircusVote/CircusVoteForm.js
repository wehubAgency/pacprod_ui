import React from 'react';
import PropTypes from 'prop-types';
import { Translate } from 'react-localize-redux';
import Form from '../Form';

const propTypes = {
  inModal: PropTypes.bool,
  setModalVisible: PropTypes.func,
  modalVisible: PropTypes.bool,
  externalFormRef: PropTypes.instanceOf(Element),
  formMode: PropTypes.string.isRequired,
  allVotes: PropTypes.arrayOf(PropTypes.object).isRequired,
  setAllVotes: PropTypes.func.isRequired,
  selectedVote: PropTypes.string.isRequired,
  selectVote: PropTypes.func.isRequired,
};

const defaultProps = {
  inModal: false,
  setModalVisible: () => {},
  modalVisible: false,
  externalFormRef: null,
};

const CircusVoteForm = ({
  allVotes, setAllVotes, selectedVote, selectVote, ...props
}) => {
  const formProps = {
    ...props,
    entityName: 'circusVote',
    data: allVotes,
    setData: setAllVotes,
    selectedData: selectedVote,
    selectData: selectVote,
    createUrl: '/circusvotes',
    updateUrl: `/circusvotes/${selectedVote}`,
    formName: 'circusVoteForm',
    modalTitle:
      props.formMode === 'create' ? <Translate id="createVote" /> : <Translate id="editVote" />,
  };

  return <Form {...formProps} />;
};

CircusVoteForm.propTypes = propTypes;
CircusVoteForm.defaultProps = defaultProps;

export default CircusVoteForm;
