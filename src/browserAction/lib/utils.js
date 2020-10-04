const findElement = (value) => {
  const selector = `[data-element-selector=${value}]`;
  return document.querySelector(selector);
};

const cleanupTicketPrefix = (prefix) =>
  prefix
    ? prefix
        .replace(/[\W_]+/g, ' ')
        .trim()
        .toUpperCase()
    : '';

const createSelector = (value) => {
  const cleaned = cleanupTicketPrefix(value);
  const normalized = cleaned.replace(/\s/g, '-');
  return `app-selector-${normalized}`;
};

const cleanUpOrganizationURL = (value) =>
  value ? value.replace(/\/+$/, '') : '';

export default {
  cleanupTicketPrefix,
  findElement,
  createSelector,
  cleanUpOrganizationURL,
};
