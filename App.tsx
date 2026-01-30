
import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { WithdrawModal } from './components/WithdrawModal';
import { AnalysisModal } from './components/AnalysisModal';
import { ChartModal } from './components/ChartModal';
import { CreateBotModal } from './components/CreateBotModal';
import { AgentModal } from './components/AgentModal';
import { TradeLogModal } from './components/TradeLogModal';
import { FallingCoins } from './components/FallingCoins';
import { ApiKeysModal } from './components/ApiKeysModal';
import { InstallWalletModal } from './components/InstallWalletModal';
import { PriceAlertsModal } from './components/PriceAlertsModal';
import { NotificationToast } from './components/NotificationToast';
import { WhitelistModal } from './components/WhitelistModal';
import { SecurityGateway } from './components/SecurityGateway';
import { TransactionHistoryModal } from './components/TransactionHistoryModal';
import { SecuritySettingsModal } from './components/SecuritySettingsModal';
import { MonetizationModal } from './components/MonetizationModal';
import { ConfirmationModal } from './components/ConfirmationModal';
import { PatternRecognitionModal } from './components/PatternRecognitionModal';
import { BacktestingModal } from './components/BacktestingModal';
import { getTradingAnalysis, getAgentResponse, getPatternAnalysis, getBacktestingAnalysis } from './services/geminiService';
import { 
  Bot, BotStatus, BotStrategy, ChatMessage, ApiKey, 
  PriceAlert, AppNotification, WhitelistPair, 
  WalletState, Transaction, UserProfile, AuditEntry, BotData, RadarSignal, DailySignal, MarketPattern,
  BacktestResults
} from './types';

const initialBots: Bot[] = [
  {
    id: 'b-001',
    name: 'Quantum Alpha BTC',
    pair: 'BTC/USDT',
    strategy: BotStrategy.GRID,
    status: BotStatus.RUNNING,
    pnl: 412.55,
    pnlPercent: 8.25,
    weeklyPnlPercent: 1.85,
    monthlyPnlPercent: 7.23,
    uptime: '12d 4h',
    totalTrades: 842,
    winRate: 74.2,
    riskLevel: 'Medium',
    collateral: 5000,
    trades: [],
    walletAddress: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F'
  }
];

const initialRadarSignals: RadarSignal[] = [
    { id: 'rs-1', pair: 'ETH/USDT', signal: 'buy', confidence: 88.2, projectedReturn: 3.45 },
    { id: 'rs-2', pair: 'SOL/USDT', signal: 'sell', confidence: 79.5, projectedReturn: -2.10 },
    { id: 'rs-3', pair: 'LINK/USDT', signal: 'buy', confidence: 91.0, projectedReturn: 5.20 },
    { id: 'rs-4', pair: 'AVAX/USDT', signal: 'buy', confidence: 85.7, projectedReturn: 2.88 },
    { id: 'rs-5', pair: 'DOGE/USDT', signal: 'sell', confidence: 72.1, projectedReturn: -1.55 },
];

const initialDailySignals: DailySignal[] = [
    { id: 'ds-1', pair: 'LINK/USDT', type: 'long', status: 'open', entryPrice: 18.45 },
    { id: 'ds-2', pair: 'MATIC/USDT', type: 'short', status: 'closed', entryPrice: 0.72, pnl: 2.15 },
    { id: 'ds-3', pair: 'RNDR/USDT', type: 'long', status: 'open', entryPrice: 10.88 },
    { id: 'ds-4', pair: 'SUI/USDT', type: 'short', status: 'open', entryPrice: 1.13 },
];

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile] = useState<UserProfile>({
    id: 'U-9921',
    email: 'alpha.trader@aura.elite',
    currency: 'USDT',
    twoFactorEnabled: true,
    lastLoginIp: '192.168.1.104',
    plan: 'Elite'
  });

  const [wallet, setWallet] = useState<WalletState>({
    available: 15420.50,
    allocated: 5000,
    pending: 0,
    currency: 'USDT',
    auraBalance: 12500
  });

  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 'tx-1', timestamp: Date.now() - 86400000, type: 'deposit', amount: 20000, status: 'completed', txHash: '0x55a...f91' },
    { id: 'tx-2', timestamp: Date.now() - 43200000, type: 'allocation', amount: 5000, status: 'completed' }
  ]);

  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([
    { id: 'aud-1', timestamp: Date.now() - 3600000, event: 'API Key Verification Succeeded', severity: 'low' },
    { id: 'aud-2', timestamp: Date.now() - 1800000, event: 'New Bot "Quantum Alpha" Initialized', severity: 'medium' }
  ]);

  const [bots, setBots] = useState<Bot[]>(initialBots);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [radarSignals, setRadarSignals] = useState<RadarSignal[]>(initialRadarSignals);
  const [dailySignals, setDailySignals] = useState<DailySignal[]>(initialDailySignals);
  const [whitelist, setWhitelist] = useState<WhitelistPair[]>([
    { id: 'w1', pair: 'BTC/USDT', isActive: true },
    { id: 'w2', pair: 'ETH/USDT', isActive: true }
  ]);
  const [masterWallet, setMasterWallet] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  
  const [modals, setModals] = useState({
    withdraw: false, analysis: false, createBot: false, agent: false,
    tradeLog: false, apiKeys: false, installWallet: false, chart: false,
    alerts: false, whitelist: false, transactions: false, security: false,
    monetization: false, patternRecognition: false, backtesting: false
  });

  const [confirmation, setConfirmation] = useState({
    isOpen: false, title: '', message: '',
    onConfirm: () => {}, confirmText: 'Confirm',
    variant: 'warning' as 'warning' | 'danger'
  });

  const [patternState, setPatternState] = useState({ loading: false, patterns: [] as MarketPattern[] });
  const [backtestState, setBacktestState] = useState<{loading: boolean; results: BacktestResults | null}>({ loading: false, results: null });
  const [selectedBot, setSelectedBot] = useState<Bot | null>(null);
  const [selectedPair, setSelectedPair] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState({ result: '', loading: false });
  const [agentChat, setAgentChat] = useState({ conversation: [] as ChatMessage[], loading: false });
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);

  const addNotification = useCallback((title: string, message: string, type: AppNotification['type']) => {
    setNotifications(prev => [{
      id: `notify-${Date.now()}`, title, message, type, timestamp: Date.now()
    }, ...prev].slice(0, 5));
  }, []);

  const addAudit = useCallback((event: string, severity: AuditEntry['severity'] = 'low') => {
    setAuditLogs(prev => [{ id: `aud-${Date.now()}`, timestamp: Date.now(), event, severity }, ...prev].slice(0, 20));
  }, []);

  const addTransaction = useCallback((tx: Omit<Transaction, 'id' | 'timestamp'>) => {
    setTransactions(prev => [{ ...tx, id: `tx-${Date.now()}`, timestamp: Date.now() }, ...prev]);
  }, []);
  
  const toggleModal = (key: keyof typeof modals, val: boolean) => setModals(prev => ({ ...prev, [key]: val }));

  const handlePatternAnalysis = useCallback(async () => {
    toggleModal('patternRecognition', true);
    setPatternState({ loading: true, patterns: [] });
    addAudit("AI Market Structure Scan initiated.", "low");
    const assetsToScan = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT'];
    const analysisPromises = assetsToScan.map(asset => getPatternAnalysis(asset));
    const results = await Promise.all(analysisPromises);
    
    const parsedPatterns = results.map((res, index) => {
        const [name, timeframe, description] = res.analysis.split('|');
        const sources = res.sources.map((s: any) => ({
            uri: s.web?.uri || '',
            title: s.web?.title || 'Untitled Source'
        })).filter(s => s.uri);

        return { 
            name, 
            timeframe, 
            asset: assetsToScan[index],
            description: description?.trim(), 
            confidence: 'High' as 'High',
            sources 
        };
    });
    
    addAudit(`Pattern Scan complete: ${parsedPatterns.length} significant structures detected.`);
    setPatternState({ loading: false, patterns: parsedPatterns });
  }, [addAudit]);
  
  const handleRunBacktest = useCallback(async (pair: string, timeframe: string, components: string[]) => {
    setBacktestState({ loading: true, results: null });
    addAudit(`Backtest initiated for ${pair} on ${timeframe}.`, "medium");
    const resultString = await getBacktestingAnalysis(pair, timeframe, components);
    const [netProfit, totalReturn, winRate, maxDrawdown, totalTrades, summary] = resultString.split('|');

    setBacktestState({
        loading: false,
        results: {
            netProfit: parseFloat(netProfit),
            totalReturn: parseFloat(totalReturn),
            winRate: parseFloat(winRate),
            maxDrawdown: parseFloat(maxDrawdown),
            totalTrades: parseInt(totalTrades),
            summary: summary.trim(),
        }
    });
    addAudit(`Backtest for ${pair} completed. Return: ${totalReturn}%`);
  }, [addAudit]);
  
  const handleRequestConfirmation = (title: string, message: string, onConfirm: () => void, confirmText: string, variant: 'warning' | 'danger') => {
    setConfirmation({ isOpen: true, title, message, onConfirm, confirmText, variant });
  };
  
  const closeConfirmation = () => setConfirmation({ ...confirmation, isOpen: false });

  const handleSyncBlockchain = useCallback(async () => {
    setIsSyncing(true);
    addAudit("Manual Market Re-index Started", "low");
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsSyncing(false);
    addNotification("Sync Complete", "Market data stream is now fully indexed with the chain.", "info");
    addAudit("Market Index Sync Successful", "low");
  }, [addAudit, addNotification]);

  const handleDeposit = async (amount: number) => {
    addTransaction({ type: 'deposit', amount, status: 'processing' });
    addNotification("Deposit Incoming", `Network broadcast detected for ${amount} ${wallet.currency}.`, "info");
    addAudit(`Deposit request detected for ${amount} ${wallet.currency}`, 'low');
    setTimeout(() => {
      setTransactions(prev => prev.map(tx => tx.type === 'deposit' && tx.status === 'processing' ? { ...tx, status: 'completed', txHash: '0x' + Math.random().toString(16).slice(2, 12) } : tx));
      setWallet(prev => ({ ...prev, available: prev.available + amount }));
      addNotification("Deposit Confirmed", `${amount} ${wallet.currency} credited to liquidity pool.`, "success");
      addAudit(`Account credited: +${amount} ${wallet.currency}`, 'low');
    }, 4000);
  };

  const handleWithdrawal = async (amount: number, address: string) => {
    if (amount > wallet.available) return;
    setWallet(prev => ({ ...prev, available: prev.available - amount, pending: prev.pending + amount }));
    addTransaction({ type: 'withdraw', amount, status: 'pending' });
    addNotification("Withdrawal Initiated", `Queueing ${amount} ${wallet.currency} for on-chain broadcast.`, "info");
    addAudit(`Withdrawal requested to ${address.substring(0, 8)}...`, 'medium');
    setTimeout(() => {
      setTransactions(prev => prev.map(tx => tx.type === 'withdraw' && tx.status === 'pending' ? { ...tx, status: 'processing' } : tx));
      setTimeout(() => {
        setTransactions(prev => prev.map(tx => tx.type === 'withdraw' && tx.status === 'processing' ? { ...tx, status: 'completed', txHash: '0x' + Math.random().toString(16).slice(2, 12) } : tx));
        setWallet(prev => ({ ...prev, pending: prev.pending - amount }));
        addNotification("Transaction Confirmed", "On-chain verification complete.", "success");
        addAudit(`Withdrawal finalized: -${amount} ${wallet.currency}`, 'low');
      }, 5000);
    }, 3000);
  };

  const handleToggleBotStatus = (botId: string) => {
    const bot = bots.find(b => b.id === botId);
    if (!bot) return;
    const isActivating = bot.status === BotStatus.STOPPED;
    handleRequestConfirmation(
        isActivating ? 'Confirm Activation' : 'Confirm Deactivation',
        `Are you sure you want to ${isActivating ? 'activate' : 'deactivate'} the "${bot.name}" protocol?`,
        () => {
            setBots(current => current.map(b => {
                if (b.id === botId) {
                    if (isActivating) addAudit(`Protocol Start: ${b.name}`, 'low');
                    else addAudit(`Protocol Halt: ${b.name}`, 'medium');
                    return { ...b, status: isActivating ? BotStatus.RUNNING : BotStatus.STOPPED };
                }
                return b;
            }));
        },
        isActivating ? 'Activate' : 'Deactivate',
        'warning'
    );
  };

  const handleCreateBot = (data: BotData) => {
    const investment = parseFloat(data.investment || '1000') || 1000;
    if (investment > wallet.available) {
      addNotification("Insufficient Capital", "Main wallet balance too low for this allocation.", "warning");
      return;
    }
    const newBot: Bot = {
      id: `bot-${Date.now()}`, name: data.name, pair: data.pair, strategy: data.strategy,
      status: BotStatus.STOPPED, pnl: 0, pnlPercent: 0, uptime: '0h',
      totalTrades: 0, winRate: 0, riskLevel: 'Medium', collateral: investment,
      trades: [], walletAddress: data.walletAddress || masterWallet || undefined,
      weeklyPnlPercent: 0, monthlyPnlPercent: 0
    };
    setWallet(prev => ({ ...prev, available: prev.available - investment, allocated: prev.allocated + investment }));
    setBots(prev => [...prev, newBot]);
    addTransaction({ type: 'allocation', amount: investment, status: 'completed' });
    toggleModal('createBot', false);
    addNotification("Bot Active", `${newBot.name} is now monitoring the ${newBot.pair} stream.`, "success");
    addAudit(`Strategic allocation of ${investment} to ${newBot.name}`);
  };
  
  const handleProtocolReset = () => {
    handleRequestConfirmation(
        'System Halt Confirmation',
        'This will immediately stop and delete all active bot protocols. This action is irreversible.',
        () => {
            addAudit("System Reset Protocol Triggered", "high");
            setBots([]);
            addNotification("System Halt", "All bot protocols have been purged.", "warning");
        },
        'Confirm System Halt',
        'danger'
    );
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    const performanceFee = 0.05; // 5%
    const botInterval = setInterval(() => {
      setBots(current => current.map(bot => {
        if (bot.status === BotStatus.RUNNING) {
          const pnlDelta = (Math.random() - 0.48) * 1.5;
          let netPnl = pnlDelta;
          if (pnlDelta > 0) {
            const fee = pnlDelta * performanceFee;
            netPnl = pnlDelta - fee;
            addTransaction({ type: 'fee_deduction', amount: fee, status: 'completed' });
          }
          return { 
            ...bot, pnl: bot.pnl + netPnl, 
            pnlPercent: bot.pnlPercent + (netPnl / bot.collateral * 100),
            totalTrades: Math.random() > 0.95 ? bot.totalTrades + 1 : bot.totalTrades
          };
        }
        return bot;
      }));
    }, 2000);

    const radarInterval = setInterval(() => {
      setRadarSignals(current => current.map(signal => ({
        ...signal,
        confidence: Math.max(70, Math.min(99, signal.confidence + (Math.random() - 0.5) * 1.5)),
        projectedReturn: signal.projectedReturn + (Math.random() - 0.5) * 0.2
      })));
    }, 3000);

    const signalInterval = setInterval(() => {
      setDailySignals(current => {
          const newSignals = [...current];
          const openSignalIndex = newSignals.findIndex(s => s.status === 'open');
          if (openSignalIndex !== -1 && Math.random() > 0.7) {
              const closedSignal = { ...newSignals[openSignalIndex] };
              closedSignal.status = 'closed';
              closedSignal.pnl = (Math.random() - 0.3) * 5;
              newSignals[openSignalIndex] = closedSignal;
          }
          return newSignals;
      });
    }, 5000);

    return () => {
        clearInterval(botInterval);
        clearInterval(radarInterval);
        clearInterval(signalInterval);
    };
  }, [isAuthenticated, addTransaction]);

  if (!isAuthenticated) return <SecurityGateway onAuthenticated={() => setIsAuthenticated(true)} />;

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <FallingCoins />
      <NotificationToast notifications={notifications} onDismiss={(id) => setNotifications(prev => prev.filter(n => n.id !== id))} />
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header 
          isAdmin={isAdmin} onToggleAdmin={() => setIsAdmin(!isAdmin)} 
          isSyncing={isSyncing} onSync={handleSyncBlockchain}
          onOpenAlerts={() => toggleModal('alerts', true)}
          alertCount={alerts.filter(a => a.isActive).length}
          masterWallet={masterWallet}
          onSyncWallet={() => toggleModal('security', true)}
          onOpenPatternRecognition={handlePatternAnalysis}
        />
        
        <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-8">
          <Dashboard
            bots={bots} isAdmin={isAdmin} wallet={wallet}
            radarSignals={radarSignals} dailySignals={dailySignals}
            onToggleBotStatus={handleToggleBotStatus}
            onSyncWallet={(id) => toggleModal('security', true)}
            onWithdraw={() => toggleModal('withdraw', true)}
            onAnalyze={async (bot) => {
                setSelectedBot(bot); toggleModal('analysis', true);
                setAnalysis({ result: '', loading: true });
                const res = await getTradingAnalysis(bot.pair, bot.strategy);
                setAnalysis({ result: res, loading: false });
            }}
            onOpenChart={(p) => { setSelectedPair(p); toggleModal('chart', true); }}
            onOpenCreateBotModal={() => toggleModal('createBot', true)}
            onOpenAgentModal={(b) => { setSelectedBot(b); toggleModal('agent', true); }}
            onOpenTradeLogModal={(b) => { setSelectedBot(b); toggleModal('tradeLog', true); }}
            onOpenApiKeysModal={() => toggleModal('apiKeys', true)}
            onOpenWhitelistModal={() => toggleModal('whitelist', true)}
            onOpenTransactions={() => toggleModal('transactions', true)}
            onOpenMonetization={() => toggleModal('monetization', true)}
            onOpenBacktesting={() => toggleModal('backtesting', true)}
            onProtocolReset={handleProtocolReset}
          />
        </main>
        
        <footer className="py-6 border-t border-slate-800 text-center text-slate-500 text-[10px] font-mono uppercase tracking-[0.2em]">
          &copy; 2025 AuraTrade SOC • Encrypted Payload • Session Hash: {Math.random().toString(16).substring(2, 14)}
        </footer>
      </div>

      <ConfirmationModal
          isOpen={confirmation.isOpen}
          onClose={closeConfirmation}
          onConfirm={() => {
              confirmation.onConfirm();
              closeConfirmation();
          }}
          title={confirmation.title}
          message={confirmation.message}
          confirmText={confirmation.confirmText}
          confirmVariant={confirmation.variant}
      />
      <WithdrawModal 
        isOpen={modals.withdraw} onClose={() => toggleModal('withdraw', false)} 
        wallet={wallet} onConfirmWithdraw={handleWithdrawal} onConfirmDeposit={handleDeposit}
      />
      <MonetizationModal isOpen={modals.monetization} onClose={() => toggleModal('monetization', false)} profile={userProfile} wallet={wallet} />
      <AnalysisModal isOpen={modals.analysis} onClose={() => toggleModal('analysis', false)} {...analysis} bot={selectedBot} />
      <ChartModal isOpen={modals.chart} onClose={() => toggleModal('chart', false)} pair={selectedPair} />
      <CreateBotModal 
        isOpen={modals.createBot} onClose={() => toggleModal('createBot', false)} 
        onCreateBot={handleCreateBot} whitelist={whitelist.filter(w => w.isActive)} 
        masterWallet={masterWallet} availableBalance={wallet.available}
      />
      <AgentModal 
        isOpen={modals.agent} onClose={() => toggleModal('agent', false)} 
        bot={selectedBot} {...agentChat} 
        onSendMessage={async (q) => {
          if (!selectedBot) return;
          setAgentChat(p => ({ ...p, conversation: [...p.conversation, { sender: 'user', text: q }], loading: true }));
          const ans = await getAgentResponse(selectedBot, q);
          setAgentChat(p => ({ ...p, conversation: [...p.conversation, { sender: 'ai', text: ans }], loading: false }));
        }} 
      />
      <TradeLogModal 
        isOpen={modals.tradeLog} onClose={() => toggleModal('tradeLog', false)} 
        bot={selectedBot} onFlushLogs={() => {}} 
      />
      <ApiKeysModal isOpen={modals.apiKeys} onClose={() => toggleModal('apiKeys', false)} apiKeys={apiKeys} onAddKey={() => {}} onDeleteKey={() => {}} />
      <TransactionHistoryModal isOpen={modals.transactions} onClose={() => toggleModal('transactions', false)} transactions={transactions} />
      <SecuritySettingsModal isOpen={modals.security} onClose={() => toggleModal('security', false)} profile={userProfile} auditLogs={auditLogs} />
      <WhitelistModal 
        isOpen={modals.whitelist} onClose={() => toggleModal('whitelist', false)} 
        whitelist={whitelist} onTogglePair={() => {}} onAddPair={() => {}} onDeletePair={() => {}}
      />
      <PriceAlertsModal isOpen={modals.alerts} onClose={() => toggleModal('alerts', false)} alerts={alerts} onAddAlert={() => {}} onDeleteAlert={() => {}} onToggleAlert={() => {}} />
      <InstallWalletModal isOpen={modals.installWallet} onClose={() => toggleModal('installWallet', false)} />
      <PatternRecognitionModal 
        isOpen={modals.patternRecognition} 
        onClose={() => toggleModal('patternRecognition', false)} 
        {...patternState}
      />
      <BacktestingModal
        isOpen={modals.backtesting}
        onClose={() => toggleModal('backtesting', false)}
        onRunBacktest={handleRunBacktest}
        {...backtestState}
      />
    </div>
  );
};

export default App;
