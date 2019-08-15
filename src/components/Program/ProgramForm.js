import React from 'react';
import PropTypes from 'prop-types';
import { Translate } from 'react-localize-redux';
import Form from '../Form';

const propTypes = {
  inModal: PropTypes.bool,
  setModalVisible: PropTypes.func,
  modalVisible: PropTypes.bool,
  externalFormRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.oneOfType([PropTypes.instanceOf(Element), () => null]) }),
  ]),
  programs: PropTypes.arrayOf(PropTypes.shape()),
  setPrograms: PropTypes.func,
  selectedProgram: PropTypes.string,
  selectProgram: PropTypes.func.isRequired,
  formMode: PropTypes.string.isRequired,
};

const defaultProps = {
  inModal: false,
  setModalVisible: () => {},
  modalVisible: false,
  externalFormRef: null,
  programs: [],
  setPrograms: () => {},
  selectedProgram: '',
};

const ProgramForm = ({
  shows,
  programs,
  setPrograms,
  selectedProgram,
  selectProgram,
  ...props
}) => {
  const edit = () => {
    const program = programs.find(p => p.id === selectedProgram);
    const pShows = program.shows;
    const editProgram = { ...program, shows: pShows.map(s => s.id) };
    return editProgram;
  };

  const formProps = {
    ...props,
    entityName: 'program',
    additionalData: { showsTransfer: shows },
    formName: 'programForm',
    data: programs,
    customEdit: edit,
    setData: setPrograms,
    selectedData: selectedProgram,
    createUrl: '/programs',
    createCallback: (data, res) => {
      setPrograms([...programs, res.data]);
      selectProgram(res.data.id);
    },
    updateUrl: `/programs/${selectedProgram}`,
    modalTitle:
      props.formMode === 'create' ? (
        <Translate id="createProgram" />
      ) : (
        <Translate id="editProgram" />
      ),
    createText: <Translate id="createProgram" />,
    modalWidth: 700,
  };

  return (
    <div>
      <Form {...formProps} />
    </div>
  );
};

ProgramForm.propTypes = propTypes;
ProgramForm.defaultProps = defaultProps;

export default ProgramForm;
