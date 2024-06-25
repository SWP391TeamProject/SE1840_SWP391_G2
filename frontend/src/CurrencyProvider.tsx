import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from 'react';
import {getExchangeRates} from "@/services/CurrencyService.ts";

export enum CurrencyType {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  CNY = 'CNY',
  JPY = 'JPY',
  VND = 'VND',
  BTC = 'BTC',
  DOGE = 'DOGE',
  JACK = 'JACK',
  FPT = 'FPT',
}

export const currencyNames: { [key in CurrencyType]: string } = {
  [CurrencyType.USD]: 'US Dollar',
  [CurrencyType.VND]: 'Vietnamese Dong',
  [CurrencyType.EUR]: 'Euro',
  [CurrencyType.GBP]: 'British Pound',
  [CurrencyType.CNY]: 'Chinese Yuan',
  [CurrencyType.JPY]: 'Japanese Yen',
  [CurrencyType.BTC]: 'Bitcoin',
  [CurrencyType.DOGE]: 'Dogecoin',
  [CurrencyType.JACK]: 'Jack',
  [CurrencyType.FPT]: 'FPT',
};

export const currencySymbol: Partial<{ [key in CurrencyType]: string }> = {
  [CurrencyType.BTC]: '₿',
  [CurrencyType.DOGE]: 'Ɖ',
  [CurrencyType.JACK]: '𝓙𝓪𝓬𝓴',
  [CurrencyType.FPT]: '𝓕𝓟𝓣'
}

const defaultExchangeRates: { [key in CurrencyType]: number } = {
  [CurrencyType.USD]: 1,
  [CurrencyType.VND]: 25_000,
  [CurrencyType.EUR]: 0.93,
  [CurrencyType.GBP]: 0.79,
  [CurrencyType.CNY]: 7.26,
  [CurrencyType.JPY]: 159.48,
  [CurrencyType.BTC]: 0.000016,
  [CurrencyType.DOGE]: 8.55,
  [CurrencyType.JACK]: 5_000_000 / 25_000,
  [CurrencyType.FPT]: 32_500_000 / 25_000,
};

export const StandardCurrency = CurrencyType.USD;

export type FormatOptions = {
  amount: number;
  fractionDigits?: number;
  baseCurrency?: CurrencyType;
  currency?: CurrencyType;
  compact?: boolean;
  exchangeMoney?: boolean;
}

interface ICurrencyContext {
  getCurrencyType: () => CurrencyType;
  setCurrencyType: (type: CurrencyType) => void;
  format: (opts: FormatOptions) => string;
}

const currencyFormatPreferenceKey = "currencyFormatPreference";

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

  const [currencyType, setCurrencyType] = useState<CurrencyType>(
    () => (localStorage.getItem(currencyFormatPreferenceKey) as CurrencyType) || CurrencyType.USD
  );

  const setCurrency = (type: CurrencyType) => {
    setCurrencyType(type);
    localStorage.setItem(currencyFormatPreferenceKey, type);
  };

  const getCurrencyType = () => {
    return currencyType;
  };

  const format = ({
                    amount: number,
                    fractionDigits = 6,
                    baseCurrency = StandardCurrency,
                    currency = currencyType,
                    compact = false,
                    exchangeMoney = true
                  }: FormatOptions) => {
    let suffix = "";
    if (exchangeMoney) {
      number *= exchangeRates[currency];
      number /= exchangeRates[baseCurrency];
    }

    if (compact) {
      const SI_SYMBOL = ["", "k", "M", "G", "T", "P", "E"];

      const tier = Math.log10(Math.abs(number)) / 3 | 0;
      if (tier > 0) {
        suffix = SI_SYMBOL[tier];
        number /= Math.pow(10, tier * 3);
        number = Math.round(number * 10) / 10;
      }
    }

    let formatted;
    if (currencySymbol[currency] === undefined) {
      formatted = new Intl.NumberFormat("en-US", {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
        useGrouping: true
      }).format(number);
    } else {
      formatted = currencySymbol[currency] + " " + number.toFixed(fractionDigits);
    }

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

  return (
    <CurrencyContext.Provider
      value={{getCurrencyType, setCurrencyType: setCurrency, format}}>
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