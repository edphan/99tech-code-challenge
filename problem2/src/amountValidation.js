const INVALID_AMOUNT_MESSAGE = 'Enter a valid number';
const NON_POSITIVE_AMOUNT_MESSAGE = 'Amount must be greater than 0';

export const getAmountError = (value) => {
  if (value === null || value === undefined || value === '') {
    return INVALID_AMOUNT_MESSAGE;
  }
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return INVALID_AMOUNT_MESSAGE;
  }
  if (!Number.isFinite(value)) {
    return INVALID_AMOUNT_MESSAGE;
  }
  if (value <= 0) {
    return NON_POSITIVE_AMOUNT_MESSAGE;
  }
  return '';
};

export const isValidAmount = (value) => getAmountError(value) === '';
