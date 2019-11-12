import React from 'react';
import PropTypes from 'prop-types';
import { message, Icon, Upload } from 'antd';
import { withLocalize, Translate } from 'react-localize-redux';
import axios from 'axios';
import { ADMIN_API_URI } from '../constants';

const propTypes = {
  elKey: PropTypes.string.isRequired,
  item: PropTypes.shape().isRequired,
  edit: PropTypes.shape(),
  form: PropTypes.shape().isRequired,
  translate: PropTypes.func.isRequired,
};

const defaultProps = {
  edit: null,
};

const UploadFile = ({
  elKey, item, edit, form, translate, ...props
}) => {
  const beforeUpload = (file, key) => {
    const fileList = form.getFieldsValue()[key] || [];
    const filesLength = fileList.length;

    const { uploadRules } = item;
    let hasEnoughImage;
    if (edit && edit[key]) {
      const filesToDelete = form.getFieldValue(`${key}ToDelete`);
      const filesToDeleteLength = Array.isArray(filesToDelete) ? filesToDelete.length : 0;
      const originFilesLength = Array.isArray(edit[key]) ? edit[key].length : 1;
      hasEnoughImage = originFilesLength + filesLength - filesToDeleteLength < uploadRules.number;
    } else {
      hasEnoughImage = filesLength < uploadRules.number;
    }
    if (!hasEnoughImage) {
      message.error(translate('uploadRules.number', { number: uploadRules.number }));
    }

    const goodFormat = uploadRules.formats.length > 0 ? uploadRules.formats.includes(file.type) : true;
    if (!goodFormat) {
      message.error(translate('uploadRules.formats', { format: uploadRules.formats }));
    }

    const goodSize = file.size / 1024 / 1024 < uploadRules.size;
    if (!goodSize) {
      message.error(translate('uploadRules.size', { size: uploadRules.size }));
    }

    if (!(hasEnoughImage && goodFormat && goodSize)) {
      throw new Error("Erreur pendant l'upload");
    }

    return true;
  };

  const customRequest = ({ file, onSuccess }) => {
    const data = new FormData();
    data.append('file', file);
    const reqConfig = {
      headers: {
        Authorization: localStorage.getItem('token'),
      },
    };
    axios
      .post(`${ADMIN_API_URI}uploads`, data, reqConfig)
      .then((res) => {
        onSuccess(res.data, file);
      })
      .catch(() => {
        message.error(translate('formGen.uploadError'));
      });
  };

  return (
    <Upload.Dragger
      {...props}
      listType="picture-card"
      beforeUpload={file => beforeUpload(file, elKey, item)}
      customRequest={customRequest}
    >
      <p className="ant-upload-drag-icon">
        <Icon type="inbox" />
      </p>
      <p className="ant-upload-text">
        <Translate
          id="upload.text"
          data={{
            format: item.uploadRules.formats,
            size: item.uploadRules.size,
            number: item.uploadRules.number,
          }}
        />
      </p>
    </Upload.Dragger>
  );
};

UploadFile.propTypes = propTypes;
UploadFile.defaultProps = defaultProps;

export default withLocalize(UploadFile);
