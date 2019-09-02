import React, { useState } from 'react';
import PropTypes from 'prop-types';
import SVGInline from 'svg-inline-react';
import { Button, Popconfirm } from 'antd';
import { Translate, withLocalize } from 'react-localize-redux';
import { saveSvgAsPng } from 'save-svg-as-png';
import PrizeManager from '../Prize/PrizeManager';
import QrcodeRules from './QrcodeRules';
import iaxios from '../../axios';

const propTypes = {
  qrcode: PropTypes.shape().isRequired,
  qrcodes: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  setQrcodes: PropTypes.func.isRequired,
  selectQrcode: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired,
};

const QrcodeInfos = ({
  qrcode, qrcodes, setQrcodes, openModal, selectQrcode, translate,
}) => {
  const [showQrcodeRules, setShowQrcodeRules] = useState(false);

  const dlQrcode = () => {
    const element = document.querySelector('#qrcode svg');
    saveSvgAsPng(element, `${qrcode.name}.png`, { scale: 100 });
  };

  const openQrcodeRules = () => {
    setShowQrcodeRules(true);
  };

  const toggleQrcode = () => {
    iaxios()
      .patch(`/qrcodes/${qrcode.id}/enabled`, { enabled: !qrcode.enabled })
      .then((res) => {
        if (res !== 'error') {
          selectQrcode('');
          const index = qrcodes.findIndex(q => q.id === qrcode.id);
          const newQrcodes = [...qrcodes];
          newQrcodes.splice(index, 1, res.data);
          setQrcodes(newQrcodes);
        }
      });
  };

  const deleteQrcode = () => {
    iaxios()
      .delete(`/qrcodes/${qrcode.id}`)
      .then((res) => {
        if (res !== 'error') {
          selectQrcode('');
          const index = qrcodes.findIndex(q => q.id === qrcode.id);
          const newQrcodes = [...qrcodes];
          newQrcodes.splice(index, 1);
          setQrcodes(newQrcodes);
        }
      });
  };

  const qrcodeRulesProps = {
    visible: showQrcodeRules,
    setVisible: setShowQrcodeRules,
    qrcode,
    qrcodes,
    setQrcodes,
  };

  return (
    <div>
      <div style={{ textAlign: 'center', fontSize: '1.25rem' }}>
        {qrcode.name}
        {qrcode.enabled ? '' : ` (${translate('disabled')})`}
        <Button
          style={{ marginLeft: 15 }}
          type="dashed"
          shape="circle-outline"
          icon="edit"
          onClick={() => openModal('edit')}
        />
        <Button
          style={{ marginLeft: 15 }}
          type="dashed"
          shape="circle-outline"
          icon="stop"
          onClick={() => toggleQrcode()}
        />
        <Popconfirm
          title={<Translate id="qrcodeInfos.confirmRemove" />}
          overlayStyle={{ maxWidth: 300 }}
          onConfirm={() => deleteQrcode()}
          okText={<Translate id="yes" />}
          cancelText={<Translate id="no" />}
        >
          <Button style={{ marginLeft: 15 }} type="dashed" shape="circle-outline" icon="delete" />
        </Popconfirm>
      </div>
      <div style={{ width: '150px', margin: '0 auto', position: 'relative' }}>
        <SVGInline id="qrcode" src={qrcode.image} />
        <Button
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
          type="primary"
          shape="circle"
          size="large"
          icon="download"
          onClick={dlQrcode}
        />
      </div>
      <Button
        style={{ display: 'block', margin: '0 auto' }}
        type="primary"
        icon="plus"
        onClick={() => openQrcodeRules()}
      >
        <span>
          <Translate id="qrcodeInfos.addRules" />
        </span>
      </Button>
      <QrcodeRules {...qrcodeRulesProps} />
      <PrizeManager prizesOwner={qrcode} className="qrcode" feature="qrflash" entityName="prize" />
    </div>
  );
};

QrcodeInfos.propTypes = propTypes;

export default withLocalize(QrcodeInfos);
