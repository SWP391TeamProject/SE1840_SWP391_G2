import React, {createContext, ReactNode, useContext, useEffect} from 'react';
import {getExchangeRates} from "@/services/CurrencyService.ts";

export enum CurrencyType {
  USD = 'USD',
  VND = 'VND',
}

export const currencyNames: { [key in CurrencyType]: string } = {
  [CurrencyType.USD]: 'US Dollar',
  [CurrencyType.VND]: 'Vietnamese Dong'
};

const defaultExchangeRates: { [key in CurrencyType]: number } = {
  [CurrencyType.USD]: 1,
  [CurrencyType.VND]: 25_275
};

export const StandardCurrency = CurrencyType.USD;

export type FormatOptions = {
  minFractionDigits?: number;
  maxFractionDigits?: number;
  baseCurrency?: CurrencyType; // currency of amount, always convert to USD
  currency?: CurrencyType;
  format?: 'full' | 'compact' | 'auto';
  fractionDigits?: 'always' | 'zero';
  exchangeMoney?: boolean;
}

interface ICurrencyContext {
  format: (amount: FormatOptions | number | string, opts?: FormatOptions) => string;
  convert: (amount: number, baseCurrency: CurrencyType, targetCurrency: CurrencyType) => number;
}

const CurrencyContext = createContext<ICurrencyContext | undefined>(undefined);

export const CurrencyProvider: React.FC<{
  children: ReactNode
}> = ({children}) => {
  const exchangeRates = defaultExchangeRates;

  useEffect(() => {
    getExchangeRates().then((data) => {
      Object.entries(data.rates).forEach(([key, value]) => {
        exchangeRates[key as CurrencyType] = value as number;
      })
    });
  }, []);

  const format = (amount: number | string | undefined | null, opts: FormatOptions = {
    minFractionDigits: 1,
    maxFractionDigits: 8,
    baseCurrency: StandardCurrency,
    currency: StandardCurrency,
    format: 'auto',
    fractionDigits: 'zero',
    exchangeMoney: true
  }) => {
    if (!amount)
      amount = 0;
    if (typeof amount === 'number') {
      return _format(amount, opts)
    }
    if (typeof amount === 'string') {
      return _format(parseFloat(amount), opts)
    }
  };

  const _format = (amount: number, {
    minFractionDigits = 1,
    maxFractionDigits = 8,
    baseCurrency = StandardCurrency,
    currency = StandardCurrency,
    format = 'auto',
    fractionDigits = 'zero',
    exchangeMoney = true
  }: FormatOptions) => {
    let suffix = "";
    if (exchangeMoney) {
      amount *= exchangeRates[currency];
      amount /= exchangeRates[baseCurrency];
    }

    if (format == 'auto' && Math.log10(amount) + 1 > 15) {
      format = 'compact';
    }

    if (format == 'compact') {
      const SI_SYMBOL = ["", "k", "M", "G", "T", "P", "E"];

      const tier = Math.log10(Math.abs(amount)) / 3 | 0;
      if (tier > 0) {
        suffix = SI_SYMBOL[tier];
        amount /= Math.pow(10, tier * 3);
        amount = Math.round(amount * 10) / 10;
      }
    }

    if (fractionDigits == 'zero' && amount >= 1) {
      minFractionDigits = 0;
      maxFractionDigits = 0;
    }

    let formatted = new Intl.NumberFormat("en-US", {
      style: 'currency',
      currency: exchangeMoney ? currency : baseCurrency,
      minimumFractionDigits: minFractionDigits,
      maximumFractionDigits: maxFractionDigits,
      useGrouping: true
    }).format(amount);

    function removeTrailingZeros(numStr: string) {
      if (!numStr.includes('.')) {
        return numStr;
      }

      let [integerPart, decimalPart] = numStr.split('.');

      if (/[a-zA-Z]/g.test(decimalPart))
        return numStr;

      decimalPart = decimalPart.replace(/0+$/, '');

      if (decimalPart === '') {
        return integerPart;
      }

      return `${integerPart}.${decimalPart}`;
    }


    return removeTrailingZeros(formatted) + suffix;
  };

  const convert = (amount: number, baseCurrency: CurrencyType, targetCurrency: CurrencyType): number => {
    return amount * exchangeRates[targetCurrency] / exchangeRates[baseCurrency];
  };

  return (
    <CurrencyContext.Provider
      value={{format, convert}}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): ICurrencyContext => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};