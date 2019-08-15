import React from 'react';
import PropTypes from 'prop-types';
import {
  Card, Row, Col, Icon, Popconfirm, message,
} from 'antd';
import Masonry from 'react-responsive-masonry';
import { Translate, withLocalize } from 'react-localize-redux';
import iaxios from '../../axios';
import styles from '../../styles/components/EntityInfos.style';

const propTypes = {
  partner: PropTypes.shape().isRequired,
  partners: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  setPartners: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired,
  selectPartner: PropTypes.func.isRequired,
};
const PartnerInfos = ({
  partner, partners, setPartners, selectPartner, openModal, translate,
}) => {
  const { labelStyle } = styles;

  const togglePartner = () => {
    iaxios()
      .patch(`/partners/${partner.id}/enabled`, { enabled: !partner.enabled })
      .then((res) => {
        if (res !== 'error') {
          const partnerIndex = partners.findIndex(s => s.id === res.data.id);
          const newPartners = [...partners];
          newPartners.splice(partnerIndex, 1, res.data);
          setPartners(newPartners);
          message.success(translate('success'));
        }
      });
  };

  const deletePartner = () => {
    iaxios()
      .delete(`/partners/${partner.id}`)
      .then((res) => {
        if (res !== 'error') {
          selectPartner('');
          const index = partners.findIndex(p => p.id === res.data.id);
          const newPartners = [...partners];
          newPartners.splice(index, 1);
          setPartners(newPartners);
          message.success(translate('success'));
        }
      });
  };
  return (
    <Card
      title={`${partner.name}${partner.enabled ? '' : ` (${translate('disabled')})`}`}
      actions={[
        <Icon type="edit" onClick={() => openModal('edit')} />,
        <Icon type={partner.enabled ? 'stop' : 'check'} onClick={togglePartner} />,
        <Popconfirm
          title={<Translate id="questionsInfos.confirmDelete" />}
          onConfirm={deletePartner}
        >
          <Icon type="delete" />
        </Popconfirm>,
      ]}
    >
      {partner.logo && (
        <img
          style={{ display: 'block', margin: '0 auto' }}
          src={partner.logo}
          width="250"
          height="250"
          alt={partner.name}
        />
      )}
      <p style={labelStyle}>
        <Translate id="entityInfos.address" />:
      </p>
      <p>{partner.address.fullAddress}</p>
      <p style={labelStyle}>
        <Translate id="entityInfos.description" />:
      </p>
      <p>
        {partner.description ? (
          partner.description
        ) : (
          <Translate id="entityInfos.emptyDescription" />
        )}
      </p>
      <p style={labelStyle}>
        <Translate id="entityInfos.email" />
      </p>
      <p>{partner.email ? partner.email : <Translate id="entityInfos.emptyEmail" />}</p>
      <p style={labelStyle}>
        <Translate id="entityInfos.phone" />
      </p>
      <p>{partner.phone ? partner.phone : <Translate id="entityInfos.emptyPhone" />}</p>
      <p style={labelStyle}>
        <Translate id="entityInfos.facebook" />
      </p>
      <p>
        {partner.facebook ? (
          <a href={partner.facebook} target="_blank" rel="noopener noreferrer">
            {partner.facebook}
          </a>
        ) : (
          <Translate id="entityInfos.emptyFacebook" />
        )}
      </p>
      <p style={labelStyle}>
        <Translate id="entityInfos.website" />
      </p>
      <p>
        {partner.website ? (
          <a href={partner.website} target="_blank" rel="noopener noreferrer">
            {partner.website}
          </a>
        ) : (
          <Translate id="entityInfos.emptyWebsite" />
        )}
      </p>
      <p style={labelStyle}>
        <Translate id="entityInfos.photos" />
      </p>
      {partner.photos && partner.photos.length > 0 ? (
        <Masonry columnCount={3} gutter="15px">
          {partner.photos.map(p => (
            <img key={p} src={p} alt="photos" style={{ width: '100%', display: 'bloc' }} />
          ))}
        </Masonry>
      ) : (
        <Translate id="entityInfos.emptyPhotos" />
      )}
      <p style={labelStyle}>
        <Translate id="entityInfos.videos" />
      </p>
      {partner.videos && partner.videos.length > 0 ? (
        <Row type="flex">
          {partner.videos.map(v => (
            <Col key={v}>
              <video key={v} src={v} controls />
            </Col>
          ))}
        </Row>
      ) : (
        <Translate id="entityInfos.emptyVideos" />
      )}
    </Card>
  );
};

PartnerInfos.propTypes = propTypes;

export default withLocalize(PartnerInfos);
