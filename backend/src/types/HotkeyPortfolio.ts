import { Decimal } from 'decimal.js';
export interface HotkeyPortfolio {
  [name: string]: {
    hotKey: string;
    weight: Decimal;
    taoAmount: bigint;
  };
}

export default HotkeyPortfolio;
