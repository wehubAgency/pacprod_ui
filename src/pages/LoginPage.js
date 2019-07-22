import React, { useState } from 'react';
import { Button, Form, Icon, Input, message } from 'antd';
import axios from 'axios';
import { API_URI } from '../constants';

const LoginPage = ({ form, setAuthenticated }) => {
  const [loading, setLoading] = useState(false);
  const submitForm = (e) => {
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        setLoading(true);
        axios
          .post(`${API_URI}user/getToken`, { ...values, admin: true })
          .then((res) => {
            if (res.data !== 'INVALID_GRANT' && res.data !== 'BAD_ROLE') {
              localStorage.setItem('token', `Bearer ${res.data.access_token}`);
              localStorage.setItem('refreshToken', res.data.refresh_token);
              setAuthenticated(true);
            } else {
              message.error('Wrong Id/password combinaison');
            }
            setLoading(false);
          })
          .catch(() => {
            message.error('Wrong Id/password combinaison');
            setLoading(false);
          });
      }
    });
  };

  const { getFieldDecorator } = form;
  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <Form onSubmit={submitForm} className="login-form">
        <Form.Item>
          {getFieldDecorator('mail', {
            rules: [{ required: true, message: ' ' }],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,0.5)' }} />}
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: ' ' }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
            />,
          )}
        </Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          className="login-form-button"
          loading={loading}
        >
          Log in
        </Button>
      </Form>
    </div>
  );
};

export default Form.create({ name: 'loginForm' })(LoginPage);
