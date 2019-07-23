import React from 'react';
import PropTypes from 'prop-types';
import { Empty, Row, Col } from 'antd';
import PartnerInfos from './PartnerInfos';
import PartnerList from './PartnerList';

const propTypes = {
  partners: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  setPartners: PropTypes.func.isRequired,
  selectPartner: PropTypes.func.isRequired,
  selectedPartner: PropTypes.string.isRequired,
  openModal: PropTypes.func.isRequired,
  config: PropTypes.shape().isRequired,
  fetching: PropTypes.bool.isRequired,
};

const PartnerTable = ({
  partners,
  setPartners,
  selectPartner,
  selectedPartner,
  openModal,
  config,
  fetching,
}) => {
  const partnerListProps = {
    partners,
    setPartners,
    selectedPartner,
    selectPartner,
  };
  const partnerInfosProps = {
    partner: partners.find((p) => p.id === selectedPartner),
    partners,
    setPartners,
    openModal,
  };

  if (partners.length === 0) {
    return <Empty />;
  }
  return (
    <Row type="flex" style={{ marginTop: '25px' }}>
      <Col span={24} lg={{ span: 8 }}>
        <PartnerList {...partnerListProps} />
      </Col>
      <Col span={24} lg={{ span: 16 }}>
        {selectedPartner && <PartnerInfos {...partnerInfosProps} />}
      </Col>
    </Row>
  );
};

PartnerTable.propTypes = propTypes;

export default PartnerTable;
