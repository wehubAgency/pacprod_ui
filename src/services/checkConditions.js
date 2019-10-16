export default (el, formValues) => el.conditions.every((c) => {
  switch (c.operator) {
    case 'includes':
      if (formValues[c.param] && formValues[c.param].length > 0) {
        return formValues[c.param].includes(c.value);
      }
      return false;
    case 'someRegexp':
      if (formValues[c.param] && formValues[c.param].length > 0) {
        const reg = RegExp(c.value);
        return formValues[c.param].some(v => v.match(reg));
      }
      return false;
    default:
  }
});
