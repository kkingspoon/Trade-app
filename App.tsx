import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
import { ConnectWalletModal } from './components/ConnectWalletModal';
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
import { EarnModal } from './components/EarnModal';
import { useWallet } from './hooks/useWallet';
import { getTradingAnalysis, getAgentResponse, getPatternAnalysis, getBacktestingAnalysis, generateEarnQuiz } from './services/geminiService';
import { 
  Bot, BotStatus, BotStrategy, ChatMessage, ApiKey, 
  PriceAlert, AppNotification, WhitelistPair, 
  WalletState, Transaction, UserProfile, AuditEntry, BotData, RadarSignal, DailySignal, MarketPattern,
  BacktestResults, EarnMission, PortfolioMetrics
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
    walletAddress: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    lastChainSync: Date.now() - 3600000
  },
  {
    id: 'b-002',
    name: 'Neural Ethos ETH',
    pair: 'ETH/USDT',
    strategy: BotStrategy.AI_MOMENTUM,
    status: BotStatus.STOPPED,
    pnl: -45.20,
    pnlPercent: -1.5,
    weeklyPnlPercent: -0.8,
    monthlyPnlPercent: 3.2,
    uptime: '2d 12h',
    totalTrades: 124,
    winRate: 62.5,
    riskLevel: 'High',
    collateral: 3000,
    trades: [],
    walletAddress: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    lastChainSync: Date.now() - 7200000
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
  const walletApi = useWallet();
  
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
    allocated: 8000,
    pending: 0,
    currency: 'USDT',
    auraBalance: 12500,
    lastFaucetClaim: 0
  });

  const [portfolioMetrics, setPortfolioMetrics] = useState<PortfolioMetrics>({
    totalWinRate: 68.35,
    activeNodes: 1,
    lastRollupHash: '0x3f...9e2a',
    blockHeight: 19842031
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
  const [isPortfolioSyncing, setIsPortfolioSyncing] = useState(false);
  const [isIpfsSaving, setIsIpfsSaving] = useState(false);
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
    tradeLog: false, apiKeys: false, connectWallet: false, chart: false,
    alerts: false, whitelist: false, transactions: false, security: false,
    monetization: false, patternRecognition: false, backtesting: false,
    installWallet: false, earn: false
  });

  const [confirmation, setConfirmation] = useState({
    isOpen: false, title: '', message: '',
    onConfirm: () => {}, confirmText: 'Confirm',
    variant: 'warning' as 'warning' | 'danger'
  });

  const [patternState, setPatternState] = useState({ loading: false, patterns: [] as MarketPattern[] });
  const [backtestState, setBacktestState] = useState<{loading: boolean; results: BacktestResults | null}>({ loading: false, results: null });
  const [earnMission, setEarnMission] = useState<{loading: boolean; mission: EarnMission | null}>({ loading: false, mission: null });
  const [selectedBot, setSelectedBot] = useState<Bot | null>(null);
  const [selectedPair, setSelectedPair] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState({ result: '', loading: false });
  const [agentChat, setAgentChat] = useState({ conversation: [] as ChatMessage[], loading: false });
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);

  // Calculation for global win rate
  useEffect(() => {
    if (bots.length === 0) return;
    const avgWinRate = bots.reduce((acc, bot) => acc + bot.winRate, 0) / bots.length;
    const runningNodes = bots.filter(b => b.status === BotStatus.RUNNING).length;
    setPortfolioMetrics(prev => ({ 
        ...prev, 
        totalWinRate: avgWinRate,
        activeNodes: runningNodes
    }));
  }, [bots]);

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

  const simulateTransaction = useCallback(async (title: string, onSuccess: () => void) => {
    addNotification("Signature Required", `Please approve the "${title}" transaction in your wallet.`, "info");
    await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate signing
    addNotification("Transaction Broadcast", `Your "${title}" transaction has been sent to the network.`, "success");
    onSuccess();
  }, [addNotification]);

  const handleFetchMission = useCallback(async () => {
    setEarnMission({ loading: true, mission: null });
    const mission = await generateEarnQuiz();
    setEarnMission({ loading: false, mission });
  }, []);

  const handleOpenEarnModal = () => {
    toggleModal('earn', true);
    if (!earnMission.mission) {
      handleFetchMission();
    }
  };

  const handleCompleteMission = (mission: EarnMission) => {
    setWallet(prev => ({ ...prev, auraBalance: prev.auraBalance + mission.reward }));
    addTransaction({ type: 'reward', amount: mission.reward, status: 'completed' });
    addNotification("Neural Reward", `Successfully calibrated! Earned ${mission.reward} $AURA.`, "success");
    addAudit(`AI Mission Completed: +${mission.reward} $AURA`, 'low');
    handleFetchMission(); // Load next mission
  };

  const handleClaimFaucet = () => {
    const reward = 50;
    setWallet(prev => ({ ...prev, available: prev.available + reward, lastFaucetClaim: Date.now() }));
    addTransaction({ type: 'faucet', amount: reward, status: 'completed' });
    addNotification("Liquidity Claimed", "Energy Reclaim successful. 50 USDT added.", "success");
    addAudit("Daily Faucet Claimed", "low");
  };

  const handleSyncPortfolioToChain = useCallback(async () => {
    setIsPortfolioSyncing(true);
    addAudit("Portfolio Roll-up Merge Started", "medium");
    await new Promise(resolve => setTimeout(resolve, 4000));
    
    const newHash = '0x' + Math.random().toString(16).slice(2, 42);
    setPortfolioMetrics(prev => ({
        ...prev,
        lastRollupHash: newHash.slice(0, 8) + '...' + newHash.slice(-4),
        blockHeight: prev.blockHeight + Math.floor(Math.random() * 10) + 1
    }));
    
    setBots(current => current.map(bot => ({ ...bot, lastChainSync: Date.now() })));
    
    setIsPortfolioSyncing(false);
    addNotification("Roll-up Successful", "Portfolio state committed to Chain Layer.", "success");
    addAudit(`Roll-up Success: Hash ${newHash.slice(0, 10)}...`, "low");
  }, [addAudit, addNotification]);

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
    addAudit("Global Market Index Sync Started", "low");
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsSyncing(false);
    addNotification("Market Stream Ready", "Market data pipeline is fully synchronized.", "info");
    addAudit("Market Stream Index Successful", "low");
  }, [addAudit, addNotification]);

  const handleDeposit = async (amount: number) => {
    simulateTransaction('Deposit', () => {
        addTransaction({ type: 'deposit', amount, status: 'processing' });
        setTimeout(() => {
          setTransactions(prev => prev.map(tx => tx.type === 'deposit' && tx.status === 'processing' ? { ...tx, status: 'completed', txHash: '0x' + Math.random().toString(16).slice(2, 12) } : tx));
          setWallet(prev => ({ ...prev, available: prev.available + amount }));
          addNotification("Deposit Confirmed", `${amount} ${wallet.currency} credited to your balance.`, "success");
          addAudit(`Account credited: +${amount} ${wallet.currency}`, 'low');
        }, 4000);
    });
  };

  const handleWithdrawal = async (amount: number, address: string) => {
    if (amount > wallet.available) return;
    simulateTransaction('Withdrawal', () => {
        setWallet(prev => ({ ...prev, available: prev.available - amount, pending: prev.pending + amount }));
        addTransaction({ type: 'withdraw', amount, status: 'pending' });
        addAudit(`Withdrawal requested to ${address.substring(0, 8)}...`, 'medium');
        setTimeout(() => {
          setTransactions(prev => prev.map(tx => tx.type === 'withdraw' && tx.status === 'pending' ? { ...tx, status: 'completed', txHash: '0x' + Math.random().toString(16).slice(2, 12) } : tx));
          setWallet(prev => ({ ...prev, pending: prev.pending - amount }));
          addNotification("Transaction Confirmed", "On-chain verification complete.", "success");
          addAudit(`Withdrawal finalized: -${amount} ${wallet.currency}`, 'low');
        }, 5000);
    });
  };

  const handleToggleBotStatus = (botId: string) => {
    const bot = bots.find(b => b.id === botId);
    if (!bot) return;
    const isActivating = bot.status === BotStatus.STOPPED;
    handleRequestConfirmation(
        isActivating ? 'Confirm Activation' : 'Confirm Deactivation',
        `This will ${isActivating ? 'start' : 'stop'} the "${bot.name}" protocol on-chain.`,
        () => {
            simulateTransaction(isActivating ? 'Activate Protocol' : 'Halt Protocol', () => {
                setBots(current => current.map(b => {
                    if (b.id === botId) {
                        addAudit(`Protocol ${isActivating ? 'Start' : 'Halt'}: ${b.name}`, 'low');
                        return { ...b, status: isActivating ? BotStatus.RUNNING : BotStatus.STOPPED };
                    }
                    return b;
                }));
            });
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

    simulateTransaction('Deploy Strategy', () => {
        const newBot: Bot = {
          id: `bot-${Date.now()}`, name: data.name, pair: data.pair, strategy: data.strategy,
          status: BotStatus.STOPPED, pnl: 0, pnlPercent: 0, uptime: '0h',
          totalTrades: 0, winRate: 50, riskLevel: data.riskLevel, collateral: investment,
          trades: [], walletAddress: walletApi.connectedAccount || undefined,
          weeklyPnlPercent: 0, monthlyPnlPercent: 0, lastChainSync: Date.now()
        };
        setWallet(prev => ({ ...prev, available: prev.available - investment, allocated: prev.allocated + investment }));
        setBots(prev => [...prev, newBot]);
        addTransaction({ type: 'allocation', amount: investment, status: 'completed' });
        toggleModal('createBot', false);
        addNotification("Bot Active", `${newBot.name} is now monitoring the ${newBot.pair} stream.`, "success");
        addAudit(`Strategic allocation of ${investment} to ${newBot.name}`);
    });
  };
  
  const handleProtocolReset = () => {
    handleRequestConfirmation(
        'System Halt Confirmation',
        'This will immediately stop and delete all active bot protocols. This action is irreversible.',
        () => {
          simulateTransaction('System Halt', () => {
            addAudit("System Reset Protocol Triggered", "high");
            setBots([]);
            addNotification("System Halt", "All bot protocols have been purged.", "warning");
          });
        },
        'Confirm System Halt',
        'danger'
    );
  };
  
  const handleIpfsSave = useCallback(async () => {
    setIsIpfsSaving(true);
    addAudit("IPFS snapshot initiated", "low");
    await new Promise(resolve => setTimeout(resolve, 2500));
    const mockCid = `bafybeig...${Math.random().toString(16).slice(2, 10)}`;
    addNotification("Decentralized Backup", `Configuration saved to IPFS. CID: ${mockCid}`, "success");
    addAudit(`IPFS snapshot successful: ${mockCid}`);
    setIsIpfsSaving(false);
  }, [addAudit, addNotification]);

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
            totalTrades: Math.random() > 0.95 ? bot.totalTrades + 1 : bot.totalTrades,
            winRate: Math.max(40, Math.min(95, bot.winRate + (Math.random() - 0.5)))
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
          isSyncing={isSyncing} onSync={handleSyncBlockchain}
          onOpenAlerts={() => toggleModal('alerts', true)}
          alertCount={alerts.filter(a => a.isActive).length}
          onOpenSecurityModal={() => toggleModal('security', true)}
          onOpenPatternRecognition={handlePatternAnalysis}
          connectedAccount={walletApi.connectedAccount}
          onConnectWallet={() => {
            if (walletApi.hasProvider) {
              toggleModal('connectWallet', true);
            } else {
              toggleModal('installWallet', true);
            }
          }}
          onDisconnectWallet={walletApi.disconnectWallet}
        />
        
        <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-8">
          <Dashboard
            bots={bots} isAdmin={isAdmin} wallet={wallet}
            radarSignals={radarSignals} dailySignals={dailySignals}
            connectedAccount={walletApi.connectedAccount}
            portfolioMetrics={portfolioMetrics}
            isPortfolioSyncing={isPortfolioSyncing}
            onSyncPortfolio={handleSyncPortfolioToChain}
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
            onOpenEarnModal={handleOpenEarnModal}
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
        connectedAccount={walletApi.connectedAccount}
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
      <SecuritySettingsModal 
        isOpen={modals.security} 
        onClose={() => toggleModal('security', false)} 
        profile={userProfile} 
        auditLogs={auditLogs} 
        onIpfsSave={handleIpfsSave}
        isIpfsSaving={isIpfsSaving}
      />
      <WhitelistModal 
        isOpen={modals.whitelist} onClose={() => toggleModal('whitelist', false)} 
        whitelist={whitelist} onTogglePair={() => {}} onAddPair={() => {}} onDeletePair={() => {}}
      />
      <PriceAlertsModal isOpen={modals.alerts} onClose={() => toggleModal('alerts', false)} alerts={alerts} onAddAlert={() => {}} onDeleteAlert={() => {}} onToggleAlert={() => {}} />
      <ConnectWalletModal
        isOpen={modals.connectWallet}
        onClose={() => toggleModal('connectWallet', false)}
        walletApi={walletApi}
      />
      <InstallWalletModal 
        isOpen={modals.installWallet}
        onClose={() => toggleModal('installWallet', false)}
      />
      <EarnModal
        isOpen={modals.earn}
        onClose={() => toggleModal('earn', false)}
        onClaimFaucet={handleClaimFaucet}
        onCompleteMission={handleCompleteMission}
        isMissionLoading={earnMission.loading}
        mission={earnMission.mission}
        lastFaucetClaim={wallet.lastFaucetClaim}
      />
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