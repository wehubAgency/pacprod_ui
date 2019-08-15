import React from 'react';
import PropTypes from 'prop-types';
import { Descriptions } from 'antd';
import { Translate } from 'react-localize-redux';

const propTypes = {
  company: PropTypes.shape({
    logo: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    address: PropTypes.shape({
      fullAddress: PropTypes.string.isRequired,
    }).isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
};

const CompanyInfos = ({ company }) => {
  const { Item } = Descriptions;

  return (
    <div>
      <Descriptions
        title={<Translate id="companyInfos.title" />}
        size="small"
        bordered
        column={{
          xxl: 4,
          xl: 3,
          lg: 3,
          md: 3,
          sm: 2,
          xs: 1,
        }}
      >
        <Item label={<Translate id="companyInfos.logo" />}>
          <img src={company.logo} alt={company.name} width="80" height="80" />
        </Item>
        <Item label={<Translate id="companyInfos.name" />}>{company.name}</Item>
        <Item label={<Translate id="companyInfos.phone" />}>{company.phone}</Item>
        <Item label={<Translate id="companyInfos.email" />}>{company.email}</Item>
        <Item label={<Translate id="companyInfos.fullAddress" />}>
          {company.address.fullAddress}
        </Item>
        <Item label={<Translate id="companyInfos.description" />}>
          {company.description.length > 140
            ? `${company.description.substring(0, 140)}...`
            : company.description}
        </Item>
      </Descriptions>
    </div>
  );
};

CompanyInfos.propTypes = propTypes;

export default CompanyInfos;
