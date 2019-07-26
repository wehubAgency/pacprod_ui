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
  setPreviewImage: PropTypes.func.isRequired,
  setPreviewSettings: PropTypes.func.isRequired,
  setPreviewVisible: PropTypes.func.isRequired,
};

const defaultProps = {
  edit: null,
};

const UploadFile = ({
  elKey,
  item,
  edit,
  form,
  translate,
  setPreviewSettings,
  setPreviewImage,
  setPreviewVisible,
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

    const goodFormat = uploadRules.formats.includes(file.type);
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

  const onPreview = (file) => {
    if (file.type !== 'video/mp4') {
      let settings;
      if (item.previewSettings) {
        const { ratio } = item.previewSettings;
        settings = { paddingTop: `${(ratio.height / ratio.width) * 100}%` };
      } else {
        settings = { height: '50vh', backgroundSize: 'contain' };
      }
      setPreviewSettings(settings);
      setPreviewImage(file.url || file.thumbUrl);
      setPreviewVisible(true);
    }
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
      listType="picture-card"
      beforeUpload={file => beforeUpload(file, elKey, item)}
      onPreview={file => onPreview(file, item)}
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
