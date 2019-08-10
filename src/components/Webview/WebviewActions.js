import React from 'react';
import PropTypes from 'prop-types';
import {
  Button, Row, Col, Popconfirm,
} from 'antd';
import { Translate } from 'react-localize-redux';
import iaxios from '../../axios';

const propTypes = {
  webview: PropTypes.shape().isRequired,
  openModal: PropTypes.func.isRequired,
  webviews: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  setWebviews: PropTypes.func.isRequired,
  selectWebview: PropTypes.func.isRequired,
};

const WebviewActions = ({
  webview, openModal, webviews, setWebviews, selectWebview,
}) => {
  const editWebview = (wv) => {
    openModal(Boolean(wv.url), 'edit');
  };

  const toggleWebview = (wv) => {
    iaxios()
      .patch(`/webviews/${wv.id}/visible`, { visible: !webview.visible })
      .then((res) => {
        if (res !== 'error') {
          const index = webviews.findIndex(w => w.id === webview.id);
          const newWebviews = [...webviews];
          newWebviews.splice(index, 1, res.data);
          setWebviews(newWebviews);
        }
      });
  };

  const deleteWebview = (id) => {
    iaxios()
      .delete(`/webviews/${id}`)
      .then((res) => {
        if (res !== 'error') {
          const index = webviews.findIndex(w => w.id === webview.id);
          const newWebviews = [...webviews];
          newWebviews.splice(index, 1);
          selectWebview('');
          setWebviews(newWebviews);
        }
      });
  };

  return (
    <Row type="flex" style={{ margin: '25px 0' }} gutter={16}>
      <Col>
        <Button type="primary" icon="edit" onClick={() => editWebview(webview)}>
          <span>
            <Translate id="editWebview" />
          </span>
        </Button>
      </Col>
      <Col>
        <Button
          type="dashed"
          icon={webview.visible ? 'eye-invisible' : 'eye'}
          onClick={() => toggleWebview(webview)}
        >
          <span>
            <Translate id={webview.visible ? 'nonVisibleWebview' : 'visibleWebview'} />
          </span>
        </Button>
      </Col>
      <Col>
        <Popconfirm
          title={<Translate id="webviewActions.confirmDelete" />}
          onConfirm={() => deleteWebview(webview.id)}
        >
          <Button type="danger" icon="delete">
            <span>
              <Translate id="deleteWebview" />
            </span>
          </Button>
        </Popconfirm>
      </Col>
    </Row>
  );
};

WebviewActions.propTypes = propTypes;

export default WebviewActions;
