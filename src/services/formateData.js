import moment from 'moment';

export default (data) => {
  const formData = new FormData();
  Object.keys(data).forEach((k) => {
    if (data[k]) {
      if (Array.isArray(data[k])) {
        data[k].forEach((d) => {
          formData.append(`${k}[]`, d.response ? d.response[0] : d);
        });
      } else if (typeof data[k] === 'object' && data[k] !== null && !moment.isMoment(data[k])) {
        formData.append(k, JSON.stringify(data[k]));
      } else {
        formData.append(k, data[k]);
      }
    }
  });
  return formData;
};
