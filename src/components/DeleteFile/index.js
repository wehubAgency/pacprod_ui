import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'antd';
import FileThumb from './FileThumb';

const propTypes = {
  files: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string]).isRequired,
  onFileUpdate: PropTypes.func.isRequired,
  filesToDelete: PropTypes.arrayOf(PropTypes.string),
  property: PropTypes.string.isRequired,
};

const defaultProps = {
  filesToDelete: undefined,
};

const DeleteFile = ({
  files, onFileUpdate, filesToDelete, property,
}) => {
  const generateThumb = (allFiles) => {
    let newAllFiles;
    if (!Array.isArray(allFiles)) {
      newAllFiles = [allFiles];
    } else {
      newAllFiles = [...allFiles];
    }
    return newAllFiles.map(url => (
      <Col key={url}>
        <FileThumb
          url={url}
          onFileUpdate={onFileUpdate}
          property={property}
          filesToDelete={filesToDelete}
        />
      </Col>
    ));
  };

  return (
    <Row type="flex" justify="start" gutter={16}>
      {generateThumb(files)}
    </Row>
  );
};

DeleteFile.propTypes = propTypes;
DeleteFile.defaultProps = defaultProps;

export default DeleteFile;
