import axios from 'axios';
import { notification } from 'antd';
import { ADMIN_API_URI, SUPER_ADMIN_API_URI } from '../constants';
import store from '../store';

export default (role = 'admin') => {
  const { currentApp, currentEntity, currentSeason } = store.getState().general;

  const token = localStorage.getItem('token');
  const { CancelToken } = axios;
  const source = CancelToken.source();
  const iaxios = axios.create({
    baseURL:
      role === 'super_admin'
        ? SUPER_ADMIN_API_URI
        : ADMIN_API_URI + (currentApp !== null ? currentApp.apiPrefix : ''),
    headers: {
      common: { Authorization: token },
    },
    cancelToken: source.token,
  });
  iaxios.source = source;
  iaxios.interceptors.response.use(
    res => res,
    (err) => {
      console.log({ err });
      if (err.constructor.name !== 'Cancel') {
        const { message, description, type } = err.response.data.error;
        let descriptionMessage = '';

        switch (type) {
          case 'validator':
            descriptionMessage = description
              .map(e => `${e.property_path}: ${e.message}`)
              .join('\r\n');
            break;
          default:
            descriptionMessage = description;
        }
        notification.error({
          message,
          description: descriptionMessage,
          placement: 'topLeft',
        });
      }
      return Promise.resolve('error');
    },
  );
  if (currentEntity) {
    iaxios.interceptors.request.use((config) => {
      const newConfig = { ...config };
      if (['get', 'delete'].indexOf(config.method) >= 0 && currentEntity) {
        newConfig.params = { ...newConfig.params, season: currentSeason.id };
      }
      if (['post', 'put', 'patch'].indexOf(config.method) >= 0 && currentEntity) {
        if (newConfig.data !== undefined) {
          if (newConfig.data instanceof FormData) {
            newConfig.data.append('season', currentSeason.id);
          } else {
            newConfig.data.season = currentSeason.id;
          }
        }
      }
      return newConfig;
    });
  }
  return iaxios;
};
