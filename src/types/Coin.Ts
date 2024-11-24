// src/types/Coin.ts
export interface Coin {
    id: string;
    name: string;
    symbol: string;
    tokenMintAddress: string;
    currentPrice: number;
    supplyBalance: number;
    borrowBalance: number;
    dollarValue: number;
    supplyAPY: number;
    borrowAPY: number;
    liquidationThreshold1: number;
    liquidationThreshold2: number;
    liquidationPenalty: number;
    LTV: number;
    depositAmount: number;
    borrowAmount: number;
    
  }
  