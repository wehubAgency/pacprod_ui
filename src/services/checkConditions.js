import resolvePath from 'object-resolve-path';

export default (el, formValues) => el.conditions.every((c) => {
  switch (c.operator) {
    case 'includes':
      if (resolvePath(formValues, c.param) && resolvePath(formValues, c.param).length > 0) {
        return formValues[c.param].includes(c.value);
      }
      return false;
    case 'someRegexp':
      if (resolvePath(formValues, c.param) && resolvePath(formValues, c.param).length > 0) {
        const reg = RegExp(c.value);
        return resolvePath(formValues, c.param).some(v => v.match(reg));
      }
      return false;
    case 'stricEqual':
      return resolvePath(formValues, c.param) === c.value;
    default:
  }
});
