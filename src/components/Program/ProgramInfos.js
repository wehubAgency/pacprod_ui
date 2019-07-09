import React from 'react';
import PropTypes from 'prop-types';
import { Translate, withLocalize } from 'react-localize-redux';
import { List, Avatar, Button } from 'antd';
import iaxios from '../../axios';

const propTypes = {
  program: PropTypes.shape().isRequired,
  openModal: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired,
  programs: PropTypes.arrayOf(PropTypes.object).isRequired,
  setPrograms: PropTypes.func.isRequired,
  selectProgram: PropTypes.func.isRequired,
};

const ProgramInfos = ({
  program, openModal, translate, programs, setPrograms, selectProgram,
}) => {
  const renderShowsItem = show => (
    <List.Item key={show.id}>
      <List.Item.Meta
        avatar={<Avatar src={show.image} />}
        title={`${show.name} ${!show.enabled ? translate('programInfos.disabled') : ''}`}
        description={show.description}
      />
    </List.Item>
  );

  const toggleProgram = () => {
    iaxios()
      .patch(`programs/${program.id}/enabled`, { enabled: !program.enabled })
      .then((res) => {
        if (res !== 'error') {
          const index = programs.find(p => p.id === res.data.id);
          const newPrograms = [...programs];
          newPrograms.splice(index, 1, res.data);
          setPrograms(newPrograms);
        }
      });
  };

  const deleteProgram = () => {
    iaxios()
      .delete(`/programs/${program.id}`)
      .then((res) => {
        if (res !== 'error') {
          selectProgram('');
          const index = programs.findIndex(p => p.id === res.data.id);
          const newPrograms = [...programs];
          newPrograms.splice(index, 1);
          setPrograms(newPrograms);
        }
      });
  };

  if (!program) {
    return null;
  }

  return (
    <div>
      <h2>
        {program.name} {!program.enabled ? <Translate id="programInfos.disabled" /> : ''}
      </h2>
      <List bordered dataSource={program.shows} renderItem={renderShowsItem} />
      <div style={{ marginTop: 50 }}>
        <Button style={{ marginRight: 15 }} type="primary" onClick={() => openModal('edit')}>
          <span>
            <Translate id="programInfos.editProgram" />
          </span>
        </Button>
        <Button
          style={{ marginRight: 15 }}
          type={program.enabled ? 'danger' : 'primary'}
          onClick={toggleProgram}
        >
          {program.enabled ? (
            <span>
              <Translate id="programInfos.disableProgram" />
            </span>
          ) : (
            <span>
              <Translate id="programInfos.enableProgram" />
            </span>
          )}
        </Button>
        <Button type="danger" onClick={deleteProgram}>
          <span>
            <Translate id="programInfos.deleteProgram" />
          </span>
        </Button>
      </div>
    </div>
  );
};

ProgramInfos.propTypes = propTypes;

export default withLocalize(ProgramInfos);
