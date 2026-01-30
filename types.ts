
export enum BotStatus {
  RUNNING = 'Running',
  STOPPED = 'Stopped',
}

export enum BotStrategy {
  GRID = 'Grid Trading',
  DCA = 'Dollar Cost Averaging',
  AI_MOMENTUM = 'AI Momentum',
}

export interface Trade {
  id: string;
  timestamp: string;
  type: 'buy' | 'sell';
  price: number;
  amount: number;
  pnl: number;
}

export interface Bot {
  id:string;
  name: string;
  pair: string;
  strategy: BotStrategy;
  status: BotStatus;
  pnl: number;
  pnlPercent: number;
  weeklyPnlPercent: number;
  monthlyPnlPercent: number;
  uptime: string;
  totalTrades: number;
  winRate: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  collateral: number; // Allocated capital
  trades: Trade[];
  walletAddress?: string;
}

// Added BotData interface for bot creation
export interface BotData {
  name: string;
  pair: string;
  strategy: BotStrategy;
  investment?: string;
  walletAddress?: string;
}

export interface WalletState {
  available: number;
  allocated: number;
  pending: number;
  currency: string;
  auraBalance: number;
}

export interface Transaction {
  id: string;
  timestamp: number;
  type: 'deposit' | 'withdraw' | 'allocation' | 'pnl_sync' | 'fee_deduction';
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  txHash?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  currency: string;
  twoFactorEnabled: boolean;
  lastLoginIp: string;
  plan: 'Elite' | 'Pro' | 'Standard';
}

export interface AuditEntry {
  id: string;
  timestamp: number;
  event: string;
  severity: 'low' | 'medium' | 'high';
}

export interface WhitelistPair {
  id: string;
  pair: string;
  isActive: boolean;
}

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

export interface ApiKey {
  id: string;
  exchange: string;
  key: string;
  secret: string;
}

export interface PriceAlert {
  id: string;
  pair: string;
  targetPrice: number;
  condition: 'above' | 'below';
  isActive: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  timestamp: number;
}

export interface RadarSignal {
    id: string;
    pair: string;
    signal: 'buy' | 'sell';
    confidence: number;
    projectedReturn: number;
}

export interface DailySignal {
    id: string;
    pair: string;
    type: 'long' | 'short';
    status: 'open' | 'closed';
    entryPrice: number;
    pnl?: number;
}

export interface GroundingSource {
    uri: string;
    title: string;
}

export interface MarketPattern {
    name: string;
    timeframe: string;
    confidence: 'High' | 'Medium' | 'Low';
    description: string;
    asset: string;
    sources?: GroundingSource[];
}

export interface BacktestResults {
    netProfit: number;
    totalReturn: number;
    winRate: number;
    maxDrawdown: number;
    totalTrades: number;
    summary: string;
}
