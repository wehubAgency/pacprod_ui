import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Modal, Upload, Icon, message,
} from 'antd';
import { Translate, withLocalize } from 'react-localize-redux';
import axios from 'axios';
import iaxios from '../../axios';
import { ADMIN_API_URI } from '../../constants';
import selfieTester from '../../img/selfie_tester.jpg';

const propTypes = {
  selfieId: PropTypes.string.isRequired,
  setFilters: PropTypes.func.isRequired,
  modalVisible: PropTypes.bool.isRequired,
  setModalVisible: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired,
};

const FilterForm = ({
  selfieId, setFilters, modalVisible, setModalVisible, translate,
}) => {
  const [loading, setLoading] = useState(false);
  const [filterTempUrl, setFilterTempUrl] = useState(null);
  const [filterUri, setFilterUri] = useState('');

  const createFilter = () => {
    if (filterUri) {
      setLoading(true);
      iaxios()
        .post(`/selfies/${selfieId}/filters`, { filter: filterTempUrl })
        .then((res) => {
          if (res !== 'error') {
            setFilters([...res.data.filters]);
            setModalVisible(false);
          }
          setLoading(false);
        });
    }
  };

  const beforeUpload = (file) => {
    const isPng = file.type === 'image/png';
    if (!isPng) {
      message.error(translate('filterForm.notPng'));
    }

    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error(translate('filterForm.lt2M'));
    }

    const url = URL.createObjectURL(file);
    const image = new Image();
    image.src = url;

    image.onload = () => {
      const goodSize = image.width === 500 && image.height === 888;
      if (!goodSize) {
        message.error(translate('filterForm.basSize'));
      }

      if (isPng && isLt2M && goodSize) {
        setFilterUri(url);
      } else {
        setFilterUri('');
      }
    };
  };

  const customRequest = ({ file }) => {
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
        setFilterTempUrl(res.data);
      })
      .catch(() => {
        message.error(translate('formGen.uploadError'));
      });
  };

  const onCancel = () => {
    setModalVisible(false);
    setFilterUri('');
  };

  return (
    <Modal
      visible={modalVisible}
      onCancel={onCancel}
      onOk={createFilter}
      confirmLoading={loading}
      destroyOnClose
      width={700}
    >
      <Upload.Dragger beforeUpload={beforeUpload} customRequest={customRequest} fileList={[]}>
        <p className="ant-upload-drag-icon">
          <Icon type="inbox" />
        </p>
        <p className="ant-upload-text">
          <Translate id="filterForm.upload" />
        </p>
      </Upload.Dragger>
      <div style={{ marginTop: 25, display: 'flex', justifyContent: 'center' }}>
        {filterUri && <img style={{ position: 'absolute' }} src={filterUri} alt="future filter" />}
        <img src={selfieTester} alt="filter tester" />
      </div>
    </Modal>
  );
};

FilterForm.propTypes = propTypes;

export default withLocalize(FilterForm);
