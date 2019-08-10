import React, { useState } from 'react';
import { Button, Row, Col } from 'antd';
import { Translate } from 'react-localize-redux';
import WebviewForm from './WebviewForm';
import WebviewUrlForm from './WebviewUrlForm';
import WebviewList from './WebviewList';
import WebviewInfos from './WebviewInfos';

const WebviewManager = ({ webviews, setWebviews }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [urlModalVisible, setUrlModalVisible] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [selectedWebview, selectWebview] = useState('');

  const openModal = (url = false, mode = 'create') => {
    setFormMode(mode);
    if (url) {
      setUrlModalVisible(true);
    } else {
      setModalVisible(true);
    }
  };

  const formProps = {
    inModal: true,
    setModalVisible,
    modalVisible,
    openModal,
    webviews,
    setWebviews,
    selectedWebview,
    formMode,
  };

  const urlFormProps = {
    inModal: true,
    setModalVisible: setUrlModalVisible,
    modalVisible: urlModalVisible,
    openModal,
    webviews,
    setWebviews,
    selectedWebview,
    formMode,
  };

  const listProps = {
    items: webviews,
    setItems: setWebviews,
    selectedWebview,
    selectWebview,
  };

  return (
    <div>
      <Row type="flex" gutter={16}>
        <Col>
          <Button icon="plus" type="primary" onClick={() => openModal()}>
            <span>
              <Translate id="createWebview" />
            </span>
          </Button>
        </Col>
        <Col>
          <Button icon="plus" type="primary" onClick={() => openModal(true)}>
            <span>
              <Translate id="addWebview" />
            </span>
          </Button>
        </Col>
      </Row>
      <div style={{ marginTop: 50 }}>
        <Row type="flex" gutter={16}>
          <Col span={24} lg={{ span: 8 }}>
            <WebviewList {...listProps} />
          </Col>
          <Col span={24} lg={{ span: 16 }}>
            {selectedWebview && (
              <WebviewInfos
                webview={webviews.find(w => w.id === selectedWebview)}
                openModal={openModal}
                webviews={webviews}
                setWebviews={setWebviews}
                selectWebview={selectWebview}
              />
            )}
          </Col>
        </Row>
        <WebviewForm {...formProps} />
        <WebviewUrlForm {...urlFormProps} />
      </div>
    </div>
  );
};

export default WebviewManager;
