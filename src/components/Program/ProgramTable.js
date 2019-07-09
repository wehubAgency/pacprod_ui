import React from 'react';
import PropTypes from 'prop-types';
import {
  Row, Col, List, Empty,
} from 'antd';
import ProgramInfos from './ProgramInfos';
import styles from '../../styles/components/ProgramTable.style';

const propTypes = {
  programs: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  setPrograms: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  selectProgram: PropTypes.func.isRequired,
  selectedProgram: PropTypes.string.isRequired,
};

const ProgramTable = ({
  programs, setPrograms, openModal, selectedProgram, selectProgram,
}) => {
  const renderProgramItems = program => (
    <List.Item
      key={program.id}
      onClick={() => selectProgram(program.id)}
      style={
        program.id === selectedProgram
          ? { ...styles.listItemStyle, backgroundColor: '#fafafa' }
          : { ...styles.listItemStyle }
      }
    >
      {program.name}
    </List.Item>
  );

  if (programs.length > 0) {
    return (
      <Row type="flex" style={{ marginTop: '50px' }} gutter={16}>
        <Col span={24} lg={{ span: 6 }}>
          <List dataSource={programs} renderItem={renderProgramItems} />
        </Col>
        {selectedProgram && (
          <Col span={24} lg={{ span: 18 }}>
            <ProgramInfos
              programs={programs}
              setPrograms={setPrograms}
              program={programs.find(p => selectedProgram === p.id)}
              selectProgram={selectProgram}
              openModal={openModal}
            />
          </Col>
        )}
      </Row>
    );
  }
  return <Empty />;
};

ProgramTable.propTypes = propTypes;

export default ProgramTable;
