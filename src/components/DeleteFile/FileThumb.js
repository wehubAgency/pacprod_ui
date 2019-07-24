import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import styles from '../../styles/components/FileThumb.style';

const propTypes = {
  url: PropTypes.string.isRequired,
  onFileUpdate: PropTypes.func.isRequired,
  filesToDelete: PropTypes.arrayOf(PropTypes.string),
  property: PropTypes.string.isRequired,
};

const defaultProps = {
  filesToDelete: undefined,
};

const FileThumb = ({
  url, onFileUpdate, filesToDelete, property,
}) => {
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (Array.isArray(filesToDelete)) {
      setActive(!filesToDelete.includes(url));
    } else {
      setActive(!(filesToDelete === url));
    }
  }, [filesToDelete, url]);

  return (
    <div
      style={{
        ...styles.imageContainerStyle,
        backgroundImage: `url(${url})`,
        filter: active ? 'grayscale(0)' : 'grayscale(1)',
      }}
    >
      <Button
        type="danger"
        shape="circle"
        ghost
        icon="delete"
        size="small"
        style={{ ...styles.buttonStyle }}
        onClick={() => onFileUpdate(url, property, active)}
      />
    </div>
  );
};

FileThumb.propTypes = propTypes;
FileThumb.defaultProps = defaultProps;

export default FileThumb;
