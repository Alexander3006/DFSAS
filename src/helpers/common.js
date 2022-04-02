'use strict';

const delay = (del) => new Promise((res) => setTimeout(res, del));

const notEmptyValue = (value) => {
  const isNull = value === null;
  const isUndefined = typeof value === 'undefined';
  const isEmpty = !value?.length;
  return !isNull && !isUndefined && !isEmpty;
};

module.exports = {
  delay,
  notEmptyValue,
};
