import axios from 'axios';
import { notification } from 'antd';
import { ADMIN_API_URI, SUPER_ADMIN_API_URI, API_URI } from '../constants';
import store from '../store';

const refreshToken = async () => {
  const rt = localStorage.getItem('refreshToken');

  const res = await axios.post(`${API_URI}user/refresh`, { refreshToken: rt });

  localStorage.setItem('token', `Bearer ${res.data.access_token}`);
  localStorage.setItem('refreshToken', res.data.refresh_token);

  return res.data.access_token;
};

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
      if (err.constructor.name !== 'Cancel') {
        const {
          config,
          response: { status },
        } = err;
        const originalRequest = { ...config };
        switch (status) {
          case 401: {
            return refreshToken().then((t) => {
              originalRequest.headers.Authorization = `Bearer ${t}`;
              return axios(originalRequest);
            });
          }
          default: {
            // const { message, description, type } = err.response.data.error;
            // let descriptionMessage = '';

            // switch (type) {
            //   case 'validator':
            //     descriptionMessage = description
            //       .map(e => `${e.property_path}: ${e.message}`)
            //       .join('\r\n');
            //     break;
            //   default:
            //     descriptionMessage = description;
            // }

            // notification.error({
            //   message,
            //   description,
            //   placement: 'topLeft',
            // });
            notification.error({
              message: 'Error',
              description: 'An error occured. Please retry or contact the support.',
              placement: 'topLeft',
            });
          }
        }
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
