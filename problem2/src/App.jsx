import { useEffect, useRef, useState } from 'react';
import { message, Spin } from 'antd';
import { SwapCard } from './SwapCard';
import 'antd/dist/reset.css';
import './App.css';
import { getAmountError, isValidAmount } from './amountValidation';

function App() {
  const [loadingPrices, setLoadingPrices] = useState(true);
  const [swapLoading, setSwapLoading] = useState(false);
  const [prices, setPrices] = useState({});
  const [tokenSymbols, setTokenSymbols] = useState([]);
  const [fromToken, setFromToken] = useState('');
  const [toToken, setToToken] = useState('');
  const [fromAmount, setFromAmount] = useState(0);
  const [toAmount, setToAmount] = useState(0);
  const [swapSuccessCount, setSwapSuccessCount] = useState(0);
  const swapTimeoutRef = useRef(null);

  const clearSwapTimeout = () => {
    if (swapTimeoutRef.current !== null) {
      clearTimeout(swapTimeoutRef.current);
      swapTimeoutRef.current = null;
    }
  };

  useEffect(() => {
    fetch('https://interview.switcheo.com/prices.json')
      .then((res) => res.json())
      .then((data) => {
        const priceMap = data.reduce((acc, item) => {
          if (
            typeof item.price === 'number' &&
            !isNaN(item.price) &&
            item.price > 0
          ) {
            acc[item.currency] = item.price;
          }
          return acc;
        }, {});
        const validSymbols = Object.keys(priceMap).sort((a, b) =>
          a.localeCompare(b, undefined, { sensitivity: 'base' })
        );
        setPrices(priceMap);
        setTokenSymbols(validSymbols);
        setLoadingPrices(false);
      })
      .catch((err) => {
        console.error(err);
        message.error('Failed to load token prices');
        setLoadingPrices(false);
      });
  }, []);

  useEffect(() => {
    if (fromToken && toToken && isValidAmount(fromAmount)) {
      const fromPrice = prices[fromToken];
      const toPrice = prices[toToken];
      if (fromPrice && toPrice) {
        const usdValue = fromAmount * fromPrice;
        setToAmount(usdValue / toPrice);
      } else {
        setToAmount(0);
      }
    } else {
      setToAmount(0);
    }
  }, [fromAmount, fromToken, toToken, prices]);

  useEffect(() => {
    return () => {
      clearSwapTimeout();
    };
  }, []);

  const handleSwap = () => {
    if (!fromToken || !toToken) {
      message.error('Please select both tokens');
      return;
    }
    if (fromToken === toToken) {
      message.error('Cannot swap the same token');
      return;
    }
    const amountError = getAmountError(fromAmount);
    if (amountError) {
      message.error(amountError);
      return;
    }
    clearSwapTimeout();
    setSwapLoading(true);
    swapTimeoutRef.current = setTimeout(() => {
      swapTimeoutRef.current = null;
      setSwapLoading(false);
      setFromAmount(0);
      setToAmount(0);
      setSwapSuccessCount((count) => count + 1);
      message.success(
        `Swapped ${fromAmount} ${fromToken} for ${toAmount.toFixed(
          6
        )} ${toToken}`
      );
    }, 1500);
  };

  if (loadingPrices) {
    return (
      <div className='app-center-wrapper'>
        <Spin tip='Loading token prices...' />
      </div>
    );
  }

  return (
    <div className='app-container'>
      <SwapCard
        tokenSymbols={tokenSymbols}
        onSwap={handleSwap}
        fromToken={fromToken}
        toToken={toToken}
        fromAmount={fromAmount}
        toAmount={toAmount}
        setFromToken={setFromToken}
        setToToken={setToToken}
        setFromAmount={setFromAmount}
        setToAmount={setToAmount}
        swapLoading={swapLoading}
        swapSuccessCount={swapSuccessCount}
      />
    </div>
  );
}

export default App;
