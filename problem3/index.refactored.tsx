import React, { useMemo } from 'react';

type SupportedChain = 'Osmosis' | 'Ethereum' | 'Arbitrum' | 'Zilliqa' | 'Neo';

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
  priority: number;
}

interface Props extends BoxProps {}

const PRIORITY_BY_CHAIN: Record<SupportedChain, number> = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
};

const getPriority = (blockchain: string): number | null => {
  if (blockchain in PRIORITY_BY_CHAIN) {
    return PRIORITY_BY_CHAIN[blockchain as SupportedChain];
  }
  return null;
};

const formatAmount = (amount: number): string => amount.toFixed();

const WalletPage: React.FC<Props> = ({ children, ...rest }) => {
  const balances = useWalletBalances();
  const prices = usePrices();

  const displayBalances = useMemo<FormattedWalletBalance[]>(() => {
    return balances
      .map((balance) => {
        const priority = getPriority(balance.blockchain);
        return { ...balance, priority };
      })
      .filter(
        (balance): balance is WalletBalance & { priority: number } =>
          balance.priority !== null && balance.amount > 0,
      )
      .sort((a, b) => b.priority - a.priority)
      .map((balance) => ({
        ...balance,
        formatted: formatAmount(balance.amount),
      }));
  }, [balances]);

  const rows = useMemo(() => {
    return displayBalances.map((balance) => {
      const usdValue = (prices[balance.currency] ?? 0) * balance.amount;
      return (
        <WalletRow
          className={classes.row}
          key={`${balance.blockchain}-${balance.currency}`}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    });
  }, [displayBalances, prices]);

  return (
    <div {...rest}>
      {rows}
      {children}
    </div>
  );
};
