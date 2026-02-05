import { useEffect, useState } from 'react';
import { Card, Select, InputNumber, Button } from 'antd';
import { ArrowUpDown } from 'lucide-react';
import PropTypes from 'prop-types';
import './SwapCard.css';
import { getAmountError, isValidAmount } from './amountValidation';

const { Option } = Select;

const TOKEN_ICON_BASE_URL =
  'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens';

const tokenNameMapping = {
  STATOM: 'stATOM',
  STLUNA: 'stLUNA',
  RATOM: 'rATOM',
  STEVMOS: 'stEVMOS',
  STOSMO: 'stOSMO',
};

function transformTokenName(symbol) {
  return tokenNameMapping[symbol] || symbol;
}

const TokenSelect = ({ tokenSymbols, value, onChange }) => (
  <Select
    showSearch
    placeholder='Select token'
    value={value || undefined}
    onChange={onChange}
    className='swapcard-select'
  >
    {tokenSymbols.map((sym) => (
      <Option key={sym} value={sym}>
        <img
          src={`${TOKEN_ICON_BASE_URL}/${transformTokenName(sym)}.svg`}
          alt={sym}
          className='swapcard-token-icon'
        />
        {sym}
      </Option>
    ))}
  </Select>
);

TokenSelect.propTypes = {
  tokenSymbols: PropTypes.arrayOf(PropTypes.string).isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export const SwapCard = ({
  tokenSymbols,
  onSwap,
  fromToken,
  toToken,
  fromAmount,
  toAmount,
  setFromToken,
  setToToken,
  setFromAmount,
  setToAmount,
  swapLoading,
  swapSuccessCount,
}) => {
  const [hasInteractedWithAmount, setHasInteractedWithAmount] =
    useState(false);

  const amountError = getAmountError(fromAmount);
  const showAmountError = hasInteractedWithAmount && amountError;

  useEffect(() => {
    setHasInteractedWithAmount(false);
  }, [swapSuccessCount]);

  const handleFlip = () => {
    const oldFromToken = fromToken;
    const oldToToken = toToken;
    const oldFromAmount = fromAmount;
    const oldToAmount = toAmount;
    setFromToken(oldToToken);
    setToToken(oldFromToken);
    setFromAmount(oldToAmount);
    setToAmount(
      isValidAmount(oldFromAmount) ? oldFromAmount : 0
    );
  };

  return (
    <Card className='swapcard'>
      <div className='swapcard-label'>Sell (From)</div>
      <div className='swapcard-field-group'>
        <div className='swapcard-box'>
          <TokenSelect
            tokenSymbols={tokenSymbols}
            value={fromToken}
            onChange={setFromToken}
          />
          <InputNumber
            controls={false}
            className='swapcard-amount-input'
            value={fromAmount}
            status={showAmountError ? 'error' : ''}
            onFocus={() => fromAmount === 0 && setFromAmount(null)}
            onBlur={() => setHasInteractedWithAmount(true)}
            onChange={(val) => {
              if (!hasInteractedWithAmount) {
                setHasInteractedWithAmount(true);
              }
              setFromAmount(val ?? null);
            }}
          />
        </div>
        {showAmountError ? (
          <div className='swapcard-error'>{amountError}</div>
        ) : null}
      </div>

      <div className='swapcard-arrows-container'>
        <ArrowUpDown className='swapcard-arrow-icon' onClick={handleFlip} />
      </div>

      <div className='swapcard-label'>Buy (To)</div>
      <div className='swapcard-field-group'>
        <div className='swapcard-box'>
          <TokenSelect
            tokenSymbols={tokenSymbols}
            value={toToken}
            onChange={setToToken}
          />
          <InputNumber
            className='swapcard-amount-input'
            value={toAmount}
            readOnly
          />
        </div>
      </div>

      <Button
        type='primary'
        block
        className='swapcard-button'
        onClick={onSwap}
        loading={swapLoading}
        disabled={Boolean(showAmountError)}
      >
        {swapLoading ? 'Swapping...' : 'Swap'}
      </Button>
    </Card>
  );
};
SwapCard.propTypes = {
  tokenSymbols: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSwap: PropTypes.func.isRequired,
  fromToken: PropTypes.string.isRequired,
  toToken: PropTypes.string.isRequired,
  fromAmount: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.oneOf([null]),
  ]),
  toAmount: PropTypes.number.isRequired,
  setFromToken: PropTypes.func.isRequired,
  setToToken: PropTypes.func.isRequired,
  setFromAmount: PropTypes.func.isRequired,
  setToAmount: PropTypes.func.isRequired,
  swapLoading: PropTypes.bool.isRequired,
  swapSuccessCount: PropTypes.number.isRequired,
};
