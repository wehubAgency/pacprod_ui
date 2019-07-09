import React, { useState, useRef, useEffect } from 'react';
import { Transfer, Modal, Button } from 'antd';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Translate, withLocalize } from 'react-localize-redux';
import FormGen from '../FormGen';
import ProgramShowOrder from './ProgramShowOrder';
import formateData from '../../services/formateData';
import iaxios from '../../axios';

const ProgramForm = ({
  shows,
  general: { config },
  translate,
  externalFormRef,
  inModal,
  formMode,
  modalVisible,
  setModalVisible,
  programs,
  setPrograms,
  selectedProgram,
}) => {
  const { formConfig, editConfig } = config.entities.program;
  const [loading, setLoading] = useState(false);
  const [targetKeys, setTargetKeys] = useState([]);
  const [programShows, setProgramShows] = useState([]);
  const [formState, setFormState] = useState({});
  const formRef = useRef(null);

  useEffect(() => {
    const form = externalFormRef ? externalFormRef.current : formRef.current;
    if (form) {
      form.setFieldsValue({
        ...formState,
        shows: programShows.map((p) => p.id),
      });
    }
  }, [externalFormRef, formState, programShows]);

  useEffect(() => {
    if (selectedProgram && formMode === 'edit') {
      const selectedShows = programs.find((p) => p.id === selectedProgram)
        .shows;
      setTargetKeys(selectedShows.map((s) => s.id));
      setProgramShows(selectedShows);
    }
  }, [selectedProgram, formMode, programs]);

  const closeModal = () => {
    setModalVisible(false);
    setProgramShows([]);
    setTargetKeys([]);
  };

  const handleChange = (nextTargetKeys) => {
    const form = externalFormRef ? externalFormRef.current : formRef.current;
    if (form) {
      setFormState(form.getFieldsValue());
    }
    setTargetKeys(nextTargetKeys);
    setProgramShows(nextTargetKeys.map((k) => shows.find((s) => s.id === k)));
  };

  const createProgram = (formData) => {
    iaxios()
      .post('programs', formData)
      .then((res) => {
        if (res !== 'error') {
          setPrograms([...programs, res.data]);
          if (inModal) {
            closeModal();
          }
        }
        setLoading(false);
      });
  };

  const updateProgram = (formData) => {
    formData.append('_method', 'PUT');
    iaxios()
      .post(`/program/${selectedProgram}`, formData)
      .then((res) => {
        if (res !== 'error') {
          const programIndex = programs.findIndex((p) => p.id === res.data.id);
          const newPrograms = [...programs];
          newPrograms.splice(programIndex, 1, res.data);
          setPrograms(newPrograms);
          if (inModal) {
            setModalVisible(false);
          }
        }
        setLoading(false);
      });
  };

  const onSubmit = (e) => {
    setLoading(true);

    const form = formRef.current;

    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (err === null) {
        const data = { ...values };
        const formData = formateData(data);
        if (formMode === 'create') {
          createProgram(formData);
        } else if (formMode === 'edit') {
          updateProgram(formData);
        }
      } else {
        setLoading(false);
      }
    });
  };

  const edit = () => {
    const program = programs.find((p) => p.id === selectedProgram);
    const pShows = program.shows;
    const editProgram = { ...program, shows: pShows.map((s) => s.id) };
    return editProgram;
  };

  const formGenProps = {
    formConfig,
    editConfig,
    ref: externalFormRef || formRef,
    edit: formMode === 'edit' ? edit() : null,
    formName: 'programForm',
  };

  const showOrderProps = {
    programShows,
    setProgramShows,
    targetKeys,
    setTargetKeys,
  };

  const FormElement = () => (
    <div>
      <div>
        <FormGen {...formGenProps} />
        <h2>
          <Translate id="programForm.manageShow" />
        </h2>
        <Transfer
          dataSource={shows.map((s) => ({ ...s, key: s.id }))}
          titles={[
            translate('programForm.show'),
            translate('programForm.program'),
          ]}
          targetKeys={targetKeys}
          render={(item) => (
            <span>
              {item.name}{' '}
              {!item.enabled ? <Translate id="programForm.disabled" /> : ''}
            </span>
          )}
          onChange={handleChange}
        />
      </div>
      {programShows.length > 0 && <ProgramShowOrder {...showOrderProps} />}
    </div>
  );

  const modalProps = {
    title:
      formMode === 'create' ? (
        <Translate id="createProgram" />
      ) : (
        <Translate id="editProgram" />
      ),
    visible: modalVisible,
    onCancel: closeModal,
    onOk: onSubmit,
    confirmLoading: loading,
    destroyOnClose: true,
    width: '600px',
  };

  if (externalFormRef) {
    return (
      <div>
        <FormElement />
      </div>
    );
  }
  if (inModal) {
    return (
      <Modal {...modalProps}>
        <FormElement />
      </Modal>
    );
  }
  return (
    <div>
      <FormElement />
      <Button type="primary" onClick={onSubmit}>
        <Translate id="programForm.createForm" />
      </Button>
    </div>
  );
};

const mapStateToProps = ({ general }) => ({ general });

export default compose(
  withLocalize,
  connect(
    mapStateToProps,
    {},
  ),
)(ProgramForm);
